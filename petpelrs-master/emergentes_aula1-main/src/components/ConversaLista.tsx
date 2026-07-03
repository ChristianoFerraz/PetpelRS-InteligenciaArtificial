type Conversa = {
  animal: any;
  outroUsuario: any;
  mensagens: any[];
};

interface Props {
  conversas: Record<string, Conversa>;
  onSelect: (chave: string) => void;
}

export default function ConversaLista({ conversas, onSelect }: Props) {
  const lista = Object.entries(conversas);

  return (
    <aside className="w-80 border-r bg-white overflow-y-auto">
      <h2 className="text-xl font-bold p-4 border-b">Conversas</h2>

      {lista.length === 0 ? (
        <div className="p-4 text-gray-500 text-sm">
          Nenhuma conversa encontrada
        </div>
      ) : (
        lista.map(([chave, conversa]) => {
          const ultimaMensagem =
            conversa.mensagens[conversa.mensagens.length - 1];

          return (
            <div
              key={chave}
              onClick={() => onSelect(chave)}
              className="flex gap-3 items-center p-4 cursor-pointer hover:bg-gray-100 transition"
            >
              <img
                src={conversa.animal.urlImagem}
                alt={conversa.animal.nome}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-1">
                <p className="font-semibold">{conversa.animal.nome}</p>

                <p className="text-sm text-gray-500 truncate">
                  {ultimaMensagem?.mensagem}
                </p>
              </div>
            </div>
          );
        })
      )}
    </aside>
  );
}
