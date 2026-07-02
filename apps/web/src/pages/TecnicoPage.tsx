import { FormEvent, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Pencil, Trash2, Plus, PackagePlus, ArrowRight } from 'lucide-react';

import {
  atualizarPeca,
  atualizarStatusOrdemServico,
  cadastrarPeca,
  listarOrdensServico,
  listarPecas,
  removerPeca,
  vincularPecaNaOrdemServico
} from '../lib/api';
import type { OrdemServico, Peca, PecaFormulario, StatusOrdemServicoTecnico } from '../types';

const formularioPecaInicial: PecaFormulario = {
  nome: '',
  sku: '',
  descricao: '',
  quantidade: '0',
  custoUnitario: '',
  precoVenda: ''
};

const statusLabels: Record<string, string> = {
  ABERTA: 'Aberta',
  EM_ORCAMENTO: 'Em Orçamento',
  AGUARDANDO_PECAS: 'Aguardando Peças',
  EM_MANUTENCAO: 'Em Manutenção',
  PRONTA_PARA_RETIRADA: 'Pronta',
  FINALIZADA: 'Entregue'
};

const proximosStatusPermitidos: Record<StatusOrdemServicoTecnico, StatusOrdemServicoTecnico[]> = {
  ABERTA: ['EM_ORCAMENTO'],
  EM_ORCAMENTO: ['AGUARDANDO_PECAS', 'EM_MANUTENCAO'],
  AGUARDANDO_PECAS: ['EM_MANUTENCAO'],
  EM_MANUTENCAO: ['PRONTA_PARA_RETIRADA'],
  PRONTA_PARA_RETIRADA: ['FINALIZADA'],
  FINALIZADA: []
};

function formatarMoeda(valor: string | null) {
  if (!valor) {
    return 'Não informado';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(valor));
}

function formatarData(dataISO: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dataISO));
}

function montarFormularioPeca(peca: Peca): PecaFormulario {
  return {
    nome: peca.nome,
    sku: peca.sku,
    descricao: peca.descricao ?? '',
    quantidade: String(peca.quantidade),
    custoUnitario: String(peca.custoUnitario),
    precoVenda: peca.precoVenda ? String(peca.precoVenda) : ''
  };
}

