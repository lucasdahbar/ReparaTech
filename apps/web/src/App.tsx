import { useState } from 'react';
import { NavLink, Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { encerrarSessao, obterSessaoSalva } from './lib/api';
import { AtendentePage } from './pages/AtendentePage';
import { ClientePage } from './pages/ClientePage';
import { LoginPage } from './pages/LoginPage';
import { TecnicoPage } from './pages/TecnicoPage';
import type { Sessao } from './types';

type LayoutPrincipalProps = {
  sessao: Sessao | null;
  onLogout: () => void;
};

type RotaProtegidaProps = {
  sessao: Sessao | null;
  children: JSX.Element;
};

function RotaProtegida({ sessao, children }: RotaProtegidaProps) {
  if (!sessao) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function LayoutPrincipal({ sessao, onLogout }: LayoutPrincipalProps) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand-card">
          <span className="brand-kicker">Assistência técnica</span>
          <h1>ReparaTech</h1>
          <p>Gestão de clientes, ordens de serviço, estoque e acompanhamento por perfil.</p>
        </div>

        <nav className="nav-list">
          <NavLink to="/atendente" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span>Atendente</span>
            <small>Abertura de OS e cadastro de clientes</small>
          </NavLink>
          <NavLink to="/tecnico" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span>Técnico</span>
            <small>Manutenção e baixa de peças</small>
          </NavLink>
          <NavLink to="/cliente" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span>Cliente</span>
            <small>Consulta de status</small>
          </NavLink>
        </nav>

        <div className="status-card">
          <span className="status-pill">{sessao ? sessao.usuario.perfil : 'Area publica'}</span>
          <h2>{sessao ? sessao.usuario.nome : 'Consulta do cliente'}</h2>
          <p>{sessao ? sessao.usuario.email : 'Acompanhe uma ordem de servico sem login.'}</p>
          {sessao ? (
            <button type="button" className="button-secondary" onClick={onLogout}>
              Sair
            </button>
          ) : null}
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export function App() {
  const [sessao, setSessao] = useState<Sessao | null>(() => obterSessaoSalva());

  const sair = () => {
    encerrarSessao();
    setSessao(null);
  };

  return (
    <Routes>
      <Route path="/login" element={sessao ? <Navigate to="/atendente" replace /> : <LoginPage onLogin={setSessao} />} />
      <Route element={<LayoutPrincipal sessao={sessao} onLogout={sair} />}>
        <Route path="/" element={<Navigate to="/atendente" replace />} />
        <Route
          path="/atendente"
          element={
            <RotaProtegida sessao={sessao}>
              <AtendentePage />
            </RotaProtegida>
          }
        />
        <Route
          path="/tecnico"
          element={
            <RotaProtegida sessao={sessao}>
              <TecnicoPage />
            </RotaProtegida>
          }
        />
        <Route path="/cliente" element={<ClientePage />} />
      </Route>
    </Routes>
  );
}
