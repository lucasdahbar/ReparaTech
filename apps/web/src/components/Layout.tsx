import { NavLink, Outlet } from 'react-router-dom';

const navegacao = [
  { to: '/atendente', label: 'Atendente', resumo: 'Abertura de OS e clientes' },
  { to: '/tecnico', label: 'Técnico', resumo: 'Manutenção e peças' },
  { to: '/cliente', label: 'Cliente', resumo: 'Consulta de status' }
];

export function Layout() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand-card">
          <span className="brand-kicker">Sistema de gestão</span>
          <h1>ReparaTech</h1>
          <p>Plataforma para assistência técnica com foco em ordem de serviço, estoque e atendimento.</p>
        </div>

        <nav className="nav-list">
          {navegacao.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span>{item.label}</span>
              <small>{item.resumo}</small>
            </NavLink>
          ))}
        </nav>

        <div className="status-card">
          <span className="status-pill">MySQL + Node + React</span>
          <h2>Base técnica pronta</h2>
          <p>O primeiro ciclo entrega o banco modelado e o CRUD de clientes operando pela API.</p>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