export function TecnicoPage() {
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [formularioPeca, setFormularioPeca] = useState<PecaFormulario>(formularioPecaInicial);
  const [pecaSelecionadaId, setPecaSelecionadaId] = useState<string | null>(null);
  const [ordemSelecionadaId, setOrdemSelecionadaId] = useState('');
  const [buscaProtocolo, setBuscaProtocolo] = useState('');
  const [novoStatus, setNovoStatus] = useState<StatusOrdemServicoTecnico | ''>('');
  const [pecaUsoId, setPecaUsoId] = useState('');
  const [quantidadeUso, setQuantidadeUso] = useState('1');
  const [carregando, setCarregando] = useState(true);
  const [salvandoPeca, setSalvandoPeca] = useState(false);
  const [lancandoPeca, setLancandoPeca] = useState(false);
  const [atualizandoStatus, setAtualizandoStatus] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregarDados = async () => {
    setCarregando(true);
    setErro(null);

    try {
      const [respostaPecas, respostaOrdens] = await Promise.all([listarPecas(), listarOrdensServico()]);
      setPecas(respostaPecas.pecas);
      setOrdens(respostaOrdens.ordens);

      const primeiraOrdem = respostaOrdens.ordens[0];

      if (!ordemSelecionadaId && primeiraOrdem) {
        setOrdemSelecionadaId(primeiraOrdem.id);
      }
    } catch (erroFetch) {
      setErro(erroFetch instanceof Error ? erroFetch.message : 'Não foi possível carregar os dados técnicos.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    void carregarDados();
  }, []);

  useEffect(() => {
    setNovoStatus('');
  }, [ordemSelecionadaId]);

  const ordemSelecionada = useMemo(() => {
    return ordens.find((ordem) => ordem.id === ordemSelecionadaId) ?? null;
  }, [ordemSelecionadaId, ordens]);

  const historicoStatusOrdemSelecionada = useMemo(() => {
    return ordemSelecionada?.historicoStatus ?? [];
  }, [ordemSelecionada]);

  const ordensFiltradas = useMemo(() => {
    const termo = buscaProtocolo.trim().toLowerCase();

    if (!termo) {
      return ordens;
    }

    return ordens.filter((ordem) => ordem.numero.toLowerCase().includes(termo));
  }, [buscaProtocolo, ordens]);

  const proximosStatus = ordemSelecionada
    ? proximosStatusPermitidos[ordemSelecionada.status as StatusOrdemServicoTecnico] ?? []
    : [];

  const pecaUsoSelecionada = useMemo(() => {
    return pecas.find((peca) => peca.id === pecaUsoId) ?? null;
  }, [pecaUsoId, pecas]);

  const estatisticas = useMemo(() => {
    return {
      totalPecas: pecas.length,
      saldoTotal: pecas.reduce((total, peca) => total + peca.quantidade, 0),
      pecasSemSaldo: pecas.filter((peca) => peca.quantidade === 0).length
    };
  }, [pecas]);

  const limparFormularioPeca = () => {
    setFormularioPeca(formularioPecaInicial);
    setPecaSelecionadaId(null);
  };

  const salvarPeca = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setSalvandoPeca(true);
    setMensagem(null);
    setErro(null);

    try {
      if (pecaSelecionadaId) {
        await atualizarPeca(pecaSelecionadaId, formularioPeca);
        setMensagem('Peça atualizada com sucesso.');
      } else {
        await cadastrarPeca(formularioPeca);
        setMensagem('Peça cadastrada com sucesso.');
      }

      limparFormularioPeca();
      await carregarDados();
    } catch (erroOperacao) {
      setErro(erroOperacao instanceof Error ? erroOperacao.message : 'Não foi possível salvar a peça.');
    } finally {
      setSalvandoPeca(false);
    }
  };

  const editarPeca = (peca: Peca) => {
    setPecaSelecionadaId(peca.id);
    setFormularioPeca(montarFormularioPeca(peca));
    setMensagem('Peça pronta para edição.');
    setErro(null);
  };

  const excluirPeca = async (peca: Peca) => {
    const confirmado = window.confirm(`Deseja remover a peça ${peca.nome}?`);

    if (!confirmado) {
      return;
    }

    setSalvandoPeca(true);
    setMensagem(null);
    setErro(null);

    try {
      await removerPeca(peca.id);
      if (pecaSelecionadaId === peca.id) {
        limparFormularioPeca();
      }
      setMensagem('Peça removida com sucesso.');
      await carregarDados();
    } catch (erroRemocao) {
      setErro(
        erroRemocao instanceof Error
          ? erroRemocao.message
          : 'Não foi possível remover a peça. Verifique se ela já foi usada em uma OS.'
      );
    } finally {
      setSalvandoPeca(false);
    }
  };

  const lancarPecaNaOS = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setLancandoPeca(true);
    setMensagem(null);
    setErro(null);

    try {
      if (!ordemSelecionadaId || !pecaUsoId) {
        throw new Error('Selecione uma OS e uma peça para lançar.');
      }

      await vincularPecaNaOrdemServico(ordemSelecionadaId, pecaUsoId, quantidadeUso);
      setMensagem('Peça lançada na ordem de serviço com baixa automática de estoque.');
      setQuantidadeUso('1');
      await carregarDados();
    } catch (erroOperacao) {
      setErro(erroOperacao instanceof Error ? erroOperacao.message : 'Não foi possível lançar a peça na OS.');
    } finally {
      setLancandoPeca(false);
    }
  };

  const alterarStatusOS = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setAtualizandoStatus(true);
    setMensagem(null);
    setErro(null);

    try {
      if (!ordemSelecionadaId || !novoStatus) {
        throw new Error('Selecione uma OS e o novo status.');
      }

      await atualizarStatusOrdemServico(ordemSelecionadaId, novoStatus);
      setMensagem('Status da ordem de serviço atualizado com sucesso.');
      setNovoStatus('');
      await carregarDados();
    } catch (erroOperacao) {
      setErro(erroOperacao instanceof Error ? erroOperacao.message : 'Não foi possível alterar o status da OS.');
    } finally {
      setAtualizandoStatus(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <span className="eyebrow">Técnico</span>
          <h2>Ciclo da OS e uso de peças</h2>
          <p>
            Controle as peças disponíveis, ajuste saldo e preço, e lance o consumo diretamente na ordem de
            serviço com baixa automática de estoque.
          </p>
        </div>

        <div className="hero-grid">
          <article className="metric-card">
            <span>Peças</span>
            <strong>{estatisticas.totalPecas}</strong>
            <small>itens cadastrados</small>
          </article>
          <article className="metric-card">
            <span>Saldo total</span>
            <strong>{estatisticas.saldoTotal}</strong>
            <small>unidades em estoque</small>
          </article>
          <article className="metric-card">
            <span>Sem saldo</span>
            <strong>{estatisticas.pecasSemSaldo}</strong>
            <small>peças para reposição</small>
          </article>
        </div>
      </section>

      {(mensagem || erro) && (
        <section className="feedback-stack">
          {mensagem ? <div className="feedback success">{mensagem}</div> : null}
          {erro ? <div className="feedback error">{erro}</div> : null}
        </section>
      )}

      <details className="drawer-card" style={{ order: 4 }}>
        <summary className="drawer-trigger">
          <span className="drawer-title">
            <span className="eyebrow">Estoque</span>
            <strong>Estoque de peças</strong>
            <small>Cadastro, edição e consulta dos itens disponíveis.</small>
          </span>
          <span className="drawer-icon" aria-hidden="true" />
        </summary>

        <div className="drawer-content">
          <section className="two-column-grid">
            <form className="panel-card form-card" onSubmit={salvarPeca}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">Estoque</span>
              <h3>{pecaSelecionadaId ? 'Editar peça' : 'Cadastrar peça'}</h3>
            </div>
            <button type="button" className="button-secondary" onClick={limparFormularioPeca}>
              Limpar
            </button>
          </div>

          <div className="form-grid">
            <label>
              <span>Nome *</span>
              <input
                value={formularioPeca.nome}
                onChange={(evento) => setFormularioPeca((estado) => ({ ...estado, nome: evento.target.value }))}
                placeholder="Tela, bateria, conector..."
                required
              />
            </label>

            <label>
              <span>SKU *</span>
              <input
                value={formularioPeca.sku}
                onChange={(evento) => setFormularioPeca((estado) => ({ ...estado, sku: evento.target.value }))}
                placeholder="TELA-SAM-A01"
                required
              />
            </label>

            <label>
              <span>Quantidade *</span>
              <input
                min="0"
                type="number"
                value={formularioPeca.quantidade}
                onChange={(evento) => setFormularioPeca((estado) => ({ ...estado, quantidade: evento.target.value }))}
                required
              />
            </label>

            <label>
              <span>Custo unitário *</span>
              <input
                min="0.01"
                step="0.01"
                type="number"
                value={formularioPeca.custoUnitario}
                onChange={(evento) => setFormularioPeca((estado) => ({ ...estado, custoUnitario: evento.target.value }))}
                placeholder="0.00"
                required
              />
            </label>

            <label>
              <span>Preço de venda</span>
              <input
                min="0"
                step="0.01"
                type="number"
                value={formularioPeca.precoVenda}
                onChange={(evento) => setFormularioPeca((estado) => ({ ...estado, precoVenda: evento.target.value }))}
                placeholder="0.00"
              />
            </label>

            <label className="full-width">
              <span>Descrição</span>
              <textarea
                value={formularioPeca.descricao}
                onChange={(evento) => setFormularioPeca((estado) => ({ ...estado, descricao: evento.target.value }))}
                placeholder="Detalhes, compatibilidade ou observações internas"
                rows={4}
              />
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="button-primary" disabled={salvandoPeca}>
              {!salvandoPeca ? <Plus size={15} strokeWidth={2.2} /> : null}
              {salvandoPeca ? 'Salvando...' : pecaSelecionadaId ? 'Atualizar peça' : 'Cadastrar peça'}
            </button>
            <span className="helper-text">Quantidade negativa e custo zerado são bloqueados pela API.</span>
          </div>
        </form>

        <section className="panel-card list-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Peças</span>
              <h3>Itens em estoque</h3>
            </div>
            <button type="button" className="button-secondary" onClick={() => void carregarDados()}>
              <RefreshCw size={14} strokeWidth={2} />
              Recarregar
            </button>
          </div>

          {carregando ? (
            <div className="empty-state">Carregando estoque...</div>
          ) : pecas.length === 0 ? (
            <div className="empty-state">Nenhuma peça cadastrada ainda.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Peça</th>
                    <th>Saldo</th>
                    <th>Valores</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {pecas.map((peca) => (
                    <tr key={peca.id}>
                      <td>
                        <strong>{peca.nome}</strong>
                        <small>{peca.sku}</small>
                      </td>
                      <td>
                        <strong>{peca.quantidade}</strong>
                        <small>{peca.quantidade > 0 ? 'Disponível' : 'Sem saldo'}</small>
                      </td>
                      <td>
                        <strong>{formatarMoeda(peca.precoVenda)}</strong>
                        <small>Custo: {formatarMoeda(peca.custoUnitario)}</small>
                      </td>
                      <td>
                        <div className="action-group">
                          <button type="button" className="button-secondary" onClick={() => editarPeca(peca)}>
                            <Pencil size={14} strokeWidth={2} />
                            Editar
                          </button>
                          <button type="button" className="button-danger" onClick={() => void excluirPeca(peca)}>
                            <Trash2 size={14} strokeWidth={2} />
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
          </section>
        </div>
      </details>

      <details className="drawer-card" style={{ order: 2 }}>
        <summary className="drawer-trigger">
          <span className="drawer-title">
            <span className="eyebrow">Ciclo da OS</span>
            <strong>Ordens de Serviço</strong>
            <small>Busca, seleção e alteração de status da OS.</small>
          </span>
          <span className="drawer-icon" aria-hidden="true" />
        </summary>

        <div className="drawer-content">
          <section className="two-column-grid">
            <section className="panel-card list-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Ciclo da OS</span>
              <h3>Ordens de serviço</h3>
            </div>
            <button type="button" className="button-secondary" onClick={() => void carregarDados()}>
              <RefreshCw size={14} strokeWidth={2} />
              Recarregar
            </button>
          </div>

          <label>
            <span>Buscar por protocolo</span>
            <input
              value={buscaProtocolo}
              onChange={(evento) => setBuscaProtocolo(evento.target.value)}
              placeholder="OS-..."
            />
          </label>

          {carregando ? (
            <div className="empty-state">Carregando ordens de serviço...</div>
          ) : ordensFiltradas.length === 0 ? (
            <div className="empty-state">Nenhuma OS encontrada.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Protocolo</th>
                    <th>Cliente</th>
                    <th>Aparelho</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ordensFiltradas.map((ordem) => (
                    <tr key={ordem.id}>
                      <td>
                        <button type="button" className="button-secondary" onClick={() => setOrdemSelecionadaId(ordem.id)}>
                          {ordem.numero}
                        </button>
                        <small>{formatarData(ordem.dataAbertura)}</small>
                      </td>
                      <td>
                        <strong>{ordem.cliente.nome}</strong>
                        <small>{ordem.cliente.documento ?? 'Sem documento'}</small>
                      </td>
                      <td>
                        <strong>{`${ordem.aparelho.marca} ${ordem.aparelho.modelo}`}</strong>
                        <small>{ordem.aparelho.numeroSerie ?? 'Sem serial'}</small>
                      </td>
                      <td>
                        <strong>{statusLabels[ordem.status] ?? ordem.status}</strong>
                        <small>{ordem.status === 'FINALIZADA' ? 'Encerrada' : 'Em andamento'}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <form className="panel-card form-card" onSubmit={alterarStatusOS}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">Status</span>
              <h3>Alterar status da OS</h3>
            </div>
          </div>

          {!ordemSelecionada ? (
            <div className="empty-state">Selecione uma OS para gerenciar o status.</div>
          ) : (
            <>
              <div className="order-summary">
                <article className="summary-card">
                  <strong>{ordemSelecionada.numero}</strong>
                  <span>{statusLabels[ordemSelecionada.status] ?? ordemSelecionada.status}</span>
                  <small>{ordemSelecionada.cliente.nome}</small>
                  <small>{`${ordemSelecionada.aparelho.marca} ${ordemSelecionada.aparelho.modelo}`}</small>
                  <small>Defeito: {ordemSelecionada.descricaoEntrada}</small>
                  <small>Aberta em {formatarData(ordemSelecionada.dataAbertura)}</small>
                </article>

                <article className="summary-card">
                  <strong>Histórico de status</strong>
                  {historicoStatusOrdemSelecionada.length === 0 ? (
                    <small>Sem alterações registradas.</small>
                  ) : (
                    <ul className="status-history-list">
                      {historicoStatusOrdemSelecionada.map((item) => (
                        <li key={item.id}>
                          <strong>{statusLabels[item.status] ?? item.status}</strong>
                          <small>{formatarData(item.criadoEm)}</small>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </div>

              {ordemSelecionada.status === 'FINALIZADA' ? (
                <div className="empty-state compact">OS entregue/finalizada. O status não pode ser alterado.</div>
              ) : (
                <>
                  <label>
                    <span>Novo status *</span>
                    <select
                      value={novoStatus}
                      onChange={(evento) => setNovoStatus(evento.target.value as StatusOrdemServicoTecnico)}
                      required
                    >
                      <option value="">Selecione o próximo status</option>
                      {proximosStatus.map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status] ?? status}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="form-actions">
                    <button type="submit" className="button-primary" disabled={atualizandoStatus || !novoStatus}>
                      {!atualizandoStatus ? <ArrowRight size={15} strokeWidth={2.2} /> : null}
                      {atualizandoStatus ? 'Atualizando...' : 'Atualizar status'}
                    </button>
                    <span className="helper-text">As transições são validadas pela API.</span>
                  </div>
                </>
              )}
            </>
          )}
        </form>
          </section>
        </div>
      </details>

      <details className="drawer-card" style={{ order: 3 }}>
        <summary className="drawer-trigger">
          <span className="drawer-title">
            <span className="eyebrow">Uso na OS</span>
            <strong>Peças usadas na OS</strong>
            <small>Lançamento e conferência das peças consumidas.</small>
          </span>
          <span className="drawer-icon" aria-hidden="true" />
        </summary>

        <div className="drawer-content">
          <section className="two-column-grid">
            <form className="panel-card form-card" onSubmit={lancarPecaNaOS}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">Ordem de serviço</span>
              <h3>Lançar peça utilizada</h3>
            </div>
          </div>

          <div className="form-grid">
            <label className="full-width">
              <span>OS *</span>
              <select
                value={ordemSelecionadaId}
                onChange={(evento) => setOrdemSelecionadaId(evento.target.value)}
                required
              >
                <option value="">Selecione uma OS</option>
                {ordens.map((ordem) => (
                  <option key={ordem.id} value={ordem.id}>
                    {ordem.numero} - {ordem.cliente.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="full-width">
              <span>Peça disponível *</span>
              <select value={pecaUsoId} onChange={(evento) => setPecaUsoId(evento.target.value)} required>
                <option value="">Selecione uma peça</option>
                {pecas.map((peca) => (
                  <option key={peca.id} value={peca.id} disabled={peca.quantidade === 0}>
                    {peca.nome} - saldo {peca.quantidade}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Quantidade utilizada *</span>
              <input
                min="1"
                max={pecaUsoSelecionada?.quantidade}
                type="number"
                value={quantidadeUso}
                onChange={(evento) => setQuantidadeUso(evento.target.value)}
                required
              />
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="button-primary" disabled={lancandoPeca || pecas.length === 0 || ordens.length === 0}>
              {!lancandoPeca ? <PackagePlus size={15} strokeWidth={2.2} /> : null}
              {lancandoPeca ? 'Lançando...' : 'Adicionar peça na OS'}
            </button>
            <span className="helper-text">A API valida o saldo e registra a movimentação de saída automaticamente.</span>
          </div>
        </form>

        <section className="panel-card list-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Uso na OS</span>
              <h3>Peças utilizadas</h3>
            </div>
          </div>

          {!ordemSelecionada ? (
            <div className="empty-state">Selecione uma OS para ver as peças utilizadas.</div>
          ) : (
            <div className="order-summary">
              <article className="summary-card">
                <strong>{ordemSelecionada.numero}</strong>
                <span>{statusLabels[ordemSelecionada.status] ?? ordemSelecionada.status}</span>
                <small>
                  {ordemSelecionada.cliente.nome} - {ordemSelecionada.aparelho.marca} {ordemSelecionada.aparelho.modelo}
                </small>
                <small>Aberta em {formatarData(ordemSelecionada.dataAbertura)}</small>
              </article>

              {ordemSelecionada.pecas.length === 0 ? (
                <div className="empty-state compact">Nenhuma peça lançada nesta OS.</div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Peça</th>
                        <th>Quantidade usada</th>
                        <th>Valor unitario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordemSelecionada.pecas.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <strong>{item.peca.nome}</strong>
                            <small>{item.peca.sku}</small>
                          </td>
                          <td>
                            <strong>{item.quantidade}</strong>
                            <small>registrado na OS</small>
                          </td>
                          <td>
                            <strong>{formatarMoeda(item.valorUnitario)}</strong>
                            <small>valor aplicado</small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
          </section>
        </div>
      </details>
    </div>
  );
}
