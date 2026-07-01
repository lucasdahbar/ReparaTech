import { FormEvent, useEffect, useMemo, useState } from 'react';

import {
  atualizarCliente,
  baixarComprovanteOrdemServico,
  cadastrarAparelho,
  cadastrarCliente,
  cadastrarOrdemServico,
  listarAparelhos,
  listarClientes,
  listarOrdensServico,
  removerCliente
} from '../lib/api';
import type { Aparelho, AparelhoFormulario, Cliente, ClienteFormulario, OrdemServico, OrdemServicoFormulario } from '../types';

const formularioInicial: ClienteFormulario = {
  nome: '',
  documento: '',
  telefone: '',
  email: '',
  endereco: ''
};

const formularioAparelhoInicial: AparelhoFormulario = {
  clienteId: '',
  marca: '',
  modelo: '',
  numeroSerie: '',
  imei: '',
  defeitoRelatado: ''
};

const formularioOrdemServicoInicial: OrdemServicoFormulario = {
  clienteId: '',
  aparelhoId: '',
  descricaoEntrada: ''
};

function formatarData(dataISO: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dataISO));
}

function formatarStatusOrdem(status: string) {
  const statusFormatado: Record<string, string> = {
    ABERTA: 'Aberta',
    EM_ORCAMENTO: 'Em Orçamento',
    AGUARDANDO_PECAS: 'Aguardando Peças',
    EM_MANUTENCAO: 'Em Manutenção',
    PRONTA_PARA_RETIRADA: 'Pronta',
    FINALIZADA: 'Entregue'
  };

  return statusFormatado[status] ?? status;
}

