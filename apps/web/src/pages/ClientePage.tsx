const passos = [
  'Aberta',
  'Em Orçamento',
  'Aguardando Peças',
  'Em Manutenção',
  'Pronta para Retirada',
  'Finalizada'
];

export function ClientePage() {
  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <span className="eyebrow">Cliente</span>
          <h2>Consulta de status</h2>
          <p>
            O cliente terá uma visão simples e objetiva da própria ordem de serviço, sem acesso às
            rotinas internas do atendente ou do técnico.
          </p>
        </div>

        <div className="notice-card">
          <h3>Experiência prevista</h3>
          <p>
            A tela já nasce com a estrutura de acompanhamento do status para facilitar a evolução do
            módulo quando a OS estiver completa.
          </p>
        </div>
      </section>

      <section className="panel-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Visualização</span>
            <h3>Fluxo de atendimento</h3>
          </div>
        </div>

        <div className="timeline">
          {passos.map((passo, indice) => (
            <div key={passo} className={`timeline-step${indice === 3 ? ' current' : ''}`}>
              <span>{indice + 1}</span>
              <div>
                <strong>{passo}</strong>
                <p>
                  {indice === 0 && 'OS registrada e aguardando a primeira análise.'}
                  {indice === 1 && 'Orçamento enviado para aprovação.'}
                  {indice === 2 && 'Reparo depende da chegada da peça.'}
                  {indice === 3 && 'Serviço em execução pelo técnico.'}
                  {indice === 4 && 'Equipamento pronto para retirada.'}
                  {indice === 5 && 'Atendimento concluído.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel-card callout-card">
        <span className="status-pill">Portal do cliente</span>
        <h3>Consulta restrita ao andamento da OS</h3>
        <p>
          Quando o módulo de autenticação entrar, o cliente verá apenas o próprio número de ordem e o
          estágio atual do serviço.
        </p>
      </section>
    </div>
  );
}
