# ReparaTech — Especificação Completa para Implementação

## 1. Finalidade deste documento

Este documento é a fonte principal de requisitos para implementação do sistema ReparaTech por humanos ou agentes de IA, como Codex, Cursor ou GitHub Copilot.

O documento oficial de origem é:

`docs/ReparaTechModelagem.pdf`

Este arquivo Markdown transforma o conteúdo do PDF em uma especificação técnica clara, textual e amigável para agentes de programação.

Sempre que um agente for alterar o código, ele deve consultar este arquivo antes de implementar qualquer funcionalidade.

---

## 2. Regras obrigatórias para agentes de IA

### 2.1. Antes de implementar

Antes de alterar qualquer arquivo, o agente deve:

1. Ler esta especificação.
2. Ler a estrutura atual do projeto.
3. Ler os `package.json`.
4. Ler o `schema.prisma`.
5. Ler as rotas existentes da API.
6. Ler as páginas React existentes.
7. Explicar rapidamente o plano de alteração.
8. Listar quais arquivos pretende alterar.

### 2.2. Proibições

O agente não deve:

* Reescrever o projeto do zero.
* Trocar a arquitetura do monorepo.
* Renomear pastas principais.
* Substituir Express por outro framework.
* Substituir Prisma por outro ORM.
* Substituir React/Vite por outro framework.
* Criar dependências novas sem justificar.
* Alterar funcionalidades não relacionadas à tarefa solicitada.
* Apagar código existente sem explicar o motivo.
* Criar uma feature inteira quando o pedido for para uma parte específica.
* Implementar autenticação complexa sem pedido explícito.
* Expor dados sensíveis na consulta pública.
* Ignorar as regras de status da Ordem de Serviço.
* Permitir estoque negativo.
* Permitir que uma OS entregue volte para estados anteriores.

### 2.3. Forma correta de trabalhar

Cada tarefa deve seguir este fluxo:

1. Analisar o código atual.
2. Explicar o plano.
3. Implementar somente o requisito solicitado.
4. Preservar o padrão visual e arquitetural existente.
5. Informar os arquivos alterados.
6. Informar como testar manualmente.
7. Informar se algum requisito ficou pendente.

---

# 3. Identificação do Projeto

## 3.1. Nome do sistema

ReparaTech.

## 3.2. Propósito

O ReparaTech é um sistema web para centralizar o fluxo de trabalho de assistências técnicas.

O sistema tem como objetivo reduzir a desorganização causada por ordens de serviço em papel e melhorar a comunicação com o cliente sobre o status do reparo.

## 3.3. Escopo

O sistema deve contemplar:

* Cadastro de clientes.
* Cadastro de dispositivos/equipamentos.
* Abertura de Ordem de Serviço.
* Gestão do ciclo de vida da OS.
* Controle básico de estoque de peças.
* Portal público de consulta rápida para o cliente.
* Emissão de comprovante.
* Notificação via WhatsApp quando o equipamento estiver pronto.

---

# 4. Stack tecnológica obrigatória

## 4.1. Front-end

* React 18.
* Vite.
* TypeScript.
* React Router.
* CSS.

## 4.2. Back-end

* Node.js.
* Express.
* TypeScript.
* Prisma.

## 4.3. Banco de dados

* MySQL.

## 4.4. Validação e tratamento de requisições

* Zod.
* CORS.
* Helmet.
* Morgan.

## 4.5. Versionamento

* Git.
* GitHub.

## 4.6. Gerenciamento

* Trello.

---

# 5. Modelo de processo de software

## 5.1. Modelo adotado

Scrum com abordagem incremental.

## 5.2. Justificativa

O Scrum foi escolhido porque permite entregas iterativas e frequentes de módulos funcionais do ReparaTech.

O modelo incremental garante que cada sprint entregue valor funcional real ao produto.

## 5.3. Planejamento

* Número de sprints: 4.
* Duração de cada sprint: 1 semana.
* Número de times: 1 time.
* Tamanho do time: 3 membros.

## 5.4. Papéis

### Product Owner + Scrum Master

Responsável por:

* Levantamento do backlog.
* Priorização do backlog.
* Facilitação das cerimônias Scrum.
* Remoção de impedimentos.

### Desenvolvedor front-end/documentação

Responsável por:

* Modelagem UML de casos de uso e atividades.
* Prototipação.
* Desenvolvimento front-end.
* Documentação técnica.

### Desenvolvedor back-end/testes

Responsável por:

* Modelagem UML de classes, sequência e estados.
* Desenvolvimento back-end.
* Banco de dados.
* Execução de testes.

## 5.5. Reuniões previstas

* Sprint Planning: aproximadamente 30 minutos.
* Daily Scrum assíncrono via Discord/WhatsApp: aproximadamente 15 minutos.
* Sprint Review: aproximadamente 30 minutos.
* Sprint Retrospective: aproximadamente 20 minutos.

---

# 6. Atores do sistema

## 6.1. Atendente

Responsável por:

* Primeiro contato com o cliente.
* Cadastro de clientes.
* Cadastro de aparelhos/equipamentos.
* Abertura de Ordem de Serviço.
* Emissão de comprovante, quando aplicável.

## 6.2. Técnico

Responsável por:

* Realizar diagnóstico.
* Atualizar status da OS.
* Lançar peças utilizadas no reparo.
* Registrar observações/laudos.
* Finalizar o serviço.

## 6.3. Cliente

Responsável por:

* Acessar a área pública.
* Consultar o status atual do equipamento.
* Usar número da OS/protocolo e CPF para consulta.
* Não possui login interno.

## 6.4. Administrador

Responsável por:

* Acesso total ao sistema.
* Gestão de estoque.
* Relatórios.
* Funções administrativas.

## 6.5. API do WhatsApp

Ator externo/secundário.

Responsável por:

* Receber uma requisição do sistema.
* Processar o envio de mensagem.
* Transmitir notificação automática ao cliente quando a OS estiver pronta.
* Retornar confirmação ou falha de envio.

---

# 7. Módulos do sistema

Com base no diagrama de casos de uso, o sistema é dividido em módulos.

## 7.1. Módulo de Cadastros

Contém:

* RF01 — Manter Cadastro de Clientes.
* RF02 — Registrar Equipamento.
* RF03 — Gerar Ordem de Serviço.

## 7.2. Módulo de Manutenção

Contém:

