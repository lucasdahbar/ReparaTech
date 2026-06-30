import type { Aparelho, AparelhoFormulario, Cliente, ClienteFormulario, ConsultaStatusResultado, OrdemServico, OrdemServicoFormulario } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

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

async function requisicao<T>(caminho: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${caminho}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    }
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.mensagem ?? 'Não foi possível comunicar com a API do ReparaTech.');
  }

  return payload as T;
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
