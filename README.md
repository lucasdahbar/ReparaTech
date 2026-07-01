# ReparaTech

Plataforma de gestão de assistência técnica construída com Node.js, React e MySQL.

## Escopo do sistema

- Cadastro e gestão de clientes.
- Cadastro e vínculo de aparelhos ao cliente.
- Abertura e acompanhamento de ordens de serviço.
- Controle de peças e movimentação de estoque.
- Consulta pública de status por protocolo e CPF.
- Autenticação interna para atendente, técnico e administrador.

## Estrutura inicial

- `apps/api`: API em Express com Prisma e schema MySQL.
- `apps/web`: Interface React/Vite com telas separadas para Atendente, Técnico e Cliente.
- `docker-compose.yml`: banco MySQL local para desenvolvimento.

## Tecnologias

- Node.js
- React + Vite
- Express
- Prisma
- MySQL
- TypeScript

## Como executar

1. Copie o arquivo `.env.example` para `.env` na raiz do projeto.
2. Ajuste `DATABASE_URL` se necessário.
3. Inicie o MySQL local:

	docker compose up -d

4. Instale as dependências:

	npm install

5. Gere o Prisma Client:

	npm run prisma:generate --workspace repairatech-api

6. Suba a aplicação:

	npm run dev

## Integração

- O front-end consome a API via `VITE_API_URL`.
- A API persiste os dados no MySQL por meio do Prisma.
- A autenticação usa token JWT para as áreas internas.

## Funcionalidades implementadas

- Login interno.
- CRUD de clientes.
- Cadastro de aparelhos vinculados ao cliente.
- Abertura e atualização de ordens de serviço.
- Histórico de status da OS.
- Consulta pública de andamento por protocolo e CPF.
- Controle de peças e baixa de estoque ao vincular peças à OS.

## Primeiro marco entregue

- Banco modelado para clientes, aparelhos, ordens de serviço, estoque e usuários.
- CRUD de clientes funcionando na API.
- Tela do atendente conectada ao CRUD de clientes.
