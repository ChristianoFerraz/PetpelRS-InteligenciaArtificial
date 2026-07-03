# PetPelRS

Este projeto é uma aplicação web para gestão de clientes, animais, propostas e administração, utilizando React no frontend e Node.js/Express com Prisma no backend. O deploy está configurado para Vercel.

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Como Executar](#como-executar)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Deploy](#deploy)
- [Licença](#licença)

## Visão Geral

O sistema permite o cadastro e gerenciamento de clientes, animais, propostas e administração, com autenticação para diferentes tipos de usuários (cliente e admin). O frontend é responsivo e moderno, enquanto o backend oferece rotas REST protegidas por autenticação.

## Funcionalidades

- Cadastro e login de clientes e administradores
- Listagem e inclusão de animais
- Gerenciamento de propostas
- Inbox de mensagens
- Pesquisa de animais
- Painel administrativo
- Envio de e-mails
- Autenticação JWT

## Tecnologias Utilizadas

- **Frontend:** React, Vite, TypeScript, CSS
- **Backend:** Node.js, Express, TypeScript
- **Banco de Dados:** PostgreSQL (via Prisma ORM)
- **Deploy:** Vercel

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/petpelrs.git
   ```
2. Instale as dependências do frontend e backend:
   ```bash
   cd emergentes_aula1-main/emergentes_aula1-main
   npm install
   cd ../api
   npm install
   ```

## Como Executar

### Backend

1. Configure o banco de dados no arquivo `api/prisma/schema.prisma`.
2. Execute as migrações:
   ```bash
   npx prisma migrate dev
   ```
3. Inicie o servidor:
   ```bash
   npm run dev
   ```

### Frontend

1. Inicie o frontend:
   ```bash
   cd emergentes_aula1-main/emergentes_aula1-main
   npm run dev
   ```
2. Acesse `http://localhost:5173` no navegador.

## Estrutura de Pastas

```
api/           # Backend Node.js/Express
  routes/      # Rotas REST
  prisma/      # Schema e migrações do Prisma
  utils/       # Utilitários (e-mail, autenticação)
emergentes_aula1-main/
  src/         # Frontend React
    Admin/     # Telas administrativas
    components/# Componentes reutilizáveis
    routes/    # Telas principais
    utils/     # Tipos e utilitários
```

## Configuração do Banco de Dados

- O banco de dados é configurado via Prisma em `api/prisma/schema.prisma`.
- Para rodar localmente, configure a variável de ambiente `DATABASE_URL`.
- Execute as migrações com `npx prisma migrate dev`.

## Deploy

- O projeto está configurado para deploy na Vercel, com arquivos `vercel.json` no frontend e backend.

## Licença

Este projeto está sob a licença MIT.