export function AtendentePage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [aparelhos, setAparelhos] = useState<Aparelho[]>([]);
  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>([]);
  const [formulario, setFormulario] = useState<ClienteFormulario>(formularioInicial);
  const [formularioAparelho, setFormularioAparelho] = useState<AparelhoFormulario>(formularioAparelhoInicial);
  const [formularioOrdemServico, setFormularioOrdemServico] = useState<OrdemServicoFormulario>(formularioOrdemServicoInicial);
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [carregandoAparelhos, setCarregandoAparelhos] = useState(true);
  const [carregandoOrdensServico, setCarregandoOrdensServico] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [salvandoAparelho, setSalvandoAparelho] = useState(false);
  const [salvandoOrdemServico, setSalvandoOrdemServico] = useState(false);
  const [protocoloOrdemServico, setProtocoloOrdemServico] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregarClientes = async () => {
    setCarregando(true);
    setErro(null);

    try {
      const resposta = await listarClientes();
      setClientes(resposta.clientes);
    } catch (erroFetch) {
      setErro(erroFetch instanceof Error ? erroFetch.message : 'Não foi possível carregar os clientes.');
    } finally {
      setCarregando(false);
    }
  };

  const carregarAparelhos = async () => {
    setCarregandoAparelhos(true);

    try {
      const resposta = await listarAparelhos();
      setAparelhos(resposta.aparelhos);
    } catch {
      setAparelhos([]);
    } finally {
      setCarregandoAparelhos(false);
    }
  };

  const carregarOrdensServico = async () => {
    setCarregandoOrdensServico(true);

    try {
      const resposta = await listarOrdensServico();
      setOrdensServico(resposta.ordens);
    } catch {
      setOrdensServico([]);
    } finally {
      setCarregandoOrdensServico(false);
    }
  };

  useEffect(() => {
    void carregarClientes();
    void carregarAparelhos();
    void carregarOrdensServico();
  }, []);

  const estatisticas = useMemo(() => {
    return {
      total: clientes.length,
      comDocumento: clientes.filter((cliente) => Boolean(cliente.documento)).length,
      comEmail: clientes.filter((cliente) => Boolean(cliente.email)).length
    };
  }, [clientes]);

  const limparFormulario = () => {
    setFormulario(formularioInicial);
    setClienteSelecionadoId(null);
  };

  const limparFormularioAparelho = () => {
    setFormularioAparelho(formularioAparelhoInicial);
  };

  const limparFormularioOrdemServico = () => {
    setFormularioOrdemServico(formularioOrdemServicoInicial);
    setProtocoloOrdemServico(null);
  };

  const manipularEnvio = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setSalvando(true);
    setMensagem(null);
    setErro(null);

    try {
      if (clienteSelecionadoId) {
        await atualizarCliente(clienteSelecionadoId, formulario);
        setMensagem('Cliente atualizado com sucesso.');
      } else {
        await cadastrarCliente(formulario);
        setMensagem('Cliente cadastrado com sucesso.');
      }

      limparFormulario();
      await carregarClientes();
    } catch (erroOperacao) {
      setErro(erroOperacao instanceof Error ? erroOperacao.message : 'Não foi possível salvar o cliente.');
    } finally {
      setSalvando(false);
    }
  };

  const editarCliente = (cliente: Cliente) => {
    setClienteSelecionadoId(cliente.id);
    setFormulario({
      nome: cliente.nome,
      documento: cliente.documento ?? '',
      telefone: cliente.telefone ?? '',
      email: cliente.email ?? '',
      endereco: cliente.endereco ?? ''
    });
    setMensagem('Cliente pronto para edição.');
    setErro(null);
  };

  const excluirCliente = async (cliente: Cliente) => {
    const confirmado = window.confirm(`Deseja remover o cliente ${cliente.nome}?`);

    if (!confirmado) {
      return;
    }

    setSalvando(true);
    setErro(null);
    setMensagem(null);

    try {
      await removerCliente(cliente.id);
      if (clienteSelecionadoId === cliente.id) {
        limparFormulario();
      }
      setMensagem('Cliente removido com sucesso.');
      await carregarClientes();
    } catch (erroRemocao) {
      setErro(erroRemocao instanceof Error ? erroRemocao.message : 'Não foi possível remover o cliente.');
    } finally {
      setSalvando(false);
    }
  };

  const manipularEnvioAparelho = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setSalvandoAparelho(true);
    setMensagem(null);
    setErro(null);

    try {
      await cadastrarAparelho(formularioAparelho);
      setMensagem('Aparelho vinculado ao cliente com sucesso.');
      limparFormularioAparelho();
      await carregarAparelhos();
    } catch (erroAparelho) {
      setErro(erroAparelho instanceof Error ? erroAparelho.message : 'Não foi possível cadastrar o aparelho.');
    } finally {
      setSalvandoAparelho(false);
    }
  };

  const aparelhosDoClienteSelecionado = clienteSelecionadoId
    ? aparelhos.filter((aparelho) => aparelho.clienteId === clienteSelecionadoId)
    : aparelhos;

  const aparelhosDisponiveisParaOs = formularioOrdemServico.clienteId
    ? aparelhos.filter((aparelho) => aparelho.clienteId === formularioOrdemServico.clienteId)
    : [];

  const manipularEnvioOrdemServico = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setSalvandoOrdemServico(true);
    setMensagem(null);
    setErro(null);
    setProtocoloOrdemServico(null);

    try {
      const resposta = await cadastrarOrdemServico(formularioOrdemServico);
      setMensagem('Ordem de Serviço aberta com sucesso.');
      setProtocoloOrdemServico(resposta.ordem.numero);
      setFormularioOrdemServico(formularioOrdemServicoInicial);
      await carregarOrdensServico();
    } catch (erroOrdemServico) {
      setErro(erroOrdemServico instanceof Error ? erroOrdemServico.message : 'Não foi possível abrir a ordem de serviço.');
    } finally {
      setSalvandoOrdemServico(false);
    }
  };

  const baixarComprovante = async (ordem: OrdemServico) => {
    setErro(null);

    try {
      const arquivo = await baixarComprovanteOrdemServico(ordem.id);
      const url = URL.createObjectURL(arquivo);
      const link = document.createElement('a');

      link.href = url;
      link.download = `comprovante-${ordem.numero}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (erroComprovante) {
      setErro(erroComprovante instanceof Error ? erroComprovante.message : 'Não foi possível baixar o comprovante.');
    }
  };

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <span className="eyebrow">Atendimento</span>
          <h2>Cadastro de clientes</h2>
          <p>
            Esta é a primeira frente funcional do ReparaTech. O atendente registra o cliente,
            prepara o vínculo com os aparelhos e mantém a base pronta para abrir ordens de serviço.
          </p>
        </div>

        <div className="hero-grid">
          <article className="metric-card">
            <span>Total</span>
            <strong>{estatisticas.total}</strong>
            <small>clientes cadastrados</small>
          </article>
          <article className="metric-card">
            <span>Com documento</span>
            <strong>{estatisticas.comDocumento}</strong>
            <small>prontos para vínculo fiscal</small>
          </article>
          <article className="metric-card">
            <span>Com e-mail</span>
            <strong>{estatisticas.comEmail}</strong>
            <small>acesso ao portal futuramente</small>
          </article>
        </div>
      </section>

      <section className="two-column-grid">
        <form className="panel-card form-card" onSubmit={manipularEnvio}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">Novo cliente</span>
              <h3>{clienteSelecionadoId ? 'Editar cadastro' : 'Abrir cadastro'}</h3>
            </div>
            <button type="button" className="button-secondary" onClick={limparFormulario}>
              Limpar
            </button>
          </div>

          <div className="form-grid">
            <label>
              <span>Nome *</span>
              <input
                value={formulario.nome}
                onChange={(evento) => setFormulario((estado) => ({ ...estado, nome: evento.target.value }))}
                placeholder="Nome completo"
                required
              />
            </label>

            <label>
              <span>CPF *</span>
              <input
                value={formulario.documento}
                onChange={(evento) => setFormulario((estado) => ({ ...estado, documento: evento.target.value }))}
                placeholder="000.000.000-00"
                required
              />
            </label>

            <label>
              <span>Telefone *</span>
              <input
                value={formulario.telefone}
                onChange={(evento) => setFormulario((estado) => ({ ...estado, telefone: evento.target.value }))}
                placeholder="(00) 00000-0000"
                required
              />
            </label>

            <label>
              <span>E-mail</span>
              <input
                value={formulario.email}
                onChange={(evento) => setFormulario((estado) => ({ ...estado, email: evento.target.value }))}
                placeholder="cliente@exemplo.com"
                type="email"
              />
            </label>

            <label className="full-width">
              <span>Endereço *</span>
              <textarea
                value={formulario.endereco}
                onChange={(evento) => setFormulario((estado) => ({ ...estado, endereco: evento.target.value }))}
                placeholder="Rua, número, bairro, cidade"
                rows={4}
                required
              />
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="button-primary" disabled={salvando}>
              {salvando ? 'Salvando...' : clienteSelecionadoId ? 'Atualizar cliente' : 'Cadastrar cliente'}
            </button>
            <span className="helper-text">Os campos com * são obrigatórios para o primeiro cadastro.</span>
          </div>

          {mensagem ? <div className="feedback success">{mensagem}</div> : null}
          {erro ? <div className="feedback error">{erro}</div> : null}
        </form>

        <section className="panel-card list-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Base de dados</span>
              <h3>Clientes cadastrados</h3>
            </div>
            <button type="button" className="button-secondary" onClick={() => void carregarClientes()}>
              Recarregar
            </button>
          </div>

          {carregando ? (
            <div className="empty-state">Carregando clientes...</div>
          ) : clientes.length === 0 ? (
            <div className="empty-state">Nenhum cliente cadastrado ainda.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Contato</th>
                    <th>Cadastro</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>
                        <strong>{cliente.nome}</strong>
                        <small>{cliente.documento ?? 'Sem documento informado'}</small>
                      </td>
                      <td>
                        <strong>{cliente.telefone ?? 'Sem telefone'}</strong>
                        <small>{cliente.email ?? 'Sem e-mail'}</small>
                      </td>
                      <td>
                        <strong>{formatarData(cliente.createdAt)}</strong>
                        <small>{cliente.endereco ?? 'Sem endereço'}</small>
                      </td>
                      <td>
                        <div className="action-group">
                          <button type="button" className="button-secondary" onClick={() => editarCliente(cliente)}>
                            Editar
                          </button>
                          <button type="button" className="button-danger" onClick={() => void excluirCliente(cliente)}>
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <section className="two-column-grid">
                <form className="panel-card form-card" onSubmit={manipularEnvioOrdemServico}>
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">Ordem de Serviço</span>
                      <h3>Abrir nova OS</h3>
                    </div>
                    <button type="button" className="button-secondary" onClick={limparFormularioOrdemServico}>
                      Limpar
                    </button>
                  </div>

                  <div className="form-grid">
                    <label className="full-width">
                      <span>Cliente *</span>
                      <select
                        value={formularioOrdemServico.clienteId}
                        onChange={(evento) =>
                          setFormularioOrdemServico((estado) => ({
                            ...estado,
                            clienteId: evento.target.value,
                            aparelhoId: ''
                          }))
                        }
                        required
                      >
                        <option value="">Selecione um cliente</option>
                        {clientes.map((cliente) => (
                          <option key={cliente.id} value={cliente.id}>
                            {cliente.nome}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="full-width">
                      <span>Aparelho *</span>
                      <select
                        value={formularioOrdemServico.aparelhoId}
                        onChange={(evento) => setFormularioOrdemServico((estado) => ({ ...estado, aparelhoId: evento.target.value }))}
                        disabled={!formularioOrdemServico.clienteId || aparelhosDisponiveisParaOs.length === 0}
                        required
                      >
                        <option value="">
                          {formularioOrdemServico.clienteId ? 'Selecione um aparelho' : 'Selecione um cliente primeiro'}
                        </option>
                        {aparelhosDisponiveisParaOs.map((aparelho) => (
                          <option key={aparelho.id} value={aparelho.id}>
                            {`${aparelho.marca} ${aparelho.modelo}`}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="full-width">
                      <span>Defeito relatado *</span>
                      <textarea
                        value={formularioOrdemServico.descricaoEntrada}
                        onChange={(evento) => setFormularioOrdemServico((estado) => ({ ...estado, descricaoEntrada: evento.target.value }))}
                        placeholder="Descreva o defeito informado pelo cliente"
                        rows={4}
                        required
                      />
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="button-primary" disabled={salvandoOrdemServico}>
                      {salvandoOrdemServico ? 'Abrindo OS...' : 'Abrir Ordem de Serviço'}
                    </button>
                    <span className="helper-text">A API gera o protocolo e inicia a OS como Aberta.</span>
                  </div>

                  {protocoloOrdemServico ? (
                    <div className="feedback success">Protocolo gerado: {protocoloOrdemServico}</div>
                  ) : null}
                </form>

                <section className="panel-card callout-card">
                  <span className="status-pill">RF03</span>
                  <h3>OS vinculada ao cliente e aparelho</h3>
                  <p>
                    Selecione um cliente para carregar apenas os aparelhos dele, descreva o defeito relatado e
                    confirme a abertura da ordem de serviço.
                  </p>
                </section>
              </section>

              <section className="panel-card list-card">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">Ordens de Serviço</span>
                    <h3>OS abertas</h3>
                  </div>
                  <button type="button" className="button-secondary" onClick={() => void carregarOrdensServico()}>
                    Recarregar
                  </button>
                </div>

                {carregandoOrdensServico ? (
                  <div className="empty-state">Carregando ordens de serviço...</div>
                ) : ordensServico.length === 0 ? (
                  <div className="empty-state">Nenhuma ordem de serviço aberta ainda.</div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Protocolo</th>
                          <th>Cliente</th>
                          <th>Aparelho</th>
                          <th>Status</th>
                          <th>Abertura</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordensServico.map((ordem) => (
                          <tr key={ordem.id}>
                            <td>
                              <strong>{ordem.numero}</strong>
                              <small>Ordem de serviço</small>
                            </td>
                            <td>
                              <strong>{ordem.cliente.nome}</strong>
                              <small>{ordem.cliente.documento ?? 'Sem documento informado'}</small>
                            </td>
                            <td>
                              <strong>{`${ordem.aparelho.marca} ${ordem.aparelho.modelo}`}</strong>
                              <small>{ordem.aparelho.numeroSerie ?? 'Sem serial'}</small>
                            </td>
                            <td>
                              <strong>{formatarStatusOrdem(ordem.status)}</strong>
                              <small>Status atual</small>
                            </td>
                            <td>
                              <strong>{formatarData(ordem.dataAbertura)}</strong>
                              <small>Data de entrada</small>
                            </td>
                            <td>
                              <button type="button" className="button-secondary" onClick={() => void baixarComprovante(ordem)}>
                                Comprovante
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <section className="two-column-grid">
                <form className="panel-card form-card" onSubmit={manipularEnvioAparelho}>
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">Aparelhos</span>
                      <h3>Vincular equipamento ao cliente</h3>
                    </div>
                    <button type="button" className="button-secondary" onClick={limparFormularioAparelho}>
                      Limpar
                    </button>
                  </div>

                  <div className="form-grid">
                    <label className="full-width">
                      <span>Cliente *</span>
                      <select
                        value={formularioAparelho.clienteId}
                        onChange={(evento) => setFormularioAparelho((estado) => ({ ...estado, clienteId: evento.target.value }))}
                        required
                      >
                        <option value="">Selecione um cliente</option>
                        {clientes.map((cliente) => (
                          <option key={cliente.id} value={cliente.id}>
                            {cliente.nome}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span>Marca *</span>
                      <input
                        value={formularioAparelho.marca}
                        onChange={(evento) => setFormularioAparelho((estado) => ({ ...estado, marca: evento.target.value }))}
                        placeholder="Marca do equipamento"
                        required
                      />
                    </label>

                    <label>
                      <span>Modelo *</span>
                      <input
                        value={formularioAparelho.modelo}
                        onChange={(evento) => setFormularioAparelho((estado) => ({ ...estado, modelo: evento.target.value }))}
                        placeholder="Modelo do equipamento"
                        required
                      />
                    </label>

                    <label>
                      <span>Número de série *</span>
                      <input
                        value={formularioAparelho.numeroSerie}
                        onChange={(evento) => setFormularioAparelho((estado) => ({ ...estado, numeroSerie: evento.target.value }))}
                        placeholder="Serial"
                        required
                      />
                    </label>

                    <label>
                      <span>IMEI</span>
                      <input
                        value={formularioAparelho.imei}
                        onChange={(evento) => setFormularioAparelho((estado) => ({ ...estado, imei: evento.target.value }))}
                        placeholder="IMEI"
                      />
                    </label>

                    <label className="full-width">
                      <span>Defeito relatado</span>
                      <textarea
                        value={formularioAparelho.defeitoRelatado}
                        onChange={(evento) => setFormularioAparelho((estado) => ({ ...estado, defeitoRelatado: evento.target.value }))}
                        placeholder="Descreva o problema informado pelo cliente"
                        rows={4}
                      />
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="button-primary" disabled={salvandoAparelho}>
                      {salvandoAparelho ? 'Salvando...' : 'Vincular aparelho'}
                    </button>
                    <span className="helper-text">O aparelho fica amarrado ao cliente selecionado e já entra no inventário.</span>
                  </div>
                </form>

                <section className="panel-card list-card">
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">Inventário vinculado</span>
                      <h3>{clienteSelecionadoId ? 'Aparelhos do cliente selecionado' : 'Todos os aparelhos cadastrados'}</h3>
                    </div>
                    <button type="button" className="button-secondary" onClick={() => void carregarAparelhos()}>
                      Recarregar
                    </button>
                  </div>

                  {carregandoAparelhos ? (
                    <div className="empty-state">Carregando aparelhos...</div>
                  ) : aparelhosDoClienteSelecionado.length === 0 ? (
                    <div className="empty-state">Nenhum aparelho vinculado ainda.</div>
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Cliente</th>
                            <th>Aparelho</th>
                            <th>Identificação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {aparelhosDoClienteSelecionado.map((aparelho) => (
                            <tr key={aparelho.id}>
                              <td>
                                <strong>{aparelho.cliente.nome}</strong>
                                <small>{aparelho.cliente.email ?? 'Sem e-mail'}</small>
                              </td>
                              <td>
                                <strong>{`${aparelho.marca} ${aparelho.modelo}`}</strong>
                                <small>{aparelho.defeitoRelatado ?? 'Sem defeito relatado'}</small>
                              </td>
                              <td>
                                <strong>{aparelho.numeroSerie ?? 'Sem serial'}</strong>
                                <small>{aparelho.imei ?? 'Sem IMEI'}</small>
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
          )}
        </section>
      </section>
    </div>
  );
}
