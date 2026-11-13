import PageTransition from "../components/PageTransition.jsx";
import RequireRole from "../components/RequireRole.jsx";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import { usePedidos } from "../context/PedidoContext.jsx";
import { useUsuarios } from "../context/UsuariosContext.jsx";
export default function AdminLayout() {
  const pedidos = usePedidos(),
    usuarios = useUsuarios();
  return (
    <RequireRole roles={["admin", "vendedor"]}>
      <div className="admin-shell">
        <AdminSidebar />
        <main className="admin-main">
          {pedidos.error && (
            <p className="alert alert-error" role="alert">
              {pedidos.error}
            </p>
          )}
          {usuarios.error && (
            <p className="alert alert-error" role="alert">
              {usuarios.error}
            </p>
          )}
          {pedidos.cargando || usuarios.cargando ? (
            <p role="status">Cargando datos…</p>
          ) : (
            <PageTransition />
          )}
        </main>
      </div>
    </RequireRole>
  );
}
