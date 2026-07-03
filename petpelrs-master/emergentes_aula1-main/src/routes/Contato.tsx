import { useEffect, useState } from "react"
import { useClienteStore } from "../context/ClienteContext"
import { useAdminStore } from "../Admin/context/AdminContext"

type ContatoType = {
  id: number
  mensagem: string
  resposta?: string
  criadoEm: string
  animal: {
    id: number
    nome: string
    raca: string
    idade: number
    urlImagem: string
    cidade: string
    tipo: string
  }
  cliente: {
    id: number
    nome: string
    email: string
  }
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Contato() {
  const [contatos, setContatos] = useState<ContatoType[]>([])
  const [contatoSelecionado, setContatoSelecionado] =
    useState<ContatoType | null>(null)

  const { cliente } = useClienteStore()
  const { admin } = useAdminStore()

  useEffect(() => {
    async function buscar() {
      try {
        if (admin?.role === "admin") {
          const res = await fetch(`${apiUrl}/admin/contatos`, {
            headers: { Authorization: `Bearer ${admin.token}` },
          })
          setContatos(await res.json())
        } else if (cliente) {
          const res = await fetch(`${apiUrl}/contatos/${cliente.id}`)
          setContatos(await res.json())
        }
      } catch (err) {
        console.error(err)
      }
    }
    buscar()
  }, [admin, cliente])

  function dataDMA(data: string) {
    return new Date(data).toLocaleDateString("pt-BR")
  }

  return (
    <div className="h-[calc(100vh-80px)] bg-gray-100 flex">
      {/* SIDEBAR */}
      <aside className="w-full md:w-1/3 lg:w-1/4 bg-white border-r overflow-y-auto">
        <h2 className="p-4 text-xl font-bold border-b">
          Conversas
        </h2>

        {contatos.map((contato) => (
          <div
            key={contato.id}
            onClick={() => setContatoSelecionado(contato)}
            className={`flex gap-3 p-4 cursor-pointer hover:bg-gray-100 ${
              contatoSelecionado?.id === contato.id
                ? "bg-gray-200"
                : ""
            }`}
          >
            <img
              src={contato.animal.urlImagem}
              className="w-12 h-12 rounded-full object-cover"
            />

            <div className="flex-1">
              <p className="font-semibold">
                {contato.animal.nome}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {contato.mensagem}
              </p>
            </div>
          </div>
        ))}
      </aside>

      {/* CHAT */}
      <main className="flex-1 flex flex-col">
        {!contatoSelecionado ? (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Selecione uma conversa
          </div>
        ) : (
          <>
            {/* HEADER */}
            <header className="bg-white border-b p-4 flex items-center gap-4">
              <img
                src={contatoSelecionado.animal.urlImagem}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-bold text-lg">
                  {contatoSelecionado.animal.nome}
                </h3>
                <p className="text-sm text-gray-500">
                  {contatoSelecionado.animal.raca} •{" "}
                  {contatoSelecionado.animal.cidade}
                </p>
              </div>
            </header>

            {/* MENSAGENS */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {/* Mensagem do cliente */}
              <div className="max-w-lg bg-blue-600 text-white p-4 rounded-xl">
                <p>{contatoSelecionado.mensagem}</p>
                <span className="text-xs opacity-80 block mt-1">
                  {dataDMA(contatoSelecionado.criadoEm)}
                </span>
              </div>

              {/* Resposta */}
              {contatoSelecionado.resposta && (
                <div className="max-w-lg ml-auto bg-gray-300 p-4 rounded-xl">
                  <p>{contatoSelecionado.resposta}</p>
                </div>
              )}
            </div>

            {/* INPUT (visual apenas por enquanto) */}
            <footer className="bg-white p-4 border-t">
              <input
                disabled
                placeholder="Resposta via sistema (em breve)"
                className="w-full p-3 border rounded-lg bg-gray-100"
              />
            </footer>
          </>
        )}
      </main>
    </div>
  )
}