* RF04 — Gerir Ciclo de Vida da OS.
* RF05 — Controle de Estoque.
* RF06 — Consulta Pública de Status.
* RF08 — Notificação via WhatsApp.

## 7.3. Módulo de Documentos

Contém:

* RF07 — Emissão de Comprovante.

---

# 8. Requisitos funcionais resumidos

## RF01 — Manter Cadastro de Clientes

O sistema deve permitir o cadastro, edição e consulta de clientes.

Campos obrigatórios:

* Nome.
* CPF.
* Telefone.
* Endereço.

O CPF deve ser validado.

Não deve ser permitido cadastrar CPF duplicado.

Não deve ser permitido excluir cliente que possua OS vinculada.

Prioridade: essencial.

## RF02 — Registrar Equipamento

O sistema deve registrar os dados do equipamento/dispositivo.

Campos obrigatórios:

* Marca.
* Modelo.
* Serial.

Todo equipamento deve ser vinculado obrigatoriamente a um cliente cadastrado.

Prioridade: essencial.

## RF03 — Gerar Ordem de Serviço

O sistema deve abrir uma OS contendo:

* Defeito relatado.
* Data de entrada.
* Número de protocolo único.
* Status inicial "Aberta".

A OS deve estar vinculada a:

* Cliente.
* Equipamento.

Prioridade: essencial.

## RF04 — Gerir Ciclo de Vida da OS

O técnico deve conseguir alterar o status da OS conforme o progresso do reparo.

Status previstos:

* Aberta.
* Em Orçamento.
* Aguardando Peças.
* Em Manutenção.
* Pronta.
* Entregue.

O sistema deve salvar o histórico de alterações da OS.

Quando o status for alterado para "Pronta", deve acionar a rotina de notificação via WhatsApp, real ou simulada.

Prioridade: essencial.

## RF05 — Controle de Estoque

O sistema deve permitir lançar peças utilizadas em um reparo.

Ao lançar peças:

* Validar saldo disponível.
* Realizar baixa automática no estoque.
* Impedir estoque negativo.
* Registrar movimentação.

Prioridade: importante.

## RF06 — Consulta Pública de Status

O sistema deve disponibilizar uma área pública para o cliente consultar o status da OS.

O cliente deve informar:

* Número da OS/protocolo.
* CPF.

A consulta não deve exigir login.

O sistema deve retornar apenas informações básicas:

* Protocolo/número da OS.
* Status atual.
* Marca/modelo do aparelho.
* Opcionalmente data de entrada.

Não deve retornar:

* Endereço.
* Telefone.
* Dados financeiros.
* Dados cadastrais completos.
* Dados internos da assistência.

Prioridade: importante.

## RF07 — Emissão de Comprovante

O sistema deve gerar arquivo PDF formatado para impressão.

O comprovante pode servir como:

* Comprovante de entrada.
* Comprovante de entrega.
* Termo de garantia.

Prioridade: desejável.

## RF08 — Notificação via WhatsApp

O sistema deve integrar-se a uma API de WhatsApp para enviar mensagem automática ao cliente quando o status da OS for alterado para "Pronta".

A implementação pode inicialmente ser mockada, desde que registre a tentativa de envio.

Prioridade: desejável.

---

# 9. Requisitos não funcionais

## RNF01 — Segurança

O sistema deve restringir funções administrativas e técnicas a usuários autenticados via login e senha.

Áreas internas devem exigir autenticação:

* Área do atendente.
* Área do técnico.
* Área do administrador.

A consulta pública do cliente não deve exigir login.

## RNF02 — Usabilidade

A interface deve ser intuitiva e de fácil navegação.

As operações principais devem exigir o mínimo de etapas possível.

A interface deve ser responsiva para tablets e smartphones.

## RNF03 — Confiabilidade

O banco de dados MySQL deve garantir persistência das informações.

Não deve ser permitido excluir clientes que possuam OS vinculadas.

## RNF04 — Integridade de Dados

O banco de dados e a aplicação devem impedir que o saldo de uma peça fique negativo.

Toda baixa de estoque deve ser validada antes de ser executada.

## RNF05 — Desempenho

A consulta pública de status deve responder em até 3 segundos em condições normais de rede.

---

# 10. Regras de domínio

## 10.1. Cliente

Um cliente representa a pessoa que leva um equipamento à assistência.

Campos mínimos:

* id.
* nome.
* cpf.
* telefone.
* endereco.

Regras:

* CPF é obrigatório.
* CPF deve ser único.
* CPF deve ser validado.
* Nome é obrigatório.
* Telefone é obrigatório.
* Endereço é obrigatório.
* Cliente pode ter vários equipamentos.
* Cliente pode ter várias OS.
* Cliente com OS vinculada não pode ser excluído.

## 10.2. Equipamento

Um equipamento representa o aparelho deixado para manutenção.

Campos mínimos:

* id.
* marca.
* modelo.
* serial.

Relacionamentos:

* Pertence a um cliente.
* Pode ter várias ordens de serviço.

Regras:

* Não pode existir equipamento sem cliente.
* Marca é obrigatória.
* Modelo é obrigatório.
* Serial é obrigatório.
* O sistema deve permitir pesquisar cliente antes de cadastrar equipamento.

## 10.3. Ordem de Serviço

A Ordem de Serviço representa o atendimento técnico aberto para um equipamento.

Campos mínimos:

* id.
* protocolo ou número.
* defeito relatado.
* data de entrada.
* status.
* cliente.
* equipamento.

Campos recomendados:

* observações/laudo.
* data de finalização.
* histórico de status.
* peças utilizadas.

Regras:

* Deve ser criada somente para equipamento existente.
* O equipamento deve pertencer ao cliente informado.
* Deve gerar protocolo/número único.
* Deve iniciar com status "Aberta".
* Defeito relatado é obrigatório.
* Não pode ser aberta sem cliente.
* Não pode ser aberta sem equipamento.
* Deve permitir alteração de status por técnico ou administrador.
* Deve registrar histórico de mudanças.
* Uma OS com status "Entregue" não pode voltar para "Aberta" ou outros estados anteriores.

## 10.4. Peça

Representa uma peça disponível no estoque.

Campos mínimos:

* id.
* nome.
* quantidade.

Campos recomendados:

* código.
* descrição.
* preço/custo, se necessário.

Regras:

* Quantidade não pode ser negativa.
* Uma peça pode ser utilizada em várias OS.
* Ao lançar peça em uma OS, deve ocorrer baixa automática.
* Caso não haja saldo suficiente, o sistema deve bloquear a operação.
* Caso não haja saldo suficiente, o sistema deve sugerir status "Aguardando Peças".

