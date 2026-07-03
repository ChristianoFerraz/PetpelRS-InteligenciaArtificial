export type Mensagem = {
  id: number
  mensagem: string
  criadoEm: string
  clienteId: number
  animal: {
    id: number
    nome: string
    urlImagem: string
    usuarioId: number
  }
  cliente: {
    id: number
    nome: string
  }
}
