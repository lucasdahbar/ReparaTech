# ReparaTech

Plataforma de gestão de assistência técnica construída com Node.js, React e MySQL.

## Estrutura inicial

- `apps/api`: API em Express com Prisma e schema MySQL.
- `apps/web`: Interface React/Vite com telas separadas para Atendente, Técnico e Cliente.
- `docker-compose.yml`: banco MySQL local para desenvolvimento.

## Como executar

1. `npm install`
2. `npm run prisma:generate --workspace repairatech-api`
3. `npm run dev`

## Primeiro marco entregue

- Banco modelado para clientes, aparelhos, ordens de serviço, estoque e usuários.
- CRUD de clientes funcionando na API.
- Tela do atendente conectada ao CRUD de clientes.