## 10.5. Usuário

Representa um usuário interno do sistema.

Perfis previstos:

* Atendente.
* Técnico.
* Administrador.

Regras:

* Atendente pode cadastrar clientes, equipamentos e abrir OS.
* Técnico pode atualizar OS, lançar peças e finalizar serviço.
* Administrador possui acesso total.
* Cliente não deve ser tratado como usuário interno, pois consulta status sem login.

## 10.6. Histórico de Status

Representa uma alteração no status da OS.

Campos recomendados:

* id.
* ordemServicoId.
* statusAnterior.
* statusNovo.
* observacao.
* usuarioResponsavel.
* dataAlteracao.

Regras:

* Toda mudança de status deve gerar registro histórico.
* Deve armazenar observações/laudo quando informado.
* Deve permitir auditoria básica do ciclo de vida da OS.

## 10.7. Notificação WhatsApp

Representa uma tentativa de notificação ao cliente.

Campos recomendados:

* id.
* ordemServicoId.
* telefoneDestino.
* mensagem.
* statusEnvio.
* dataEnvio.
* erro, se houver.

Regras:

* Só deve ser disparada quando a OS mudar para "Pronta".
* Deve usar o telefone do cliente vinculado à OS.
* Deve conter protocolo e nome/modelo do aparelho.
* Se falhar, deve registrar a falha no log interno da OS.
* Se não houver integração real, pode ser mockada, desde que registre o comportamento.

## 10.8. Comprovante

Representa um documento emitido para uma OS.

Regras:

* Deve ser gerado a partir de uma OS existente.
* Deve conter dados do cliente, aparelho e OS.
* Deve gerar PDF.
* Deve ser disponibilizado para download ou impressão.
* Layout deve ser limpo.
* Deve ser adequado para impressão térmica ou A4.

---

# 11. Status da Ordem de Serviço

## 11.1. Status oficiais

Os status oficiais do domínio são:

1. Aberta.
2. Em Orçamento.
3. Aguardando Peças.
4. Em Manutenção.
5. Pronta.
6. Entregue.

## 11.2. Representação técnica recomendada

Em código, pode-se usar enum com nomes sem acento:

* `ABERTA`.
* `EM_ORCAMENTO`.
* `AGUARDANDO_PECAS`.
* `EM_MANUTENCAO`.
* `PRONTA`.
* `ENTREGUE`.

Se o projeto existente usar nomes diferentes, como `PRONTA_PARA_RETIRADA` ou `FINALIZADA`, o agente deve ter cuidado.

Preferência:

* Exibir para o usuário "Pronta" e "Entregue".
* Evitar alterar enums já persistidos sem avaliar impacto.
* Se necessário, criar mapeamento visual entre enum técnico e label do domínio.

## 11.3. Fluxo de estados obrigatório

A OS deve seguir o seguinte fluxo geral:

```text
Aberta
  ↓
Em Orçamento
  ↓
Verificar Peças
  ├── se não houver peça disponível → Aguardando Peças
  │                                      ↓
  │                               peças recebidas
  │                                      ↓
  └────────────────────────────→ Em Manutenção
                                      ↓
                                Pronta
                                      ↓
                                Entregue
```

## 11.4. Regras do diagrama de estados

A classe escolhida para o diagrama de estados é `OrdemDeServico`.

Eventos/ações principais:

* `abrirOS()`
* `registrarDescricaoDefeito()`
* `iniciarOrcamento()`
* `calcularCustoReparo()`
* `verificarPecas()`
* `solicitarPeca()`
* `pecasRecebidas()`
* `iniciarReparo()`
* `registrarLaudoTecnico()`
* `concluirReparo()`
* `notificarClienteWhatsApp()`
* `registrarEntrega()`
* `emitirComprovante()`

Ações por estado:

### Aberta

A OS acabou de ser criada.

Ação:

* Registrar descrição do defeito.

### Em Orçamento

O técnico avalia o equipamento e calcula o custo/reparo.

Ação:

* Calcular custo do reparo.
* Verificar necessidade de peças.

### Aguardando Peças

Estado usado quando o conserto depende de peças que não estão disponíveis.

Entrada:

* Falta de peça no estoque.
* Solicitação de peça.

Saída:

* Peças recebidas.

### Em Manutenção

Estado em que o técnico executa o conserto.

Ação:

* Registrar laudo técnico.
* Lançar peças utilizadas, se necessário.

### Pronta

Estado em que o equipamento está reparado e aguardando retirada.

Entrada:

* Conserto concluído.

Ação obrigatória:

* Acionar notificação via WhatsApp, real ou simulada.

### Entregue

Estado final.

Entrada:

* Registro de entrega ao cliente.

Ação:

* Emitir comprovante, quando aplicável.

Regra:

* Uma OS com status "Entregue" não pode retornar a estados anteriores.

---

# 12. Casos de uso detalhados

## 12.1. RF01 — Manter Cadastro de Clientes

### Objetivo

Permitir o cadastro, edição e consulta de informações dos clientes da assistência técnica.

### Ator principal

Atendente.

### Fluxo principal

1. O atendente solicita inclusão ou alteração de um cliente.
2. O sistema exibe formulário com Nome, CPF, Telefone e Endereço.
3. O atendente preenche as informações.
4. O atendente confirma a operação.
5. O sistema valida os dados obrigatórios.
6. O sistema valida a estrutura do CPF.
7. O sistema verifica se o CPF já existe.
8. O sistema grava as informações.
9. O sistema exibe mensagem de sucesso.

### Fluxo alternativo — CPF inválido ou duplicado

Se o CPF for inválido ou já estiver cadastrado:

1. O sistema impede a gravação.
2. O sistema destaca o campo com erro.
3. O sistema exibe mensagem: "CPF inválido ou já cadastrado".
4. O atendente pode corrigir os dados ou cancelar.

### Restrições

Não é permitida a exclusão de clientes que possuam OS vinculadas.

### Requisitos especiais

Interface responsiva para uso em tablets ou smartphones.

### Prioridade

Essencial.

---

## 12.2. RF02 — Registrar Equipamento

### Objetivo

Cadastrar e associar os dados de um dispositivo a um cliente previamente registrado.

### Ator principal

Atendente.

### Fluxo principal

