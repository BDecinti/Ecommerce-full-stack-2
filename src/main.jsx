import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { PedidoProvider } from "./context/PedidoContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { UsuariosProvider } from "./context/UsuariosContext.jsx";
import ConnectionBoundary from "./components/common/ConnectionBoundary.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import "./styles/base/global.css";
import "./styles/base/refinements.css";

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
