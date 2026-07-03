import { useState } from "react";

type GeradorPostProps = {
  nome: string;
  idade: number | null;
  raca: string;
  tipo: "ADOCAO" | "PERDIDO" | "ENCONTRADO" | "";
  cidade: string;
  urlImagem: string;
};

type RedesSociais = {
  whatsapp: string;
  instagram: string;
};

export default function GeradorPost({
  nome,
  idade,
  raca,
  tipo,
  cidade,
  urlImagem,
}: GeradorPostProps) {
  const [posts, setPosts] = useState<RedesSociais | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [copiado, setCopiado] = useState<"whatsapp" | "instagram" | null>(null);

  const tipoLabel: Record<string, string> = {
    ADOCAO: "disponível para adoção",
    PERDIDO: "desaparecido",
    ENCONTRADO: "encontrado",
  };

  const camposPreenchidos = nome && raca && tipo && cidade;

  async function gerarPost() {
    if (!camposPreenchidos) {
      setErro("Preencha pelo menos nome, raça, tipo e cidade antes de gerar o post.");
      return;
    }

    setErro(null);
    setCarregando(true);
    setPosts(null);

    const descricaoAnimal = `
      Nome: ${nome}
      Idade: ${idade ? `${idade} anos` : "não informada"}
      Raça: ${raca}
      Situação: ${tipoLabel[tipo] || tipo}
      Cidade: ${cidade}
      ${urlImagem ? `Foto disponível: ${urlImagem}` : ""}
    `.trim();

    const promptSistema = `Você é um especialista em comunicação para ONGs e protetores de animais.
Seu objetivo é criar posts emocionantes e eficazes para ajudar animais a serem encontrados, adotados ou devolvidos aos donos.
Sempre responda APENAS em JSON válido, sem texto antes ou depois, sem markdown, sem blocos de código.`;

    const promptUsuario = `Com base nas informações abaixo, crie dois posts sobre este animal:

${descricaoAnimal}

Retorne um JSON com exatamente esta estrutura:
{
  "whatsapp": "texto do post para WhatsApp, mais direto, com emojis, máximo 300 caracteres, inclua contato via WhatsApp no final",
  "instagram": "texto do post para Instagram, mais elaborado, emocionante, com hashtags relevantes no final, máximo 500 caracteres"
}

Use emojis adequados. Para animal PERDIDO: apelo urgente. Para ENCONTRADO: descrição clara para identificação. Para ADOCAO: destaque a personalidade e carinho.`;

    try {
      const response = await fetch("https://api.openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "PetPelrs - Gerador de Post",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: promptSistema },
            { role: "user", content: promptUsuario },
          ],
          temperature: 0.8,
          max_tokens: 600,
        }),
      });

      if (!response.ok) {
        const detalhe = await response.text();
        throw new Error(`Erro na API: ${response.status} - ${detalhe}`);
      }

      const data = await response.json();
      const textoResposta = data.choices?.[0]?.message?.content;

      if (!textoResposta) throw new Error("A IA não retornou resposta.");

      // Remove possíveis blocos de código markdown caso a IA desobedeça
      const textoLimpo = textoResposta
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const resultado: RedesSociais = JSON.parse(textoLimpo);
      setPosts(resultado);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("JSON")) {
        setErro("A IA retornou um formato inesperado. Tente novamente.");
      } else {
        setErro("Erro ao gerar post. Verifique a chave da API no arquivo .env");
      }
    } finally {
      setCarregando(false);
    }
  }

  async function copiar(tipo: "whatsapp" | "instagram") {
    const texto = posts?.[tipo];
    if (!texto) return;
    await navigator.clipboard.writeText(texto);
    setCopiado(tipo);
    setTimeout(() => setCopiado(null), 2000);
  }

  return (
    <div className="mt-6 border-t pt-6">
      <h2 className="text-xl font-bold text-gray-700 mb-1">
        📢 Gerar Post com IA
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Preencha os campos acima e clique para gerar um post pronto para
        WhatsApp e Instagram.
      </p>

      {erro && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
          {erro}
        </div>
      )}

      <button
        type="button"
        onClick={gerarPost}
        disabled={carregando}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition cursor-pointer flex items-center justify-center gap-2"
      >
        {carregando ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Gerando com IA...
          </>
        ) : (
          "✨ Gerar Post com IA"
        )}
      </button>

      {posts && (
        <div className="mt-6 space-y-4">
          {/* WhatsApp */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-green-700 flex items-center gap-1">
                <img
                  src="/img/logozap.png"
                  alt="WhatsApp"
                  className="w-5 h-5 inline"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                WhatsApp
              </span>
              <button
                type="button"
                onClick={() => copiar("whatsapp")}
                className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full transition cursor-pointer"
              >
                {copiado === "whatsapp" ? "✅ Copiado!" : "Copiar"}
              </button>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {posts.whatsapp}
            </p>
          </div>

          {/* Instagram */}
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-pink-700 flex items-center gap-1">
                <img
                  src="/img/insta-logo.png"
                  alt="Instagram"
                  className="w-5 h-5 inline"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                Instagram
              </span>
              <button
                type="button"
                onClick={() => copiar("instagram")}
                className="text-xs bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded-full transition cursor-pointer"
              >
                {copiado === "instagram" ? "✅ Copiado!" : "Copiar"}
              </button>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {posts.instagram}
            </p>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Texto gerado por IA — revise antes de publicar 🐾
          </p>
        </div>
      )}
    </div>
  );
}