1. O atendente pesquisa o cliente pelo CPF.
2. O sistema exibe os dados do cliente.
3. O sistema oferece opção de adicionar novo equipamento.
4. O atendente informa Marca, Modelo e Número Serial.
5. O atendente confirma o registro.
6. O sistema vincula o equipamento ao cliente.
7. O sistema salva os dados.
8. O sistema emite confirmação na tela.

### Fluxo alternativo — Cliente não localizado

Se o cliente não for encontrado:

1. O sistema alerta o atendente.
2. O sistema sugere abrir o cadastro de cliente.
3. O sistema não permite cadastrar equipamento sem cliente.

### Restrições

O sistema não deve aceitar equipamento sem cliente associado.

### Prioridade

Essencial.

---

## 12.3. RF03 — Gerar Ordem de Serviço

### Objetivo

Abrir uma nova OS associando um dispositivo ao defeito relatado e iniciar o ciclo de atendimento.

### Ator principal

Atendente.

### Fluxo principal

1. O atendente localiza o equipamento do cliente cadastrado.
2. O atendente seleciona "Abrir Ordem de Serviço".
3. O atendente descreve detalhadamente o defeito relatado.
4. O atendente confirma a abertura.
5. O sistema registra a data atual de entrada.
6. O sistema gera número de protocolo único.
7. O sistema define o status inicial como "Aberta".
8. O sistema salva a OS.
9. O sistema exibe confirmação.

### Fluxo alternativo — Defeito não informado

Se o atendente tentar confirmar sem relatar o problema:

1. O sistema bloqueia a ação.
2. O sistema exibe alerta visual.
3. O sistema exige preenchimento da descrição.

### Restrições

Este caso de uso inclui obrigatoriamente:

* Cliente previamente cadastrado.
* Equipamento previamente registrado.

### Prioridade

Essencial.

---

## 12.4. RF04 — Gerir Ciclo de Vida da OS

### Objetivo

Permitir que o técnico gerencie o andamento dos reparos alterando o status da OS.

### Ator principal

Técnico.

### Fluxo principal

1. O técnico busca a OS pelo número de protocolo.
2. O sistema exibe os dados do aparelho e o status atual.
3. O técnico seleciona o novo status.
4. O técnico insere notas, observações ou laudo.
5. O técnico confirma.
6. O sistema valida a transição de status.
7. O sistema atualiza a OS.
8. O sistema salva o histórico de modificação.

### Status disponíveis

* Em Orçamento.
* Aguardando Peças.
* Em Manutenção.
* Pronta.
* Entregue.

O status "Aberta" é status inicial, usado na criação da OS.

### Fluxo alternativo — Status alterado para "Pronta"

Se o técnico definir status como "Pronta":

1. O sistema salva a alteração.
2. O sistema aciona RF08 — Notificação via WhatsApp.
3. O sistema registra sucesso ou falha da notificação.

### Fluxo alternativo — Uso de componentes/peças

Se o conserto demandar peças:

1. O técnico aciona RF05 — Controle de Estoque.
2. O sistema valida e baixa as peças utilizadas.

### Restrições

* Apenas Técnico ou Administrador podem acessar esse fluxo.
* Uma OS com status "Entregue" não pode voltar para "Aberta".
* Uma OS com status "Entregue" não deve voltar para estados anteriores.

### Prioridade

Essencial.

---

## 12.5. RF05 — Controle de Estoque

### Objetivo

Registrar o consumo de peças em um conserto e efetuar baixa automática no estoque.

### Ator principal

Técnico.

### Fluxo principal

1. Durante a manutenção de uma OS, o técnico seleciona "Lançar Peças".
2. O técnico pesquisa a peça no estoque.
3. O técnico informa a quantidade utilizada.
4. O sistema valida se há saldo suficiente.
5. O técnico confirma a inclusão.
6. O sistema vincula a peça à OS.
7. O sistema realiza baixa automática no estoque.
8. O sistema registra movimentação.

### Fluxo alternativo — Estoque insuficiente

Se a quantidade solicitada for maior que o saldo:

1. O sistema não baixa o estoque.
2. O sistema não vincula a peça à OS.
3. O sistema exibe: "Estoque insuficiente para a peça selecionada".
4. O sistema sugere alterar a OS para "Aguardando Peças".

### Restrições

Este caso de uso é uma extensão de RF04.

Ele ocorre somente quando peças básicas forem utilizadas no reparo.

### Requisitos especiais

O banco MySQL e a aplicação devem impedir estoque negativo.

### Prioridade

Importante.

---

## 12.6. RF06 — Consulta Pública de Status

### Objetivo

Disponibilizar uma área externa para clientes verificarem o andamento dos equipamentos sem autenticação por senha.

### Ator principal

Cliente.

### Fluxo principal

1. O cliente acessa o portal público da assistência.
2. O cliente digita o número/protocolo da OS.
3. O cliente digita seu CPF.
4. O cliente clica em "Consultar Status".
5. O sistema valida se protocolo e CPF coincidem na base.
6. O sistema exibe marca/modelo do aparelho.
7. O sistema exibe status atual.

### Fluxo alternativo — Dados inconsistentes

Se protocolo e CPF não coincidirem:

1. O sistema impede a exibição da OS.
2. O sistema retorna: "Protocolo ou CPF não localizado. Verifique os dados digitados".

### Restrições

Por privacidade, a tela pública não deve mostrar:

* Endereço.
* Telefone.
* CPF completo, se não for necessário.
* Dados financeiros.
* Dados cadastrais completos.
* Observações internas.
* Histórico interno completo.
* Nome de técnicos internos, se não for necessário.

### Dados permitidos na resposta pública

A resposta pública pode conter:

* Protocolo/número da OS.
* Status atual.
* Marca do aparelho.
* Modelo do aparelho.
* Data de entrada.
* Mensagem amigável do status.

### Requisitos especiais

Consulta deve responder em até 3 segundos em condições normais.

### Prioridade

Importante.

---

## 12.7. RF07 — Emissão de Comprovante

### Objetivo

Gerar e exportar documento comprobatório de entrada ou termo final de garantia em formato digital.

### Ator principal

Atendente.

### Fluxo principal

1. O atendente seleciona uma OS cadastrada.
2. O atendente clica em "Emitir Comprovante".
3. O sistema compila dados do cliente, aparelho e OS.
4. O sistema formata o layout.
5. O sistema gera arquivo PDF.
6. O sistema disponibiliza download ou impressão direta.

### Fluxo alternativo — Falha na geração

