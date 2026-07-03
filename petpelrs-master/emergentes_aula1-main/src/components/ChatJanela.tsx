import { useState } from "react";

type ChatJanelaProps = {
  conversa: {
    animal: any;
    outroUsuario: any;
    mensagens: any[];
  };
  usuarioId?: number;
};

export default function ChatJanela({ conversa, usuarioId }: ChatJanelaProps) {
  const [novaMensagem, setNovaMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  const { mensagens, animal, outroUsuario } = conversa;
  const animalId = animal?.id;
  const destinatarioId = outroUsuario?.id;

  async function enviarMensagem() {
    if (!novaMensagem.trim() || !usuarioId || !animalId || !destinatarioId)
      return;

    setEnviando(true);

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/contatos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensagem: novaMensagem,
          remetenteId: Number(usuarioId),
          destinatarioId: Number(destinatarioId),
          animalId: Number(animalId),
        }),
      });

      if (!resp.ok) throw new Error("Erro ao enviar mensagem");

      setNovaMensagem("");
      // polling vai buscar automaticamente
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar mensagem");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 border-l">
      {/* Header */}
      <div className="p-4 border-b font-bold bg-gray-100">
        Conversa sobre {animal?.nome}
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {mensagens.map((msg) => {
          const enviadaPorMim = msg.remetenteId === usuarioId;

          return (
            <div
              key={msg.id}
              className={`max-w-xs p-3 rounded-lg text-sm ${
                enviadaPorMim
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-white border"
              }`}
            >
              <p>{msg.mensagem}</p>
              <span className="text-[10px] opacity-70 block mt-1">
                {new Date(msg.criadoEm).toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          value={novaMensagem}
          onChange={(e) => setNovaMensagem(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={enviarMensagem}
          disabled={enviando}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
