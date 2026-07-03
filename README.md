# 🐾 PetPelRS – Funcionalidade de IA com OpenRouter

## Introdução

O **PetPelRS** é uma plataforma web desenvolvida para auxiliar na divulgação de animais para **adoção, perdidos e encontrados** na cidade de Pelotas/RS. A aplicação permite que usuários visualizem animais cadastrados, publiquem anúncios e encontrem um pet de forma simples e organizada.

Como requisito da disciplina, foi implementada uma funcionalidade de **Inteligência Artificial** utilizando a API **OpenRouter**, por meio do modelo **openai/gpt-oss-120b:free**.

Na página **/adocao**, o usuário responde a um breve questionário sobre seu perfil (moradia, rotina, experiência com animais, entre outras informações). Essas respostas são enviadas ao modelo juntamente com a lista de animais disponíveis para adoção cadastrados no sistema. A IA analisa essas informações e retorna os animais mais compatíveis com o perfil informado, apresentando uma porcentagem de compatibilidade e uma justificativa para cada recomendação.

---

# Requisitos

Para executar o projeto é necessário possuir:

- Node.js 18 ou superior;
- Uma chave de API válida da OpenRouter.

---

# Obtendo o Projeto

Clone o repositório oficial:

```bash
git clone https://github.com/ChristianoFerraz/PetpelRS-InteligenciaArtificial.git
```

Acesse a pasta do projeto:

```bash
cd PetpelRS-InteligenciaArtificial

```

# Configuração

Na pasta `emergentes_aula1-main`, crie (ou edite) um arquivo `.env` com o seguinte conteúdo:

```env
VITE_API_URL=https://emergentes-aula1-main-6evg.vercel.app
VITE_OPENROUTER_API_KEY=INSIRA_SUA_CHAVE_OPENROUTER
```

> **Observação:** A API utilizada pelo projeto já está hospedada e conectada ao banco de dados. Por questões de segurança, a chave da OpenRouter não é disponibilizada neste repositório. Para testar a funcionalidade, basta informar uma chave válida da sua conta OpenRouter.

---

# Executando o Projeto

Abra um terminal na pasta do frontend e execute:

```bash
cd emergentes_aula1-main
npm install
npm run dev
```

Após iniciar o projeto, acesse:

```
http://localhost:5173
```

---

# Como testar a funcionalidade de IA

1. Abra a aplicação em:

```
http://localhost:5173
```

2. Acesse a página:

```
/adocao
```

3. Responda às perguntas do questionário.

4. Ao finalizar, a aplicação enviará ao modelo **openai/gpt-oss-120b:free**, através da API **OpenRouter**:
   - as respostas fornecidas pelo usuário;
   - a lista de animais disponíveis para adoção cadastrados no sistema.

5. O modelo retornará:
   - os animais mais compatíveis com o perfil informado;
   - uma porcentagem de compatibilidade para cada recomendação;
   - uma breve justificativa explicando os motivos das recomendações.

---

# Estrutura do Projeto

```text
petpelrs/
├── api/                     # Backend (Node.js + Express) - hospedado na Vercel
└── emergentes_aula1-main/   # Frontend (React + Vite)
```

---

# Observações

- A API do projeto já está publicada e integrada ao banco de dados utilizado pela aplicação.
- Para testar a funcionalidade de Inteligência Artificial, é necessário apenas informar uma chave válida da OpenRouter no arquivo `.env` do frontend.
- Caso a chave seja inválida ou a conta da OpenRouter não possua créditos disponíveis, a recomendação de adoção não será gerada.
- O restante da aplicação continuará funcionando normalmente.
