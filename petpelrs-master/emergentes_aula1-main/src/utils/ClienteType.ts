// utils/ClienteType.ts
export type ClienteType = {
  id: number
  nome: string
  email: string
  role: "user" | "admin"
  token: string
}
