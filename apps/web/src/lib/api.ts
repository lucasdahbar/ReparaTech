import type {
  Aparelho,
  AparelhoFormulario,
  Cliente,
  ClienteFormulario,
  ConsultaStatusResultado,
  OrdemServico,
  OrdemServicoFormulario,
  Peca,
  PecaFormulario,
  Sessao,
  StatusOrdemServicoTecnico
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';
const STORAGE_KEY = 'repairatech:sessao';

type RespostaListaClientes = {
  clientes: Cliente[];
};

type RespostaCliente = {
  cliente: Cliente;
};

type RespostaMensagem = {
  mensagem: string;
};

type RespostaListaAparelhos = {
  aparelhos: Aparelho[];
};

type RespostaListaOrdensServico = {
  ordens: OrdemServico[];
};

type RespostaAparelho = {
  aparelho: Aparelho;
};

type RespostaOrdemServico = {
  ordem: OrdemServico;
};

type RespostaListaPecas = {
  pecas: Peca[];
};

type RespostaPeca = {
  peca: Peca;
};

type RespostaLogin = Sessao & RespostaMensagem;

export function obterSessaoSalva(): Sessao | null {
  const valor = window.localStorage.getItem(STORAGE_KEY);

  if (!valor) {
    return null;
  }

  try {
    return JSON.parse(valor) as Sessao;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function salvarSessao(sessao: Sessao) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessao));
}

export function encerrarSessao() {
  window.localStorage.removeItem(STORAGE_KEY);
}

function montarHeaders(headers?: HeadersInit) {
  const sessao = obterSessaoSalva();

  return {
    'Content-Type': 'application/json',
    ...(sessao ? { Authorization: `Bearer ${sessao.token}` } : {}),
    ...(headers ?? {})
  };
}

async function requisicao<T>(caminho: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${caminho}`, {
    ...options,
    headers: montarHeaders(options.headers)
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.mensagem ?? 'Não foi possível comunicar com a API do ReparaTech.');
  }

  return payload as T;
}

async function requisicaoArquivo(caminho: string): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}${caminho}`, {
    headers: montarHeaders()
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.mensagem ?? 'Nao foi possivel baixar o arquivo.');
  }

  return response.blob();
}

export async function login(email: string, senha: string) {
  const sessao = await requisicao<RespostaLogin>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha })
  });

  salvarSessao({
    usuario: sessao.usuario,
    token: sessao.token
  });

  return sessao;
}

export async function listarClientes() {
  return requisicao<RespostaListaClientes>('/clientes');
}

export async function cadastrarCliente(cliente: ClienteFormulario) {
  return requisicao<RespostaCliente & RespostaMensagem>('/clientes', {
    method: 'POST',
    body: JSON.stringify(cliente)
  });
}

export async function atualizarCliente(id: string, cliente: ClienteFormulario) {
  return requisicao<RespostaCliente & RespostaMensagem>(`/clientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cliente)
  });
}

export async function removerCliente(id: string) {
  return requisicao<RespostaMensagem>(`/clientes/${id}`, {
    method: 'DELETE'
  });
}

export async function listarAparelhos() {
  return requisicao<RespostaListaAparelhos>('/aparelhos');
}

export async function cadastrarAparelho(aparelho: AparelhoFormulario) {
  return requisicao<RespostaAparelho & RespostaMensagem>('/aparelhos', {
    method: 'POST',
    body: JSON.stringify(aparelho)
  });
}

export async function cadastrarOrdemServico(ordem: OrdemServicoFormulario) {
  return requisicao<RespostaOrdemServico & RespostaMensagem>('/ordens-servico', {
    method: 'POST',
    body: JSON.stringify(ordem)
  });
}

export async function listarOrdensServico() {
  return requisicao<RespostaListaOrdensServico>('/ordens-servico');
}

export async function consultarStatusPublico(protocolo: string, cpf: string) {
  const params = new URLSearchParams({
    protocolo,
    cpf
  });

  return requisicao<ConsultaStatusResultado>(`/consulta-status?${params.toString()}`);
}

export async function listarPecas() {
  return requisicao<RespostaListaPecas>('/pecas');
}

export async function cadastrarPeca(peca: PecaFormulario) {
  return requisicao<RespostaPeca & RespostaMensagem>('/pecas', {
    method: 'POST',
    body: JSON.stringify(peca)
  });
}

export async function atualizarPeca(id: string, peca: PecaFormulario) {
  return requisicao<RespostaPeca & RespostaMensagem>(`/pecas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(peca)
  });
}

export async function removerPeca(id: string) {
  return requisicao<RespostaMensagem>(`/pecas/${id}`, {
    method: 'DELETE'
  });
}

export async function vincularPecaNaOrdemServico(ordemId: string, pecaId: string, quantidade: string) {
  return requisicao<RespostaOrdemServico & RespostaMensagem>(`/ordens-servico/${ordemId}/pecas`, {
    method: 'POST',
    body: JSON.stringify({
      pecaId,
      quantidade
    })
  });
}

export async function atualizarStatusOrdemServico(ordemId: string, status: StatusOrdemServicoTecnico) {
  return requisicao<RespostaOrdemServico & RespostaMensagem>(`/ordens-servico/${ordemId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export async function baixarComprovanteOrdemServico(ordemId: string) {
  return requisicaoArquivo(`/ordens-servico/${ordemId}/comprovante`);
}
