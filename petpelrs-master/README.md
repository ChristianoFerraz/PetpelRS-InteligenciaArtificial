# 🐾 PetPelRS

Plataforma web para cadastro, busca e gerenciamento de animais para **adoção, perdidos e encontrados** na cidade de Pelotas/RS. Permite que clientes cadastrem pets, troquem mensagens sobre eles, e conta com um painel administrativo. O projeto também integra **duas funcionalidades de Inteligência Artificial**: moderação automática de imagens e um recomendador de adoção baseado em LLM.

## Índice

- [Visão geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Inteligência Artificial no projeto](#inteligência-artificial-no-projeto)
- [Tecnologias](#tecnologias)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e execução](#instalação-e-execução)
  -
  - [1. Configurar o backend (API)](#1-configurar-o-backend-api)
  - [2. Configurar o frontend](#2-configurar-o-frontend)
  - [3. Rodando o projeto no dia a dia](#3-rodando-o-projeto-no-dia-a-dia)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Solução de problemas](#solução-de-problemas)
- [Deploy](#deploy)
- [Licença](#licença)

---

## Visão geral

O sistema permite:

- Cadastro e login de **clientes** e **administradores**;
- Cadastro de animais para **adoção**, **perdidos** ou **encontrados**;
- Busca de animais por nome/raça;
- Troca de mensagens (propostas de contato) entre clientes sobre um animal específico;
- Painel administrativo para gestão de cadastros;
- Envio automático de e-mails de confirmação;
- Autenticação via JWT;
- **Moderação automática de fotos** enviadas no cadastro dos animais;
- **Recomendador de adoção com IA**, que sugere pets do site com base no perfil do usuário.

## Funcionalidades

| Módulo | Descrição |
|---|---|
| Clientes | Cadastro, login e gerenciamento de perfil |
| Animais | CRUD completo (adoção / perdido / encontrado) com upload de foto via URL |
| Propostas | Sistema de mensagens entre clientes sobre um animal |
| Admin | Painel para moderação/gestão de cadastros |
| Pesquisa | Busca de animais por nome ou raça |
| E-mails | Notificações automáticas via Gmail SMTP |

## Inteligência Artificial no projeto

O projeto usa dois serviços de IA distintos, ambos consumidos via API externa (não há modelo rodando localmente):

### 🔍 Moderação de imagens — Sightengine

Antes de qualquer animal ser cadastrado, a foto enviada é analisada automaticamente pela API da [Sightengine](https://sightengine.com), que verifica a presença de nudez, violência, armas, drogas, conteúdo ofensivo, entre outros. Cadastros com imagens impróprias são bloqueados automaticamente.

📄 Implementação: [`api/utils/safeSearch.ts`](api/utils/safeSearch.ts)

### 🐶 Analisador de Adoção — OpenRouter (GPT-4o-mini)

Na rota `/adocao`, o usuário responde um questionário de 7 perguntas sobre seu estilo de vida (moradia, rotina, experiência com animais etc.). Essas respostas, junto com a lista de animais disponíveis para adoção no site, são enviadas para o modelo `openai/gpt-4o-mini` via [OpenRouter](https://openrouter.ai), que retorna as recomendações mais compatíveis, com percentual de match e dicas personalizadas.

📄 Implementação: [`emergentes_aula1-main/src/routes/AnalisadorAdocao.tsx`](emergentes_aula1-main/src/routes/AnalisadorAdocao.tsx)

> Ambas as integrações exigem chaves de API próprias — veja a seção [Variáveis de ambiente](#variáveis-de-ambiente).

## Tecnologias

**Frontend:** React 19 · Vite · TypeScript · Tailwind CSS 4 · React Router · Zustand

**Backend:** Node.js · Express · TypeScript · Prisma ORM · JWT · Zod

**Banco de dados:** PostgreSQL

**Serviços externos:** Sightengine (moderação de imagem) · OpenRouter/GPT-4o-mini (recomendação de adoção) · Gmail SMTP (e-mails)

**Deploy:** Vercel

## Estrutura do repositório

```
petpelrs-master/
├── api/                            # Backend (Node.js + Express + Prisma)
│   ├── routes/                     # Rotas REST (animais, clientes, login, propostas, admin...)
│   ├── prisma/schema.prisma        # Modelo do banco de dados
│   ├── middleware/autentica.ts     # Middleware de autenticação JWT
│   └── utils/
│       ├── safeSearch.ts           # IA de moderação de imagens (Sightengine)
│       └── email.ts                # Envio de e-mails
│
└── emergentes_aula1-main/          # Frontend (React + Vite)
    └── src/
        ├── routes/                 # Telas públicas (Listagem, Cadastro, Login, AnalisadorAdocao...)
        ├── Admin/                  # Telas administrativas
        └── context/                # Contextos globais (ex.: cliente autenticado)
```

## Pré-requisitos

- [Node.js](https://nodejs.org) 18 ou superior (recomendado 20 LTS)
- Uma instância [PostgreSQL](https://www.postgresql.org/) — local ou em nuvem (ex.: [Neon](https://neon.tech), [Supabase](https://supabase.com))
- Conta gratuita na [Sightengine](https://sightengine.com) (moderação de imagem)
- Conta na [OpenRouter](https://openrouter.ai) com créditos (recomendador de adoção)
- Opcional: conta Gmail com [senha de app](https://support.google.com/accounts/answer/185833) para envio de e-mails


### 1. Configurar o backend (API)

```bash
cd api
npm install
```

Crie um arquivo `.env` na pasta `api/` com o seguinte conteúdo (veja detalhes na seção [Variáveis de ambiente](#variáveis-de-ambiente)):

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/petpelrs"
JWT_SECRET="uma-string-secreta-aleatoria"

GMAIL_USER="seuemail@gmail.com"
GMAIL_APP_PASSWORD="senha-de-app-gmail"

SIGHTENGINE_USER="seu-api-user-sightengine"
SIGHTENGINE_SECRET="seu-api-secret-sightengine"
```

Aplique as migrações do banco de dados:

```bash
npx prisma migrate dev
```

Inicie o servidor:

```bash
npm run dev
```

O backend sobe em `http://localhost:3000`.

### 3. Configurar o frontend

Em outro terminal:

```bash
cd emergentes_aula1-main
npm install
```

Crie (ou edite) o arquivo `.env` na pasta `emergentes_aula1-main/`:

```env
VITE_API_URL=http://localhost:3000
VITE_OPENROUTER_API_KEY="sk-or-sua-chave-openrouter"
```

Inicie o frontend:

```bash
npm run dev
```

Acesse **http://localhost:5173** no navegador.

### 4. Rodando o projeto no dia a dia

Após a primeira configuração, basta:

```bash
# Terminal 1
cd api && npm run dev

# Terminal 2
cd emergentes_aula1-main && npm run dev
```

## Variáveis de ambiente

### `api/.env`

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | ✅ | String de conexão PostgreSQL |
| `JWT_SECRET` | ✅ | Chave usada para assinar/validar tokens JWT |
| `SIGHTENGINE_USER` | ✅* | Usuário da API Sightengine (moderação de imagem) |
| `SIGHTENGINE_SECRET` | ✅* | Segredo da API Sightengine |
| `GMAIL_USER` | Opcional | E-mail Gmail usado para envio de notificações |
| `GMAIL_APP_PASSWORD` | Opcional | Senha de app do Gmail (não é a senha normal da conta) |

\* Sem essas chaves, o cadastro de animais (`POST /animais`) falha, pois toda imagem é verificada antes de ser salva.

### `emergentes_aula1-main/.env`

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_API_URL` | ✅ | URL base da API backend |
| `VITE_OPENROUTER_API_KEY` | ✅* | Chave da OpenRouter usada na página `/adocao` |

\* Sem essa chave, o restante do site funciona normalmente; apenas o Analisador de Adoção (`/adocao`) não conseguirá gerar recomendações.

## Solução de problemas

| Sintoma | Causa provável |
|---|---|
| Erro de conexão do Prisma com o banco | `DATABASE_URL` incorreta ou banco inacessível (verifique SSL em bancos gerenciados) |
| `401 Unauthorized` em rotas protegidas | Token JWT ausente ou expirado no header `Authorization: Bearer <token>` |
| Erro 500 ao cadastrar animal | `SIGHTENGINE_USER`/`SIGHTENGINE_SECRET` ausentes, ou `urlImagem` não é uma URL pública válida |
| Site carrega, mas sem dados | Backend não está rodando, ou `VITE_API_URL` incorreta |
| `/adocao` não gera recomendações | `VITE_OPENROUTER_API_KEY` ausente/inválida ou sem créditos na conta OpenRouter |
| E-mails de confirmação não chegam | `GMAIL_USER`/`GMAIL_APP_PASSWORD` não configurados corretamente |

## Deploy

O projeto já inclui arquivos `vercel.json` no backend e no frontend, prontos para deploy na [Vercel](https://vercel.com). Configure as mesmas variáveis de ambiente listadas acima no painel de cada projeto na Vercel.

## Licença

Este projeto está sob a licença MIT.
