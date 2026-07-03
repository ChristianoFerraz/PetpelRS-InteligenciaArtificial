import { Link, Outlet, useNavigate } from "react-router-dom"
import { useAdminStore } from "./context/AdminContext"

export default function AdminLayout() {
  const { deslogaAdmin } = useAdminStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    deslogaAdmin()
    navigate("/login-admin")
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-blue-700 text-white p-6">
        <img src="/img/logo_petpel.png" alt="Logo Petpel" />

        <h2 className="text-2xl font-bold mb-4">Painel Admin</h2>

        <ul className="space-y-2">
          <li>
            <Link to="/admin" className="hover:underline">Início</Link>
          </li>
          <li>
            <Link
              to="/admin/listagem"
              className="block py-2 px-3 text-white hover:underline rounded-sm md:bg-transparent md:p-0 "
            >
              Listagem
            </Link>
          </li>
          <li>
            <Link to="/admin/contato" className="hover:underline">
              Mensagens
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className=" w-full text-left hover:underline"
            >
              Sair
            </button>
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
