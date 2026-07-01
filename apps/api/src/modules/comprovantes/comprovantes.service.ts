import { prisma } from '../../lib/prisma';
import { ApiError } from '../../shared/api-error';

const statusLabels: Record<string, string> = {
  ABERTA: 'Aberta',
  EM_ORCAMENTO: 'Em Orcamento',
  AGUARDANDO_PECAS: 'Aguardando Pecas',
  EM_MANUTENCAO: 'Em Manutencao',
  PRONTA_PARA_RETIRADA: 'Pronta',
  FINALIZADA: 'Entregue'
};

const limparTextoPdf = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

const formatarData = (data: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(data);

const formatarMoeda = (valor: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);

const quebrarLinha = (texto: string, limite = 86) => {
  const palavras = texto.split(/\s+/);
  const linhas: string[] = [];
  let linhaAtual = '';

  for (const palavra of palavras) {
    const candidata = linhaAtual ? `${linhaAtual} ${palavra}` : palavra;

    if (candidata.length > limite && linhaAtual) {
      linhas.push(linhaAtual);
      linhaAtual = palavra;
    } else {
      linhaAtual = candidata;
    }
  }

  if (linhaAtual) {
    linhas.push(linhaAtual);
  }

  return linhas;
};

const montarPdf = (linhas: string[]) => {
  const conteudo = [
    'BT',
    '/F1 18 Tf',
    '50 790 Td',
    `(ReparaTech - Comprovante de Ordem de Servico) Tj`,
    '/F1 10 Tf',
    '0 -28 Td',
    ...linhas.flatMap((linha) => [`(${limparTextoPdf(linha)}) Tj`, '0 -16 Td']),
    'ET'
  ].join('\n');

  const objetos = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(conteudo, 'latin1')} >>\nstream\n${conteudo}\nendstream`
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];

  objetos.forEach((objeto, indice) => {
    offsets.push(Buffer.byteLength(pdf, 'latin1'));
    pdf += `${indice + 1} 0 obj\n${objeto}\nendobj\n`;
  });

  const inicioXref = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${objetos.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  pdf += offsets
    .slice(1)
    .map((offset) => `${offset.toString().padStart(10, '0')} 00000 n \n`)
    .join('');
  pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF`;

  return Buffer.from(pdf, 'latin1');
};

export const gerarComprovanteOrdemServico = async (ordemId: string) => {
  const ordem = await prisma.ordemServico.findUnique({
    where: {
      id: ordemId
    },
    include: {
      cliente: true,
      aparelho: true,
      pecas: {
        include: {
          peca: true
        }
      }
    }
  });

  if (!ordem) {
    throw new ApiError(404, 'Ordem de servico nao encontrada.');
  }

  const totalPecas = ordem.pecas.reduce((total, item) => total + Number(item.valorUnitario) * item.quantidade, 0);
  const linhas = [
    `Numero da OS: ${ordem.numero}`,
    `Cliente: ${ordem.cliente.nome}`,
    `Aparelho: ${ordem.aparelho.marca} ${ordem.aparelho.modelo}`,
    `Marca: ${ordem.aparelho.marca}`,
    `Modelo: ${ordem.aparelho.modelo}`,
    `Defeito informado: ${ordem.descricaoEntrada}`,
    `Data de entrada: ${formatarData(ordem.dataAbertura)}`,
    `Status: ${statusLabels[ordem.status] ?? ordem.status}`,
    `Observacoes: ${ordem.observacaoTecnica ?? 'Sem observacoes registradas.'}`,
    '',
    'Pecas utilizadas:'
  ].flatMap((linha) => quebrarLinha(linha));

  if (ordem.pecas.length === 0) {
    linhas.push('Nenhuma peca utilizada.');
  } else {
    ordem.pecas.forEach((item) => {
      linhas.push(
        `- ${item.peca.nome} | Quantidade: ${item.quantidade} | Valor unitario: ${formatarMoeda(Number(item.valorUnitario))}`
      );
    });
  }

  linhas.push('', `Total das pecas: ${formatarMoeda(totalPecas)}`);

  return {
    arquivo: montarPdf(linhas),
    nomeArquivo: `comprovante-${ordem.numero}.pdf`
  };
};
