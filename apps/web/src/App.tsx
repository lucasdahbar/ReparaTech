import { useState } from 'react';
import { NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { encerrarSessao, obterSessaoSalva } from './lib/api';
import { AtendentePage } from './pages/AtendentePage';
import { ClientePage } from './pages/ClientePage';
import { LoginPage } from './pages/LoginPage';
import { TecnicoPage } from './pages/TecnicoPage';
import type { PerfilUsuario, Sessao } from './types';

const rotaInicialPorPerfil: Record<PerfilUsuario, string> = {
  ADMIN: '/atendente',
  ATENDENTE: '/atendente',
  TECNICO: '/tecnico'
};

function obterRotaInicial(perfil: PerfilUsuario) {
  return rotaInicialPorPerfil[perfil] ?? '/atendente';
}

type LayoutPrincipalProps = {
  sessao: Sessao | null;
  onLogout: () => void;
};

function LayoutPrincipal({ sessao, onLogout }: LayoutPrincipalProps) {
  const podeAcessarAtendente = sessao?.usuario.perfil === 'ADMIN' || sessao?.usuario.perfil === 'ATENDENTE';
  const podeAcessarTecnico = sessao?.usuario.perfil === 'ADMIN' || sessao?.usuario.perfil === 'TECNICO';

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand-card">
          <span className="brand-kicker">Assistencia tecnica</span>
          <h1>ReparaTech</h1>
          <p>Gestao de clientes, ordens de servico, estoque e acompanhamento por perfil.</p>
        </div>

        <nav className="nav-list">
          {podeAcessarAtendente ? (
            <NavLink to="/atendente" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <span>Atendente</span>
              <small>Abertura de OS e cadastro de clientes</small>
            </NavLink>
          ) : null}
          {podeAcessarTecnico ? (
            <NavLink to="/tecnico" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <span>Tecnico</span>
              <small>Manutencao e baixa de pecas</small>
            </NavLink>
          ) : null}
          <NavLink to="/cliente" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span>Cliente</span>
            <small>Consulta de status</small>
          </NavLink>
        </nav>

        {sessao ? (
          <div className="session-card">
            <span>{sessao.usuario.perfil}</span>
            <strong>{sessao.usuario.nome}</strong>
            <small>{sessao.usuario.email}</small>
            <button type="button" className="button-secondary" onClick={onLogout}>
              Sair
            </button>
          </div>
        ) : null}

        <div className="status-card">
          <span className="status-pill">Marcos entregues</span>
          <h2>Banco modelado e clientes funcionando</h2>
          <p>O primeiro ciclo ja deixa a estrutura pronta para evoluir o nucleo de OS e o inventario.</p>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

type RotaProtegidaProps = {
  sessao: Sessao | null;
  perfis: PerfilUsuario[];
};

function RotaProtegida({ sessao, perfis }: RotaProtegidaProps) {
  const location = useLocation();

  if (!sessao) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!perfis.includes(sessao.usuario.perfil)) {
    return <Navigate to={obterRotaInicial(sessao.usuario.perfil)} replace />;
  }

  return <Outlet />;
}

function LoginRoute({ sessao, onLogin }: { sessao: Sessao | null; onLogin: (sessao: Sessao) => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const destinoAposLogin = typeof location.state?.from === 'string' ? location.state.from : null;

  if (sessao) {
    return <Navigate to={obterRotaInicial(sessao.usuario.perfil)} replace />;
  }

  return (
    <LoginPage
      onLogin={(novaSessao) => {
        onLogin(novaSessao);
        navigate(destinoAposLogin ?? obterRotaInicial(novaSessao.usuario.perfil), { replace: true });
      }}
    />
  );
}

export function App() {
  const [sessao, setSessao] = useState<Sessao | null>(() => obterSessaoSalva());
  const navigate = useNavigate();

  const fazerLogout = () => {
    encerrarSessao();
    setSessao(null);
    navigate('/login', { replace: true });
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginRoute sessao={sessao} onLogin={setSessao} />} />
      <Route element={<LayoutPrincipal sessao={sessao} onLogout={fazerLogout} />}>
        <Route path="/" element={<Navigate to={sessao ? obterRotaInicial(sessao.usuario.perfil) : '/login'} replace />} />
        <Route element={<RotaProtegida sessao={sessao} perfis={['ADMIN', 'ATENDENTE']} />}>
          <Route path="/atendente" element={<AtendentePage />} />
        </Route>
        <Route element={<RotaProtegida sessao={sessao} perfis={['ADMIN', 'TECNICO']} />}>
          <Route path="/tecnico" element={<TecnicoPage />} />
        </Route>
        <Route path="/cliente" element={<ClientePage />} />
      </Route>
    </Routes>
  );
}
