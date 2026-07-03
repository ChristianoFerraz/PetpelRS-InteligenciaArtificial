import { useState } from "react";

type Respostas = {
  moradia: string;
  temFilhos: string;
  temOutrosAnimais: string;
  tempoEmCasa: string;
  atividadeFisica: string;
  experiencia: string;
  preferencia: string;
};

type AnimalDoSite = {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  tipo: string;
  cidade: string;
  urlImagem: string;
  usuario?: { nome: string; email: string };
};

type AnimalRecomendado = {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  urlImagem: string;
  motivo: string;
  compatibilidade: number; // 0-100
};

type Resultado = {
  perfil: string;
  animais: AnimalRecomendado[];
  dicas: string[];
  alerta?: string;
};

const PERGUNTAS = [
  {
    key: "moradia",
    pergunta: "Onde você mora?",
    opcoes: [
      { valor: "apartamento_pequeno", label: "🏢 Apartamento pequeno (até 50m²)" },
      { valor: "apartamento_grande", label: "🏬 Apartamento grande (acima de 50m²)" },
      { valor: "casa_sem_quintal", label: "🏠 Casa sem quintal" },
      { valor: "casa_com_quintal", label: "🏡 Casa com quintal" },
    ],
  },
  {
    key: "temFilhos",
    pergunta: "Você tem filhos?",
    opcoes: [
      { valor: "nao", label: "❌ Não" },
      { valor: "sim_bebes", label: "👶 Bebês ou crianças pequenas (0–4 anos)" },
      { valor: "sim_criancas", label: "🧒 Crianças (5–12 anos)" },
      { valor: "sim_adolescentes", label: "🧑 Adolescentes (13+ anos)" },
    ],
  },
  {
    key: "temOutrosAnimais",
    pergunta: "Já tem outros animais em casa?",
    opcoes: [
      { valor: "nao", label: "❌ Não" },
      { valor: "cachorro", label: "🐶 Sim, cachorro(s)" },
      { valor: "gato", label: "🐱 Sim, gato(s)" },
      { valor: "outros", label: "🐾 Sim, outros animais" },
    ],
  },
  {
    key: "tempoEmCasa",
    pergunta: "Quanto tempo você passa em casa por dia?",
    opcoes: [
      { valor: "pouco", label: "⏱️ Menos de 4 horas" },
      { valor: "medio", label: "🕐 Entre 4 e 8 horas" },
      { valor: "muito", label: "🏠 Mais de 8 horas" },
      { valor: "home_office", label: "💻 Trabalho em casa (home office)" },
    ],
  },
  {
    key: "atividadeFisica",
    pergunta: "Como é sua rotina de atividade física?",
    opcoes: [
      { valor: "sedentario", label: "🛋️ Sedentária, prefiro ficar em casa" },
      { valor: "moderado", label: "🚶 Moderada, saio para caminhar às vezes" },
      { valor: "ativo", label: "🏃 Ativa, me exercito regularmente" },
      { valor: "muito_ativo", label: "⚡ Muito ativa, adoro atividades ao ar livre" },
    ],
  },
  {
    key: "experiencia",
    pergunta: "Qual sua experiência com animais?",
    opcoes: [
      { valor: "nenhuma", label: "🔰 Nenhuma, será meu primeiro animal" },
      { valor: "pouca", label: "📚 Pouca, tive animais na infância" },
      { valor: "media", label: "✅ Média, já tive animais como adulto" },
      { valor: "muita", label: "🏅 Muita, tenho bastante experiência" },
    ],
  },
  {
    key: "preferencia",
    pergunta: "Você tem alguma preferência de animal?",
    opcoes: [
      { valor: "cachorro", label: "🐶 Cachorro" },
      { valor: "gato", label: "🐱 Gato" },
      { valor: "qualquer", label: "🐾 Sem preferência, quero a melhor indicação" },
      { valor: "pequeno_porte", label: "🐭 Prefiro animais de pequeno porte" },
    ],
  },
];

