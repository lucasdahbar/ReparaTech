import { useEffect, useRef, useState } from 'react';
import { NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Wrench,
  Search,
  LogOut,
  Wifi,
  CircuitBoard
} from 'lucide-react';

import { encerrarSessao, obterSessaoSalva } from './lib/api';
import { AtendentePage } from './pages/AtendentePage';
import { ClientePage } from './pages/ClientePage';
import { LoginPage } from './pages/LoginPage';
import { TecnicoPage } from './pages/TecnicoPage';
import type { PerfilUsuario, Sessao } from './types';

type LayoutPrincipalProps = {
  sessao: Sessao | null;
  onLogout: () => void;
};

type AreaSistema = 'cliente' | 'atendente' | 'tecnico';

type RotaProtegidaProps = {
  sessao: Sessao | null;
  area: AreaSistema;
  children: JSX.Element;
};

const navegacao = [
  {
    area: 'atendente',
    to: '/atendente',
    icone: ClipboardList,
    label: 'Atendente',
    resumo: 'Clientes, aparelhos e OS',
    titulo: 'Atendimento',
    subtitulo: 'Cadastre clientes, registre aparelhos e abra ordens de serviço.'
  },
  {
    area: 'tecnico',
    to: '/tecnico',
    icone: Wrench,
    label: 'Técnico',
    resumo: 'Estoque e ciclo da OS',
    titulo: 'Bancada técnica',
    subtitulo: 'Controle o estoque de peças e conduza o ciclo de vida das OS.'
  },
  {
    area: 'cliente',
    to: '/cliente',
    icone: Search,
    label: 'Cliente',
    resumo: 'Consulta pública',
    titulo: 'Consulta de status',
    subtitulo: 'Acompanhe o andamento de uma ordem de serviço.'
  }
] as const;

const permissoes: Record<PerfilUsuario, AreaSistema[]> = {
  CLIENTE: ['cliente'],
  ATENDENTE: ['cliente', 'atendente'],
  TECNICO: ['cliente', 'tecnico'],
  ADMIN: ['cliente', 'atendente', 'tecnico']
};

function areasPermitidas(sessao: Sessao | null) {
  return sessao ? permissoes[sessao.usuario.perfil] : ['cliente'];
}

function rotaInicial(sessao: Sessao | null) {
  const areas = areasPermitidas(sessao);
  return navegacao.find((item) => areas.includes(item.area))?.to ?? '/cliente';
}

function podeAcessarArea(sessao: Sessao | null, area: AreaSistema) {
  return areasPermitidas(sessao).includes(area);
}

function RotaProtegida({ sessao, area, children }: RotaProtegidaProps) {
  if (!sessao) {
    return <Navigate to="/login" replace />;
  }

  if (!podeAcessarArea(sessao, area)) {
    return <Navigate to={rotaInicial(sessao)} replace />;
  }

  return children;
}

function iniciais(nome: string) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? '')
    .join('');
}

function ConteudoAnimado() {
  const { pathname } = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemento = ref.current;

    if (!elemento || typeof elemento.animate !== 'function') {
      return;
    }

    const prefereReduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefereReduzir) {
      return;
    }

    // Anima o container via Web Animations API (dispara sempre, sem depender de classe CSS).
    elemento.animate(
      [
        { opacity: 0, transform: 'translateX(36px)' },
        { opacity: 1, transform: 'translateX(0)' }
      ],
      { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' }
    );

    // Cascata: cada bloco da página entra escalonado.
    const blocos = elemento.querySelectorAll<HTMLElement>(':scope > .page-stack > *');
    blocos.forEach((bloco, indice) => {
      bloco.animate(
        [
          { opacity: 0, transform: 'translateY(16px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        {
          duration: 440,
          delay: 80 + indice * 70,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'both'
        }
      );
    });
  }, [pathname]);

  return (
    <div ref={ref}>
      <Outlet />
    </div>
  );
}

function LayoutPrincipal({ sessao, onLogout }: LayoutPrincipalProps) {
  const { pathname } = useLocation();
  const rotaAtual = navegacao.find((item) => pathname.startsWith(item.to)) ?? navegacao[0];
  const navegacaoVisivel = navegacao.filter((item) => podeAcessarArea(sessao, item.area));

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <CircuitBoard size={22} strokeWidth={2.2} />
          </span>
          <div className="brand-text">
            <strong>ReparaTech</strong>
            <small>Assistência técnica</small>
          </div>
        </div>

        <nav className="nav-list">
          <span className="nav-label">Áreas</span>
          {navegacaoVisivel.map((item) => {
            const Icone = item.icone;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">
                  <Icone size={18} strokeWidth={2} />
                </span>
                <span className="nav-text">
                  <span>{item.label}</span>
                  <small>{item.resumo}</small>
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {sessao ? (
            <div className="user-card">
              <span className="user-avatar">{iniciais(sessao.usuario.nome)}</span>
              <div className="user-info">
                <strong>{sessao.usuario.nome}</strong>
                <small>{sessao.usuario.perfil}</small>
              </div>
              <button type="button" className="icon-button" onClick={onLogout} title="Sair">
                <LogOut size={16} strokeWidth={2} />
              </button>
            </div>
          ) : (
            <div className="user-card">
              <span className="user-avatar user-avatar-public">
                <Search size={16} strokeWidth={2} />
              </span>
              <div className="user-info">
                <strong>Área pública</strong>
                <small>Consulta do cliente</small>
              </div>
            </div>
          )}
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="topbar-title">
            <h1>{rotaAtual.titulo}</h1>
            <p>{rotaAtual.subtitulo}</p>
          </div>
          <div className="topbar-meta">
            <span className="status-chip">
              <Wifi size={14} strokeWidth={2.2} />
              API conectada
            </span>
          </div>
        </header>

        <main className="content">
          <ConteudoAnimado />
        </main>
      </div>
    </div>
  );
}

export function App() {
  const [sessao, setSessao] = useState<Sessao | null>(() => obterSessaoSalva());
  const navigate = useNavigate();

  const sair = () => {
    encerrarSessao();
    setSessao(null);
    navigate('/login', { replace: true });
  };

  return (
    <Routes>
      <Route path="/login" element={sessao ? <Navigate to={rotaInicial(sessao)} replace /> : <LoginPage onLogin={setSessao} />} />
      <Route element={<LayoutPrincipal sessao={sessao} onLogout={sair} />}>
        <Route path="/" element={<Navigate to={sessao ? rotaInicial(sessao) : '/login'} replace />} />
        <Route
          path="/atendente"
          element={
            <RotaProtegida sessao={sessao} area="atendente">
              <AtendentePage />
            </RotaProtegida>
          }
        />
        <Route
          path="/tecnico"
          element={
            <RotaProtegida sessao={sessao} area="tecnico">
              <TecnicoPage />
            </RotaProtegida>
          }
        />
        <Route path="/cliente" element={<ClientePage />} />
      </Route>
    </Routes>
  );
}
