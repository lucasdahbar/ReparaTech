import { statusOrdemServico, statusOrdemServicoDetalhes } from '../types';

const pontosDeFoco = [
  'Baixa automática das peças consumidas em OS.',
  'Histórico de manutenção por equipamento.',
  'Controle de status até a finalização.'
];

export function TecnicoPage() {
  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <span className="eyebrow">Técnico</span>
          <h2>Manutenção e estoque</h2>
          <p>
            Esta área vai concentrar a execução técnica da ordem de serviço, o consumo de peças e a
            atualização do status operacional.
          </p>
        </div>

        <div className="notice-card">
          <h3>Regras centrais da OS</h3>
          <p>
            Uma ordem de serviço só avança seguindo o fluxo definido no enunciado: Aberta, Em Orçamento,
            Aguardando Peças, Em Manutenção, Pronta para Retirada e Finalizada.
          </p>
        </div>
      </section>

      <section className="panel-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Fluxo</span>
            <h3>Estados da ordem de serviço</h3>
          </div>
        </div>

        <div className="status-flow">
          {statusOrdemServico.map((status) => (
            <article key={status} className="status-step">
              <strong>{status}</strong>
              <p>{statusOrdemServicoDetalhes[status]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Foco técnico</span>
            <h3>O que esta tela vai controlar</h3>
          </div>
        </div>

        <div className="bullet-grid">
          {pontosDeFoco.map((item) => (
            <article key={item} className="bullet-card">
              <span className="bullet-dot" />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
