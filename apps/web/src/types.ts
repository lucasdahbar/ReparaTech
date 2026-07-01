export type Cliente = {
  id: string;
  nome: string;
  documento: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClienteFormulario = {
  nome: string;
  documento: string;
  telefone: string;
  email: string;
  endereco: string;
};

export type Aparelho = {
  id: string;
  clienteId: string;
  cliente: Cliente;
  marca: string;
  modelo: string;
  numeroSerie: string | null;
  imei: string | null;
  defeitoRelatado: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AparelhoFormulario = {
  clienteId: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  imei: string;
  defeitoRelatado: string;
};

export type OrdemServicoFormulario = {
  clienteId: string;
  aparelhoId: string;
  descricaoEntrada: string;
};

export type ConsultaStatusResultado = {
  protocolo: string;
  status: string;
  aparelho: {
    marca: string;
    modelo: string;
  };
  dataEntrada: string;
};

export type Peca = {
  id: string;
  nome: string;
  sku: string;
  descricao: string | null;
  quantidade: number;
  custoUnitario: string;
  precoVenda: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PecaFormulario = {
  nome: string;
  sku: string;
  descricao: string;
  quantidade: string;
  custoUnitario: string;
  precoVenda: string;
};

export type OrdemServicoPeca = {
  id: string;
  ordemServicoId: string;
  pecaId: string;
  quantidade: number;
  valorUnitario: string;
  createdAt: string;
  peca: Peca;
};

export type OrdemServico = {
  id: string;
  numero: string;
  clienteId: string;
  aparelhoId: string;
  cliente: Cliente;
  aparelho: Aparelho;
  status: string;
  descricaoEntrada: string;
  observacaoTecnica: string | null;
  valorOrcamento: string | null;
  valorMaoDeObra: string | null;
  retiradaAutorizada: boolean;
  dataAbertura: string;
  dataFechamento: string | null;
  pecas: OrdemServicoPeca[];
  createdAt: string;
  updatedAt: string;
};

export type PerfilUsuario = 'ADMIN' | 'ATENDENTE' | 'TECNICO';

export type UsuarioSessao = {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
};

export type Sessao = {
  usuario: UsuarioSessao;
  token: string;
};

export const statusOrdemServico = [
  'Aberta',
  'Em Orçamento',
  'Aguardando Peças',
  'Em Manutenção',
  'Pronta para Retirada',
  'Finalizada'
] as const;

export type StatusOrdemServico = (typeof statusOrdemServico)[number];

export const statusOrdemServicoDetalhes: Record<StatusOrdemServico, string> = {
  'Aberta': 'Recebida pelo atendente e pronta para análise inicial.',
  'Em Orçamento': 'Aguardando aprovação do orçamento pelo cliente.',
  'Aguardando Peças': 'Serviço travado até o estoque liberar as peças necessárias.',
  'Em Manutenção': 'Técnico executando o reparo e registrando a baixa de peças.',
  'Pronta para Retirada': 'Serviço concluído e aguardando retirada do equipamento.',
  'Finalizada': 'OS encerrada após retirada e conferência final.'
};
