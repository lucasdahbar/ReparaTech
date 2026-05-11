import { NavLink, Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { AtendentePage } from './pages/AtendentePage';
import { ClientePage } from './pages/ClientePage';
import { TecnicoPage } from './pages/TecnicoPage';

function LayoutPrincipal() {
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
          <span className="status-pill">Marcos entregues</span>
          <h2>Banco modelado e clientes funcionando</h2>
          <p>O primeiro ciclo já deixa a estrutura pronta para evoluir o núcleo de OS e o inventário.</p>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<LayoutPrincipal />}>
        <Route path="/" element={<Navigate to="/atendente" replace />} />
        <Route path="/atendente" element={<AtendentePage />} />
        <Route path="/tecnico" element={<TecnicoPage />} />
        <Route path="/cliente" element={<ClientePage />} />
      </Route>
    </Routes>
  );
}
