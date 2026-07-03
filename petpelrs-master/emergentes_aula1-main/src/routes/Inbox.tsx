import { useEffect, useRef, useState } from "react";
import { useClienteStore } from "../context/ClienteContext";
import ChatJanela from "../components/ChatJanela";
import ConversaLista from "../components/ConversaLista";

/* =======================
   TIPOS
======================= */

export type Mensagem = {
  id: number;
  mensagem: string;
  criadoEm: string;
  animalId: number;
  remetenteId: number;
  destinatarioId: number;
  animal: any;
  remetente: any;
  destinatario: any;
};

export type Conversa = {
  animal: any;
  outroUsuario: any; // o outro participante da conversa
  mensagens: Mensagem[];
};

export default function Inbox() {
  const { cliente } = useClienteStore();

  // ⚠️ AQUI estava um dos problemas: não use any[]
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [conversaSelecionada, setConversaSelecionada] = useState<string | null>(
    null
  );

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  async function carregarMensagens() {
    if (!cliente?.id) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/contatos/inbox/${
          cliente.id
        }?tipo=cliente`
      );

      const data: Mensagem[] = await res.json();
      if (!Array.isArray(data)) return;

      // 🔒 evita duplicação no polling
      setMensagens((prev) => {
        const mapa = new Map<number, Mensagem>();

        [...prev, ...data].forEach((msg) => {
          mapa.set(msg.id, msg);
        });

        return Array.from(mapa.values()).sort(
          (a, b) =>
            new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime()
        );
      });
    } catch (error) {
      console.error("Erro ao carregar inbox:", error);
    }
  }

  useEffect(() => {
    if (!cliente?.id) return;

    carregarMensagens(); // carga inicial
    pollingRef.current = setInterval(carregarMensagens, 5000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [cliente?.id]);

  /* =======================
     AGRUPA POR CONVERSA
     (ANIMAL + OUTRO USUÁRIO)
  ======================= */

  const conversas: Record<string, Conversa> = mensagens.reduce(
    (acc: Record<string, Conversa>, msg: Mensagem) => {
      if (!msg.animal || !msg.remetente || !msg.destinatario) return acc;

      // Determina quem é o "outro" na conversa
      const outroUsuario =
        msg.remetenteId === cliente?.id ? msg.destinatario : msg.remetente;

      const chave = `${msg.animal.id}-${outroUsuario.id}`;

      if (!acc[chave]) {
        acc[chave] = {
          animal: msg.animal,
          outroUsuario,
          mensagens: [],
        };
      }

      acc[chave].mensagens.push(msg);
      return acc;
    },
    {}
  );

  // 🔁 ordena mensagens internas de cada conversa
  Object.values(conversas).forEach((conversa) => {
    conversa.mensagens.sort(
      (a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime()
    );
  });

  // 🧹 se a conversa selecionada sumir, limpa
  useEffect(() => {
    if (conversaSelecionada && !conversas[conversaSelecionada]) {
      setConversaSelecionada(null);
    }
  }, [conversas, conversaSelecionada]);

  // ✅ Marca mensagens como lidas ao selecionar conversa
  async function handleSelectConversa(chave: string) {
    setConversaSelecionada(chave);

    const conversa = conversas[chave];
    if (!conversa || !cliente?.id) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/contatos/marcar-lidas`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: cliente.id,
          animalId: conversa.animal.id,
          outroUsuarioId: conversa.outroUsuario.id,
        }),
      });
    } catch (err) {
      console.error("Erro ao marcar mensagens como lidas:", err);
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <ConversaLista conversas={conversas} onSelect={handleSelectConversa} />

      {conversaSelecionada ? (
        <ChatJanela
          conversa={conversas[conversaSelecionada]}
          usuarioId={cliente?.id}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Selecione uma conversa
        </div>
      )}
    </div>
  );
}
