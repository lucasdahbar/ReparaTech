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
