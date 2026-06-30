import { FormEvent, useState } from 'react';

import { consultarStatusPublico } from '../lib/api';
import type { ConsultaStatusResultado } from '../types';

const MENSAGEM_NAO_LOCALIZADO = 'Protocolo ou CPF não localizado. Verifique os dados digitados.';

function formatarData(dataISO: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dataISO));
}

export function ClientePage() {
  const [protocolo, setProtocolo] = useState('');
  const [cpf, setCpf] = useState('');
  const [resultado, setResultado] = useState<ConsultaStatusResultado | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [consultando, setConsultando] = useState(false);

  const consultarStatus = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setConsultando(true);
    setResultado(null);
    setErro(null);

    try {
      const consulta = await consultarStatusPublico(protocolo, cpf);
      setResultado(consulta);
    } catch {
      setErro(MENSAGEM_NAO_LOCALIZADO);
    } finally {
      setConsultando(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <span className="eyebrow">Cliente</span>
          <h2>Consulta de status</h2>
          <p>
            Acompanhe o andamento da ordem de serviço usando apenas o protocolo informado pela assistência
            e o CPF cadastrado no atendimento.
          </p>
        </div>

        <div className="notice-card">
          <h3>Consulta pública</h3>
          <p>Esta área mostra somente protocolo, status, aparelho e data de entrada.</p>
        </div>
      </section>

      <section className="two-column-grid">
        <form className="panel-card form-card" onSubmit={consultarStatus}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">Acompanhar OS</span>
              <h3>Informe seus dados</h3>
            </div>
          </div>

          <div className="form-grid">
            <label className="full-width">
              <span>Protocolo *</span>
              <input
                value={protocolo}
                onChange={(evento) => setProtocolo(evento.target.value)}
                placeholder="OS-000001"
                required
              />
            </label>

            <label className="full-width">
              <span>CPF *</span>
              <input
                value={cpf}
                onChange={(evento) => setCpf(evento.target.value)}
                placeholder="00000000000"
                required
              />
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="button-primary" disabled={consultando}>
              {consultando ? 'Consultando...' : 'Consultar status'}
            </button>
            <span className="helper-text">Use o CPF exatamente como foi cadastrado na assistência.</span>
          </div>

          {erro ? <div className="feedback error">{erro}</div> : null}
        </form>

        <section className="panel-card list-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Resultado</span>
              <h3>Status da ordem de serviço</h3>
            </div>
          </div>

          {!resultado ? (
            <div className="empty-state">Informe o protocolo e o CPF para consultar o andamento.</div>
          ) : (
            <div className="status-flow">
              <article className="status-step">
                <strong>{resultado.status}</strong>
                <p>Status atual do atendimento.</p>
              </article>

              <article className="status-step">
                <strong>{resultado.protocolo}</strong>
                <p>Protocolo da ordem de serviço.</p>
              </article>

              <article className="status-step">
                <strong>{`${resultado.aparelho.marca} ${resultado.aparelho.modelo}`}</strong>
                <p>Aparelho vinculado ao atendimento.</p>
              </article>

              <article className="status-step">
                <strong>{formatarData(resultado.dataEntrada)}</strong>
                <p>Data de entrada na assistência.</p>
              </article>
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