export default function AnalisadorAdocao() {
  const [etapa, setEtapa] = useState(0);
  const [respostas, setRespostas] = useState<Partial<Respostas>>({});
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagemCarregando, setMensagemCarregando] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [semAnimais, setSemAnimais] = useState(false);

  const totalPerguntas = PERGUNTAS.length;
  const perguntaAtual = PERGUNTAS[etapa - 1];
  const progresso = etapa > 0 ? Math.round((etapa / totalPerguntas) * 100) : 0;

  function responder(valor: string) {
    const novasRespostas = { ...respostas, [perguntaAtual.key]: valor };
    setRespostas(novasRespostas);
    if (etapa < totalPerguntas) {
      setEtapa(etapa + 1);
    } else {
      analisar(novasRespostas);
    }
  }

  async function analisar(dados: Partial<Respostas>) {
    setCarregando(true);
    setErro(null);
    setSemAnimais(false);

    try {
      // PASSO 1: buscar animais de adoção do site
      setMensagemCarregando("Buscando animais disponíveis no site...");
      const apiUrl = import.meta.env.VITE_API_URL;
      const respAnimais = await fetch(`${apiUrl}/animais`);
      if (!respAnimais.ok) throw new Error("Não foi possível buscar os animais do site.");

      const todosAnimais: AnimalDoSite[] = await respAnimais.json();
      const animaisAdocao = todosAnimais.filter((a) => a.tipo === "ADOCAO");

      if (animaisAdocao.length === 0) {
        setSemAnimais(true);
        setCarregando(false);
        return;
      }

      // PASSO 2: montar lista resumida para a IA (evitar payload gigante)
      const listaParaIA = animaisAdocao.map((a) => ({
        id: a.id,
        nome: a.nome,
        raca: a.raca,
        idade: a.idade,
      }));

      // PASSO 3: chamar a IA
      setMensagemCarregando("A IA está analisando seu perfil...");

      const perfilTexto = `
- Moradia: ${dados.moradia}
- Filhos: ${dados.temFilhos}
- Outros animais: ${dados.temOutrosAnimais}
- Tempo em casa: ${dados.tempoEmCasa}
- Atividade física: ${dados.atividadeFisica}
- Experiência com animais: ${dados.experiencia}
- Preferência: ${dados.preferencia}
      `.trim();

      const promptSistema = `Você é um especialista em adoção responsável de animais.
Analise o perfil do adotante e recomende animais da lista fornecida.
Responda APENAS em JSON válido, sem texto antes ou depois, sem markdown.`;

      const promptUsuario = `Perfil do adotante:
${perfilTexto}

Animais disponíveis para adoção no site (id, nome, raça, idade em anos):
${JSON.stringify(listaParaIA, null, 2)}

Escolha entre 2 e 3 animais da lista acima que mais combinam com este perfil.
Retorne um JSON com esta estrutura exata:
{
  "perfil": "Resumo do perfil do adotante em 1-2 frases",
  "animais": [
    {
      "id": 1,
      "motivo": "Por que este animal específico combina com o perfil (1-2 frases diretas)",
      "compatibilidade": 92
    }
  ],
  "dicas": ["Dica 1 personalizada para este perfil", "Dica 2", "Dica 3"],
  "alerta": "Alerta importante se houver preocupação com o perfil, ou null"
}

Regras:
- Use APENAS ids que existem na lista fornecida
- compatibilidade é um número de 0 a 100
- Ordene do mais compatível para o menos
- Seja honesto se o perfil não for ideal para algum animal`;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "PetPelrs - Analisador de Adoção",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b:free",
          messages: [
            { role: "system", content: promptSistema },
            { role: "user", content: promptUsuario },
          ],
          temperature: 0.5,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        const detalhe = await response.text();
        throw new Error(`Erro na API: ${response.status} - ${detalhe}`);
      }

      const data = await response.json();
      const textoResposta = data.choices?.[0]?.message?.content;
      if (!textoResposta) throw new Error("A IA não retornou resposta.");

      const textoLimpo = textoResposta.replace(/```json/g, "").replace(/```/g, "").trim();
      const iaResult = JSON.parse(textoLimpo);

      // PASSO 4: enriquecer com dados reais dos animais
      const animaisEnriquecidos: AnimalRecomendado[] = iaResult.animais
        .map((rec: { id: number; motivo: string; compatibilidade: number }) => {
          const animalReal = animaisAdocao.find((a) => a.id === rec.id);
          if (!animalReal) return null;
          return {
            id: animalReal.id,
            nome: animalReal.nome,
            raca: animalReal.raca,
            idade: animalReal.idade,
            urlImagem: animalReal.urlImagem,
            motivo: rec.motivo,
            compatibilidade: rec.compatibilidade,
          };
        })
        .filter(Boolean);

      setResultado({
        perfil: iaResult.perfil,
        animais: animaisEnriquecidos,
        dicas: iaResult.dicas,
        alerta: iaResult.alerta,
      });
      setEtapa(totalPerguntas + 1);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("JSON")) {
        setErro("A IA retornou um formato inesperado. Tente novamente.");
      } else {
        setErro(err.message || "Erro ao analisar perfil. Verifique a chave VITE_OPENROUTER_API_KEY no arquivo .env");
      }
      setEtapa(totalPerguntas);
    } finally {
      setCarregando(false);
    }
  }

  function reiniciar() {
    setEtapa(0);
    setRespostas({});
    setResultado(null);
    setErro(null);
    setSemAnimais(false);
  }

  function corCompatibilidade(valor: number) {
    if (valor >= 80) return "bg-green-500";
    if (valor >= 60) return "bg-yellow-400";
    return "bg-orange-400";
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">

        {/* INTRO */}
        {etapa === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🐾</div>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-3">
              Qual animal do site combina com você?
            </h1>
            <p className="text-gray-500 mb-2">
              Responda algumas perguntas sobre seu estilo de vida e a IA vai
              recomendar animais <strong>reais cadastrados no site</strong> que
              mais combinam com seu perfil.
            </p>
            <p className="text-sm text-gray-400 mb-8">
              {totalPerguntas} perguntas · menos de 2 minutos
            </p>
            <button
              onClick={() => setEtapa(1)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg transition cursor-pointer"
            >
              Começar análise ✨
            </button>
          </div>
        )}

        {/* PERGUNTAS */}
        {etapa >= 1 && etapa <= totalPerguntas && !carregando && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Pergunta {etapa} de {totalPerguntas}</span>
                <span>{progresso}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {perguntaAtual.pergunta}
            </h2>

            <div className="grid gap-3">
              {perguntaAtual.opcoes.map((opcao) => (
                <button
                  key={opcao.valor}
                  onClick={() => responder(opcao.valor)}
                  className="w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition font-medium text-gray-700 cursor-pointer"
                >
                  {opcao.label}
                </button>
              ))}
            </div>

            {etapa > 1 && (
              <button
                onClick={() => setEtapa(etapa - 1)}
                className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                ← Voltar
              </button>
            )}
          </div>
        )}

        {/* CARREGANDO */}
        {carregando && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-5xl mb-4 animate-bounce">🐾</div>
            <p className="text-lg font-semibold text-gray-700">{mensagemCarregando}</p>
            <p className="text-sm text-gray-400 mt-2">Isso pode levar alguns segundos...</p>
          </div>
        )}

        {/* SEM ANIMAIS DISPONÍVEIS */}
        {semAnimais && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">😔</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Nenhum animal disponível no momento</h2>
            <p className="text-gray-500 mb-6">
              Ainda não há animais cadastrados para adoção no site. Volte em breve!
            </p>
            <a href="/" className="text-blue-600 underline">Ver todos os animais</a>
          </div>
        )}

        {/* ERRO */}
        {erro && !carregando && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl px-5 py-4 mt-4 text-sm">
            {erro}
            <button
              onClick={() => analisar(respostas)}
              className="block mt-2 underline cursor-pointer"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* RESULTADO */}
        {etapa === totalPerguntas + 1 && resultado && (
          <div className="space-y-5">

            {/* Perfil */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-5xl mb-3">✨</div>
              <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
                Seu perfil de adotante
              </h2>
              <p className="text-gray-600">{resultado.perfil}</p>
            </div>

            {/* Alerta */}
            {resultado.alerta && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-5 py-4 flex gap-3">
                <span className="text-2xl">⚠️</span>
                <p className="text-yellow-800 text-sm">{resultado.alerta}</p>
              </div>
            )}

            {/* Animais recomendados */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-3 px-1">
                🐾 Animais do site que combinam com você
              </h3>
              <div className="space-y-4">
                {resultado.animais.map((animal, i) => (
                  <div key={animal.id} className="bg-white rounded-2xl shadow overflow-hidden">
                    {/* Imagem */}
                    <div className="relative h-48">
                      <img
                        src={animal.urlImagem}
                        alt={animal.nome}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/400x200?text=Sem+foto";
                        }}
                      />
                      {/* Badge compatibilidade */}
                      <div className="absolute top-3 right-3">
                        <span className={`${corCompatibilidade(animal.compatibilidade)} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                          {animal.compatibilidade}% compatível
                        </span>
                      </div>
                      {/* Badge posição */}
                      {i === 0 && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                            ⭐ Melhor match
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">{animal.nome}</h4>
                          <p className="text-sm text-gray-500">{animal.raca} · {animal.idade} {animal.idade === 1 ? "ano" : "anos"}</p>
                        </div>
                      </div>

                      {/* Barra de compatibilidade */}
                      <div className="mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`${corCompatibilidade(animal.compatibilidade)} h-1.5 rounded-full transition-all`}
                            style={{ width: `${animal.compatibilidade}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{animal.motivo}</p>

                      <a
                        href="/"
                        className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition"
                      >
                        Ver no site 🐾
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dicas */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <h3 className="font-bold text-blue-800 mb-3">💡 Dicas para você</h3>
              <ul className="space-y-2">
                {resultado.dicas.map((dica, i) => (
                  <li key={i} className="text-blue-700 text-sm flex gap-2">
                    <span>•</span>
                    <span>{dica}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pb-6">
              <button
                onClick={reiniciar}
                className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-semibold transition cursor-pointer"
              >
                Refazer análise
              </button>
              <a
                href="/"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition text-center"
              >
                Ver todos os animais
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
