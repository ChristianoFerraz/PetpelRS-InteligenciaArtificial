// context/AdminContext.tsx
import { create } from "zustand"

type Admin = {
  id: number
  nome: string
  email: string
  role: string
  token: string
}

type AdminStore = {
  admin: Admin | null
  logaAdmin: (admin: Admin) => void
  deslogaAdmin: () => void
}

export const useAdminStore = create<AdminStore>((set) => {
  const adminFromStorage = localStorage.getItem("admin")
  const parsedAdmin = adminFromStorage ? JSON.parse(adminFromStorage) : null

  return {
    admin: parsedAdmin,
    logaAdmin: (admin) => {
      localStorage.setItem("admin", JSON.stringify(admin))
      set({ admin })
    },
    deslogaAdmin: () => {
      localStorage.removeItem("admin")
      set({ admin: null })
    }
  }
})