Se ocorrer erro no servidor durante geração do PDF:

1. O sistema avisa o atendente.
2. O sistema exibe mensagem de erro.
3. O sistema libera opção para tentar reemitir.

### Requisitos especiais

O layout deve ser limpo e otimizado para:

* Impressoras térmicas.
* Folhas A4 de balcão.

### Prioridade

Desejável.

---

## 12.8. RF08 — Notificação via WhatsApp

### Objetivo

Disparar alerta automatizado para o celular do cliente informando que o equipamento foi reparado.

### Ator principal

Técnico.

### Ator secundário

API WhatsApp.

### Fluxo principal

1. O caso de uso inicia quando a OS muda para "Pronta".
2. O sistema recupera o telefone do cliente vinculado à OS.
3. O sistema formata mensagem com protocolo e nome/modelo do aparelho.
4. O sistema envia requisição à API externa do WhatsApp.
5. A API processa a mensagem.
6. A API entrega a mensagem ao cliente.
7. A API retorna confirmação ao sistema.
8. O sistema registra o resultado.

### Fluxo alternativo — Número inválido ou sem WhatsApp

Se a API apontar número inválido ou falha no envio:

1. O sistema não interrompe a atualização da OS.
2. O sistema registra a falha em log interno da OS.
3. O técnico pode visualizar a ocorrência.

### Restrições

O disparo só ocorre quando o técnico move a OS para "Pronta".

### Prioridade

Desejável.

---

# 13. Diagrama de Casos de Uso — interpretação para implementação

## 13.1. Atendente

O Atendente participa de:

* RF01 — Manter Cadastro de Clientes.
* RF02 — Registrar Equipamento.
* RF03 — Gerar Ordem de Serviço.
* RF07 — Emissão de Comprovante.

## 13.2. Técnico

O Técnico participa de:

* RF04 — Gerir Ciclo de Vida da OS.
* RF05 — Controle de Estoque.
* RF08 — Notificação via WhatsApp, indiretamente, quando muda status para "Pronta".

## 13.3. Cliente

O Cliente participa de:

* RF06 — Consulta Pública de Status.

## 13.4. Administrador

O Administrador pode acessar:

* RF04 — Gerir Ciclo de Vida da OS.
* RF05 — Controle de Estoque.
* Funções administrativas.
* Relatórios e gestão de estoque, quando implementado.

## 13.5. API WhatsApp

A API WhatsApp participa de:

* RF08 — Notificação via WhatsApp.

## 13.6. Relações include/extend

### RF03 inclui RF01 e RF02

A abertura de OS depende de cliente e equipamento já cadastrados.

Interpretação prática:

* Se não houver cliente, deve-se cadastrar cliente antes.
* Se não houver equipamento, deve-se cadastrar equipamento antes.
* A OS não pode existir sem equipamento e cliente.

### RF04 estende RF05

Controle de estoque ocorre como extensão condicional do gerenciamento da OS.

Interpretação prática:

* Só ocorre quando peças são usadas.
* Não é obrigatório em toda OS.

### RF04 estende RF08

Notificação via WhatsApp ocorre quando a OS muda para "Pronta".

Interpretação prática:

* Não ocorre em toda alteração de status.
* Só ocorre especificamente no status "Pronta".

---

# 14. Diagrama de Classes — interpretação para implementação

O diagrama de classes indica as principais classes/entidades do domínio.

A implementação pode usar nomes já existentes no projeto, mas deve preservar o sentido do modelo.

## 14.1. Enumeradores

### PerfilUsuario

Valores esperados:

* ATENDENTE.
* TECNICO.
* ADMINISTRADOR.

### Status

Valores esperados no domínio:

* ABERTA.
* EM_ORCAMENTO.
* AGUARDANDO_PECAS.
* EM_MANUTENCAO.
* PRONTA.
* ENTREGUE.

## 14.2. Sistema

Responsabilidade:

* Coordenar funcionalidades gerais.
* Manter usuários.
* Consultar status por protocolo.

Métodos conceituais:

* cadastrarUsuario.
* autenticarUsuario.
* consultarStatusProtocolo.

Observação:

* Em uma aplicação web real, essa classe pode estar distribuída em controllers, services e rotas.

## 14.3. Cliente

Atributos conceituais:

* id.
* nome.
* cpf.
* telefone.
* endereco.

Responsabilidades:

* Representar o cliente.
* Validar CPF.
* Atualizar dados cadastrais.
* Relacionar-se com equipamentos e OS.

Relacionamentos:

* Cliente possui vários equipamentos.
* Cliente possui várias ordens de serviço.

## 14.4. Equipamento

Atributos conceituais:

* id.
* marca.
* modelo.
* serial.
* cliente.

Responsabilidades:

* Representar o aparelho deixado na assistência.
* Manter vínculo obrigatório com cliente.
* Permitir atualização dos dados do equipamento.

Relacionamentos:

* Equipamento pertence a um cliente.
* Equipamento pode ter várias ordens de serviço.

## 14.5. OrdemServico

Atributos conceituais:

* id.
* numero/protocolo.
* defeitoRelatado.
* status.
* dataEntrada.
* dataFinalizacao, se aplicável.
* cliente.
* equipamento.

Responsabilidades:

* Gerar protocolo.
* Armazenar defeito relatado.
* Controlar status.
* Registrar histórico.
* Associar peças utilizadas.
* Gerar comprovante.
* Acionar notificação quando pronta.

Métodos conceituais:

* abrirOS.
* gerarNumero.
* alterarStatus.
* adicionarItemPeca.
* registrarHistorico.
* concluirReparo.
* registrarEntrega.

Relacionamentos:

* Uma OS pertence a um cliente.
* Uma OS pertence a um equipamento.
* Uma OS possui histórico de status.
* Uma OS pode possuir várias peças utilizadas.
* Uma OS pode gerar comprovante.
* Uma OS pode disparar notificação.

## 14.6. Usuario

Atributos conceituais:

* id.
* nome.
* login.
* senha.
* perfil.

Responsabilidades:

* Autenticação.
* Controle de acesso por perfil.

Métodos conceituais:

* autenticar.
* alterarSenha.
* possuiPerfil.

Perfis:

* Atendente.
* Técnico.
* Administrador.

## 14.7. HistoricoStatus

Atributos conceituais:

* id.
* statusAnterior.
* statusNovo.
* dataAlteracao.
* usuarioResponsavel.
* observacao.

Responsabilidades:

