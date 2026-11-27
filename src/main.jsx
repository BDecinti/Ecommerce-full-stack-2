// =====================================================================
// src/main.jsx  ->  PUNTO DE ENTRADA DEL FRONTEND
// index.html lo carga con <script src="/src/main.jsx">. Es lo PRIMERO de tu codigo
// React que se ejecuta: aqui React toma el <div id="root"> y dibuja la tienda.
// =====================================================================

// StrictMode: modo de ayuda en desarrollo (a veces repite efectos para detectar errores).
import { StrictMode } from "react";
// createRoot: conecta React con el HTML de la pagina.
import { createRoot } from "react-dom/client";
// BrowserRouter: permite que React lea la URL y cambie de pagina sin recargar.
import { BrowserRouter } from "react-router-dom";
// App: define las rutas (que pagina se ve segun la URL). Ver src/App.jsx.
import App from "./App.jsx";
// Providers = "proveedores" de datos globales (Context). Cada uno carga o guarda algo
// y lo deja disponible para toda la app: sesion, categorias, productos, pedidos, usuarios, carrito.
import { AuthProvider } from "./context/AuthContext.jsx";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { PedidoProvider } from "./context/PedidoContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { UsuariosProvider } from "./context/UsuariosContext.jsx";
// ConnectionBoundary: muestra "Preparando tu tienda..." mientras carga y un error si el backend no responde.
import ConnectionBoundary from "./components/ConnectionBoundary.jsx";
// ScrollToTop: el boton flotante para volver arriba.
import ScrollToTop from "./components/ScrollToTop.jsx";
// Estilos CSS globales: Vite los agrega a la pagina.
import "./styles/global.css";
import "./styles/refinements.css";

// LINEA CLAVE: busca el <div id="root"> de index.html, se lo entrega a React (createRoot)
// y dibuja adentro (render) todo lo que esta entre parentesis.

// El orden de las "capas" IMPORTA: las de adentro pueden usar los datos de las de afuera.
//   BrowserRouter   -> AuthProvider usa useNavigate(), que necesita estar dentro del router.
//   AuthProvider    -> Pedidos y Usuarios consultan quien esta logueado (useAuth).
//   ProductProvider -> Pedidos y Carrito necesitan los productos (useProductos).
//   ConnectionBoundary va adentro de todos porque lee auth, productos y categorias.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CategoryProvider>
          <ProductProvider>
            <PedidoProvider>
              <UsuariosProvider>
                <CartProvider>
                  <ConnectionBoundary>
                    <App />
                    <ScrollToTop />
                  </ConnectionBoundary>
                </CartProvider>
              </UsuariosProvider>
            </PedidoProvider>
          </ProductProvider>
        </CategoryProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
