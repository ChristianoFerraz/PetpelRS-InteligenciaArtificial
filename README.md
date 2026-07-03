🐾 PetPelRS

Plataforma web para cadastro, busca e gerenciamento de animais para adoção, perdidos e encontrados na cidade de Pelotas/RS. Permite que clientes cadastrem pets, troquem mensagens sobre eles, e conta com um painel administrativo. O projeto também integra duas funcionalidades de Inteligência Artificial: moderação automática de imagens e um recomendador de adoção baseado em LLM.

Índice


Visão geral
Funcionalidades
Inteligência Artificial no projeto
Tecnologias
Estrutura do repositório
Pré-requisitos
Instalação e execução

1. Clonar o repositório
2. Configurar o backend (API)
3. Configurar o frontend
4. Rodando o projeto no dia a dia



Variáveis de ambiente
Solução de problemas
Deploy
Licença



Visão geral

O sistema permite:


Cadastro e login de clientes e administradores;
Cadastro de animais para adoção, perdidos ou encontrados;
Busca de animais por nome/raça;
Troca de mensagens (propostas de contato) entre clientes sobre um animal específico;
Painel administrativo para gestão de cadastros;
Envio automático de e-mails de confirmação;
Autenticação via JWT;
Moderação automática de fotos enviadas no cadastro dos animais;
Recomendador de adoção com IA, que sugere pets do site com base no perfil do usuário.


Funcionalidades

MóduloDescriçãoClientesCadastro, login e gerenciamento de perfilAnimaisCRUD completo (adoção / perdido / encontrado) com upload de foto via URLPropostasSistema de mensagens entre clientes sobre um animalAdminPainel para moderação/gestão de cadastrosPesquisaBusca de animais por nome ou raçaE-mailsNotificações automáticas via Gmail SMTP

Inteligência Artificial no projeto

O projeto usa dois serviços de IA distintos, ambos consumidos via API externa (não há modelo rodando localmente):

🔍 Moderação de imagens — Sightengine

Antes de qualquer animal ser cadastrado, a foto enviada é analisada automaticamente pela API da Sightengine, que verifica a presença de nudez, violência, armas, drogas, conteúdo ofensivo, entre outros. Cadastros com imagens impróprias são bloqueados automaticamente.

📄 Implementação: api/utils/safeSearch.ts

🐶 Analisador de Adoção — OpenRouter (GPT-4o-mini)

Na rota /adocao, o usuário responde um questionário de 7 perguntas sobre seu estilo de vida (moradia, rotina, experiência com animais etc.). Essas respostas, junto com a lista de animais disponíveis para adoção no site, são enviadas para o modelo openai/gpt-4o-mini via OpenRouter, que retorna as recomendações mais compatíveis, com percentual de match e dicas personalizadas.

📄 Implementação: emergentes_aula1-main/src/routes/AnalisadorAdocao.tsx


Ambas as integrações exigem chaves de API próprias — veja a seção Variáveis de ambiente.



Tecnologias

Frontend: React 19 · Vite · TypeScript · Tailwind CSS 4 · React Router · Zustand

Backend: Node.js · Express · TypeScript · Prisma ORM · JWT · Zod

Banco de dados: PostgreSQL

Serviços externos: Sightengine (moderação de imagem) · OpenRouter/GPT-4o-mini (recomendação de adoção) · Gmail SMTP (e-mails)

Deploy: Vercel

Estrutura do repositório

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

Pré-requisitos


Node.js 18 ou superior (recomendado 20 LTS)
Uma instância PostgreSQL — local ou em nuvem (ex.: Neon, Supabase)
Conta gratuita na Sightengine (moderação de imagem)
Conta na OpenRouter com créditos (recomendador de adoção)
Opcional: conta Gmail com senha de app para envio de e-mails


Instalação e execução

1. Clonar o repositório

bashgit clone https://github.com/seu-usuario/petpelrs.git
cd petpelrs-master

2. Configurar o backend (API)

bashcd api
npm install

Crie um arquivo .env na pasta api/ com o seguinte conteúdo (veja detalhes na seção Variáveis de ambiente):

envDATABASE_URL="postgresql://usuario:senha@host:5432/petpelrs"
JWT_SECRET="uma-string-secreta-aleatoria"

GMAIL_USER="seuemail@gmail.com"
GMAIL_APP_PASSWORD="senha-de-app-gmail"

SIGHTENGINE_USER="seu-api-user-sightengine"
SIGHTENGINE_SECRET="seu-api-secret-sightengine"

Aplique as migrações do banco de dados:

bashnpx prisma migrate dev

Inicie o servidor:

bashnpm run dev

O backend sobe em http://localhost:3000.

3. Configurar o frontend

Em outro terminal:

bashcd emergentes_aula1-main
npm install

Crie (ou edite) o arquivo .env na pasta emergentes_aula1-main/:

envVITE_API_URL=http://localhost:3000
VITE_OPENROUTER_API_KEY="sk-or-sua-chave-openrouter"

Inicie o frontend:

bashnpm run dev

Acesse http://localhost:5173 no navegador.

4. Rodando o projeto no dia a dia

Após a primeira configuração, basta:

bash# Terminal 1
cd api && npm run dev

# Terminal 2
cd emergentes_aula1-main && npm run dev

Variáveis de ambiente

api/.env

VariávelObrigatóriaDescriçãoDATABASE_URL✅String de conexão PostgreSQLJWT_SECRET✅Chave usada para assinar/validar tokens JWTSIGHTENGINE_USER✅*Usuário da API Sightengine (moderação de imagem)SIGHTENGINE_SECRET✅*Segredo da API SightengineGMAIL_USEROpcionalE-mail Gmail usado para envio de notificaçõesGMAIL_APP_PASSWORDOpcionalSenha de app do Gmail (não é a senha normal da conta)

* Sem essas chaves, o cadastro de animais (POST /animais) falha, pois toda imagem é verificada antes de ser salva.

emergentes_aula1-main/.env

VariávelObrigatóriaDescriçãoVITE_API_URL✅URL base da API backendVITE_OPENROUTER_API_KEY✅*Chave da OpenRouter usada na página /adocao

* Sem essa chave, o restante do site funciona normalmente; apenas o Analisador de Adoção (/adocao) não conseguirá gerar recomendações.

Solução de problemas

SintomaCausa provávelErro de conexão do Prisma com o bancoDATABASE_URL incorreta ou banco inacessível (verifique SSL em bancos gerenciados)401 Unauthorized em rotas protegidasToken JWT ausente ou expirado no header Authorization: Bearer <token>Erro 500 ao cadastrar animalSIGHTENGINE_USER/SIGHTENGINE_SECRET ausentes, ou urlImagem não é uma URL pública válidaSite carrega, mas sem dadosBackend não está rodando, ou VITE_API_URL incorreta/adocao não gera recomendaçõesVITE_OPENROUTER_API_KEY ausente/inválida ou sem créditos na conta OpenRouterE-mails de confirmação não chegamGMAIL_USER/GMAIL_APP_PASSWORD não configurados corretamente

Deploy

O projeto já inclui arquivos vercel.json no backend e no frontend, prontos para deploy na Vercel. Configure as mesmas variáveis de ambiente listadas acima no painel de cada projeto na Vercel.

Licença

Este projeto está sob a licença MIT.
