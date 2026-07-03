import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

// Alteração boba para redeploy

export default function App() {
  return (
    <div
      className="
        min-h-screen
        bg-[url('/img/fundo-nuvem.png')]
        bg-cover
        bg-center
        bg-no-repeat
      "
    >
      <Toaster richColors position="top-center" />
      <Outlet />
    </div>
  );
}