* Registrar mudanças de status.
* Permitir auditoria.

Relacionamentos:

* Pertence a uma OS.
* Pode estar associado a um usuário responsável.

## 14.8. Peca

Atributos conceituais:

* id.
* nome.
* codigo.
* quantidadeEstoque.
* preco/custo, se necessário.

Responsabilidades:

* Controlar saldo.
* Baixar estoque.
* Repor estoque.
* Impedir quantidade negativa.

Métodos conceituais:

* baixarEstoque.
* reporEstoque.
* possuiSaldo.

Relacionamentos:

* Pode ser utilizada em várias OS.

## 14.9. Item de peça utilizada na OS

Representa a associação entre OS e peça.

Campos recomendados:

* id.
* ordemServicoId.
* pecaId.
* quantidade.
* valorUnitario, se necessário.

Responsabilidades:

* Registrar quantidade usada.
* Permitir rastreabilidade do consumo.

## 14.10. Comprovante

Atributos conceituais:

* id.
* ordemServico.
* dataEmissao.
* tipo.
* caminhoArquivo, se aplicável.

Responsabilidades:

* Gerar PDF.
* Formatar dados da OS.
* Disponibilizar impressão/download.

Métodos conceituais:

* gerarPDF.
* montarDadosImpressao.

## 14.11. NotificacaoWhatsapp

Atributos conceituais:

* id.
* ordemServico.
* telefone.
* mensagem.
* status.
* dataEnvio.
* erro, se houver.

Responsabilidades:

* Formatar mensagem.
* Enviar notificação.
* Registrar sucesso/falha.

Métodos conceituais:

* formatarMensagem.
* enviarNotificacao.
* registrarFalha.

---

# 15. Diagrama de Sequência RF03 — abertura de OS

## 15.1. Objetivo do fluxo

Representar a abertura de uma Ordem de Serviço pelo atendente.

## 15.2. Participantes conceituais

* Atendente.
* Tela de abertura de OS.
* OrdemServicoController.
* EquipamentoDAO/repositório.
* OrdemServicoDAO/repositório.
* OrdemServico.
* Banco de Dados.

## 15.3. Fluxo esperado

1. Atendente acessa tela de abertura de OS.
2. Sistema exibe formulário.
3. Atendente informa cliente/equipamento.
4. Sistema busca o equipamento.
5. Sistema valida se o equipamento existe.
6. Sistema valida se o equipamento pertence ao cliente.
7. Atendente informa defeito relatado.
8. Sistema valida se o defeito foi preenchido.
9. Atendente confirma abertura.
10. Controller solicita criação da OS.
11. Sistema instancia OS com status "Aberta".
12. Sistema gera protocolo único.
13. Sistema registra data atual.
14. Sistema persiste a OS no banco.
15. Sistema retorna confirmação.
16. Tela apresenta número/protocolo da OS.

## 15.4. Validações obrigatórias

* Cliente deve existir.
* Equipamento deve existir.
* Equipamento deve pertencer ao cliente.
* Defeito relatado é obrigatório.
* Protocolo deve ser único.
* Status inicial deve ser "Aberta".

## 15.5. Erros esperados

* Cliente não encontrado.
* Equipamento não encontrado.
* Equipamento não pertence ao cliente.
* Defeito não informado.
* Falha ao salvar OS.

---

# 16. Diagrama de Sequência RF04/RF05/RF08 — gerenciamento, estoque e notificação

## 16.1. Objetivo do fluxo

Representar o gerenciamento técnico da OS, incluindo alteração de status, uso de peças e notificação por WhatsApp.

## 16.2. Participantes conceituais

* Técnico.
* Tela de gerenciamento de OS.
* OrdemServicoController.
* OrdemServicoDAO/repositório.
* OrdemServico.
* PecaDAO/repositório.
* NotificacaoWhatsapp.
* Banco de Dados.
* API WhatsApp externa.

## 16.3. Fluxo principal — alterar status

1. Técnico acessa tela de gerenciamento.
2. Técnico busca OS pelo protocolo.
3. Sistema consulta OS no banco.
4. Sistema exibe dados da OS.
5. Técnico escolhe novo status.
6. Técnico informa observações/laudo.
7. Sistema valida transição de status.
8. Sistema atualiza status da OS.
9. Sistema registra histórico.
10. Sistema salva alterações.
11. Sistema retorna confirmação.

## 16.4. Fluxo alternativo — lançar peça

1. Durante manutenção, técnico seleciona lançar peça.
2. Sistema lista ou pesquisa peças.
3. Técnico seleciona peça.
4. Técnico informa quantidade.
5. Sistema consulta estoque.
6. Sistema valida saldo.
7. Se houver saldo suficiente:

   * vincula peça à OS;
   * baixa estoque;
   * registra movimentação;
   * salva dados.
8. Se não houver saldo:

   * bloqueia operação;
   * exibe erro;
   * sugere status "Aguardando Peças".

## 16.5. Fluxo alternativo — status Pronta

1. Técnico muda status para "Pronta".
2. Sistema salva status.
3. Sistema registra histórico.
4. Sistema recupera telefone do cliente.
5. Sistema formata mensagem.
6. Sistema envia requisição para API WhatsApp ou mock.
7. Sistema registra sucesso ou falha do envio.
8. Sistema retorna confirmação ao técnico.

## 16.6. Validações obrigatórias

* OS deve existir.
* Técnico deve ter permissão.
* Status "Entregue" não pode retornar.
* Peça deve existir.
* Quantidade de peça deve ser positiva.
* Estoque deve ser suficiente.
* Estoque não pode ficar negativo.
* WhatsApp só dispara no status "Pronta".

---

# 17. Diagrama de Atividades — fluxo geral do sistema

## 17.1. Raias/participantes

* Atendente.
* Sistema ReparaTech.
* Técnico.
* Cliente.

## 17.2. Fluxo geral interpretado

1. Cliente chega à assistência.
2. Atendente pesquisa ou cadastra cliente.
3. Sistema valida os dados do cliente.
4. Atendente cadastra equipamento.
5. Sistema vincula equipamento ao cliente.
6. Atendente abre Ordem de Serviço.
7. Sistema gera protocolo.
8. Técnico acessa OS.
9. Técnico realiza diagnóstico.
10. Técnico verifica necessidade de peças.
11. Se não precisar de peças, segue para manutenção.
12. Se precisar de peças, verifica estoque.
13. Se houver estoque, baixa peças e segue manutenção.
14. Se não houver estoque, OS fica "Aguardando Peças".
15. Após peças recebidas, OS volta ao fluxo de manutenção.
16. Técnico conclui reparo.
17. Sistema altera status para "Pronta".
18. Sistema envia ou simula notificação ao cliente.
19. Cliente consulta status no portal público.
20. Cliente retira equipamento.
21. Atendente registra entrega.
22. Sistema altera status para "Entregue".
23. Sistema emite comprovante.
24. Fluxo termina.

---

# 18. Contratos de API recomendados

A implementação deve respeitar as rotas existentes quando já houver código.

As rotas abaixo são recomendações conceituais, não obrigação de renomear o projeto atual.

## 18.1. Clientes

### Criar cliente

`POST /api/clientes`

Body esperado:

```json
{
  "nome": "Nome do Cliente",
  "cpf": "00000000000",
  "telefone": "(32) 99999-9999",
  "endereco": "Endereço completo"
}
```

### Listar clientes

`GET /api/clientes`

### Buscar cliente por ID

`GET /api/clientes/:id`

### Atualizar cliente

`PUT /api/clientes/:id`

ou

`PATCH /api/clientes/:id`

### Excluir cliente

`DELETE /api/clientes/:id`

Regra:

* Bloquear exclusão se houver OS vinculada.

## 18.2. Equipamentos

### Criar equipamento

`POST /api/aparelhos` ou `POST /api/equipamentos`

Body esperado:

```json
{
  "clienteId": 1,
  "marca": "Samsung",
  "modelo": "Galaxy S25",
  "serial": "ABC123"
}
```

Regra:

* Não aceitar sem cliente.

## 18.3. Ordens de serviço

### Criar OS

`POST /api/ordens-servico`

Body esperado:

```json
{
  "clienteId": 1,
  "equipamentoId": 1,
  "defeitoRelatado": "Não liga"
}
```

Resposta esperada:

```json
{
  "id": 1,
  "protocolo": "OS-000001",
  "status": "ABERTA"
}
```

### Listar OS

`GET /api/ordens-servico`

### Buscar OS por ID ou protocolo

`GET /api/ordens-servico/:id`

ou

`GET /api/ordens-servico/protocolo/:protocolo`

### Alterar status

`PATCH /api/ordens-servico/:id/status`

Body esperado:

```json
{
  "status": "EM_MANUTENCAO",
  "observacao": "Laudo técnico ou observação"
}
```

## 18.4. Peças

### Criar peça

`POST /api/pecas`

Body esperado:

```json
{
  "nome": "Tela",
  "quantidade": 10
}
```

### Lançar peça em uma OS

`POST /api/ordens-servico/:id/pecas`

Body esperado:

```json
{
  "pecaId": 1,
  "quantidade": 2
}
```

Regras:

* Validar saldo.
* Baixar estoque.
* Registrar movimentação.
* Bloquear estoque negativo.

## 18.5. Consulta pública

Rota recomendada:

`GET /api/consulta-status?protocolo=OS-000001&cpf=00000000000`

ou, se preferir POST:

`POST /api/consulta-status`

Body:

```json
{
  "protocolo": "OS-000001",
  "cpf": "00000000000"
}
```

Resposta permitida:

```json
{
  "protocolo": "OS-000001",
  "status": "AGUARDANDO_PECAS",
  "aparelho": {
    "marca": "Samsung",
    "modelo": "Galaxy S25"
  },
  "dataEntrada": "2026-01-01T10:00:00.000Z"
}
```

Resposta em caso de erro:

```json
{
  "message": "Protocolo ou CPF não localizado. Verifique os dados digitados"
}
```

Dados proibidos nessa resposta:

* Endereço.
* Telefone.
* CPF completo, se não for necessário.
* Dados financeiros.
* Observações internas.
* Histórico completo.
* Dados de usuário interno.

## 18.6. Comprovante

Rota recomendada:

`GET /api/ordens-servico/:id/comprovante`

Retorno:

* PDF.
* Ou URL/arquivo para download.

## 18.7. WhatsApp

Rota interna ou service.

Não precisa ter rota pública.

Deve ser acionado por mudança de status para "Pronta".

---

# 19. Telas esperadas no front-end

## 19.1. Tela de Login

Finalidade:

* Permitir acesso interno de atendente, técnico e administrador.

Campos:

* Login.
* Senha.

Observação:

* Pode ser implementada depois das funcionalidades principais se o prazo estiver curto.

## 19.2. Tela do Atendente

Deve permitir:

* Cadastrar cliente.
* Editar cliente.
* Consultar cliente.
* Cadastrar equipamento vinculado.
* Abrir OS.
* Emitir comprovante.

## 19.3. Tela do Técnico

Deve permitir:

* Buscar OS por protocolo.
* Visualizar dados do aparelho.
* Visualizar status atual.
* Alterar status.
* Inserir observação/laudo.
* Lançar peças utilizadas.
* Ver erro de estoque insuficiente.
* Finalizar como "Pronta" ou "Entregue".

## 19.4. Tela do Cliente

Deve ser pública.

Deve permitir:

* Digitar protocolo.
* Digitar CPF.
* Consultar status.
* Visualizar marca/modelo do aparelho.
* Visualizar status atual.
* Visualizar mensagem amigável.
* Ver erro quando dados não forem encontrados.

Não deve exigir login.

## 19.5. Tela de Estoque

Pode estar integrada à área técnica ou administrativa.

Deve permitir:

* Listar peças.
* Cadastrar peça.
* Atualizar quantidade.
* Visualizar saldo.
* Impedir quantidade negativa.

## 19.6. Tela Administrativa

Pode ser simplificada.

Deve permitir, quando implementada:

* Gerenciar estoque.
* Visualizar relatórios.
* Ter acesso total.

---

# 20. Mensagens e labels em português

A interface deve usar português brasileiro.

## 20.1. Labels de status

* `ABERTA` → "Aberta".
* `EM_ORCAMENTO` → "Em Orçamento".
* `AGUARDANDO_PECAS` → "Aguardando Peças".
* `EM_MANUTENCAO` → "Em Manutenção".
* `PRONTA` → "Pronta".
* `ENTREGUE` → "Entregue".
* `PRONTA_PARA_RETIRADA`, se existir → "Pronta".
* `FINALIZADA`, se existir → "Entregue" ou "Finalizada", dependendo do código atual.

## 20.2. Mensagens obrigatórias

CPF inválido ou duplicado:

```text
CPF inválido ou já cadastrado.
```

Estoque insuficiente:

```text
Estoque insuficiente para a peça selecionada.
```

Consulta pública sem resultado:

```text
Protocolo ou CPF não localizado. Verifique os dados digitados.
```

Defeito não informado:

```text
Informe o defeito relatado antes de abrir a OS.
```

Cliente não localizado:

```text
Cliente não localizado. Cadastre o cliente antes de continuar.
```

Sucesso ao criar OS:

```text
Ordem de Serviço aberta com sucesso.
```

---

# 21. Privacidade e segurança

## 21.1. Área pública

A área pública de consulta deve ser protegida contra exposição excessiva.

Permitido:

* Protocolo.
* Status.
* Marca/modelo.
* Data de entrada.
* Mensagem amigável.

Proibido:

* Endereço do cliente.
* Telefone.
* Dados financeiros.
* Observações internas.
* Histórico completo da manutenção.
* Dados de usuários internos.
* CPF completo em resposta, se não necessário.

## 21.2. Áreas internas

Áreas internas devem ser protegidas por login quando RNF01 for implementado.

Perfis:

* Atendente.
* Técnico.
* Administrador.

---

# 22. Priorização para implementação

## 22.1. Essenciais

Implementar primeiro:

1. RF01 — Cliente.
2. RF02 — Equipamento.
3. RF03 — Ordem de Serviço.
4. RF04 — Ciclo de vida da OS.

## 22.2. Importantes

Implementar depois:

5. RF05 — Estoque.
6. RF06 — Consulta pública.

## 22.3. Desejáveis

Implementar no final:

7. RF07 — Comprovante PDF.
8. RF08 — WhatsApp.

## 22.4. Ordem prática recomendada para este projeto

Como o projeto já possui parte do backend e frontend, a ordem prática recomendada é:

1. Auditar o que já existe.
2. Corrigir inconsistências entre schema, serviços e telas.
3. Implementar RF06 no backend e frontend, pois é isolado.
4. Tornar tela do técnico funcional para RF04.
5. Integrar peças/estoque no front para RF05.
6. Implementar abertura de OS no front para RF03, caso ainda falte.
7. Criar histórico de status, caso ainda não exista.
8. Implementar login simples por perfil.
9. Implementar comprovante PDF.
10. Implementar WhatsApp real ou mockado.

---

# 23. Critérios de aceite por requisito

## 23.1. RF01 aceito quando

* Cadastra cliente.
* Edita cliente.
* Lista/consulta cliente.
* Valida CPF.
* Bloqueia CPF duplicado.
* Bloqueia exclusão com OS vinculada.
* Exibe mensagens amigáveis.

## 23.2. RF02 aceito quando

* Cadastra equipamento.
* Obriga cliente associado.
* Lista equipamentos por cliente.
* Impede equipamento sem cliente.
* Exibe confirmação.

## 23.3. RF03 aceito quando

* Abre OS.
* Obriga cliente.
* Obriga equipamento.
* Obriga defeito relatado.
* Gera protocolo único.
* Define status inicial "Aberta".
* Registra data de entrada.

## 23.4. RF04 aceito quando

* Técnico busca OS por protocolo.
* Sistema mostra dados do aparelho e status.
* Técnico muda status.
* Sistema valida transição.
* Sistema salva observação/laudo.
* Sistema registra histórico.
* OS entregue não volta para estados anteriores.

## 23.5. RF05 aceito quando

* Técnico lança peça em OS.
* Sistema valida saldo.
* Sistema baixa estoque.
* Sistema registra movimentação.
* Sistema bloqueia estoque insuficiente.
* Sistema impede estoque negativo.

## 23.6. RF06 aceito quando

* Cliente informa protocolo e CPF.
* Sistema valida combinação.
* Sistema mostra somente dados permitidos.
* Sistema não exige login.
* Sistema mostra mensagem de erro quando não encontra.
* Resposta é rápida.

## 23.7. RF07 aceito quando

* Atendente seleciona OS.
* Sistema gera PDF.
* PDF contém dados do cliente, aparelho e OS.
* PDF pode ser baixado ou impresso.
* Sistema trata falhas.

## 23.8. RF08 aceito quando

* Alteração para "Pronta" dispara rotina.
* Mensagem contém protocolo e aparelho.
* Sistema usa telefone do cliente.
* Sistema registra sucesso ou falha.
* Mock é aceitável se não houver API real.

---

# 24. Dados de exemplo para testes manuais

## 24.1. Cliente

```json
{
  "nome": "João Silva",
  "cpf": "12345678909",
  "telefone": "(32) 99999-9999",
  "endereco": "Rua Exemplo, 100"
}
```

## 24.2. Equipamento

```json
{
  "marca": "Samsung",
  "modelo": "Galaxy S25",
  "serial": "SN123456"
}
```

## 24.3. OS

```json
{
  "defeitoRelatado": "Aparelho não liga"
}
```

## 24.4. Peça

```json
{
  "nome": "Tela",
  "quantidade": 5
}
```

---

# 25. Checklist de revisão antes de entregar

Antes de considerar o projeto pronto, verificar:

* O projeto roda com `npm run dev`.
* API e front sobem sem erro.
* Prisma Client foi gerado.
* Banco MySQL está funcionando.
* Cliente pode ser cadastrado.
* Equipamento pode ser vinculado ao cliente.
* OS pode ser aberta.
* OS começa como "Aberta".
* Técnico consegue mudar status.
* Estoque não fica negativo.
* Cliente consegue consultar status sem login.
* Consulta pública não mostra dados sensíveis.
* OS entregue não volta para estados anteriores.
* Comprovante existe ou está claramente justificado como pendente/desejável.
* WhatsApp existe ou está mockado/justificado como pendente/desejável.
* Interface está em português.
* Código não foi reescrito desnecessariamente.
* Mudanças seguem a arquitetura existente.

---

# 26. Instrução final para agentes

Ao receber uma nova tarefa, siga este formato de resposta antes de implementar:

```text
Plano:
1. ...
2. ...

Arquivos que pretendo alterar:
- ...

Critérios que vou respeitar:
- ...

Vou implementar apenas o requisito solicitado.
```

Depois da implementação, responda:

```text
Arquivos alterados:
- ...

O que foi implementado:
- ...

Como testar:
1. ...
2. ...

Observações:
- ...
```

Este documento deve ser tratado como a fonte principal de requisitos do ReparaTech.