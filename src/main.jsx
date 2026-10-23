import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { PedidoProvider } from "./context/PedidoContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import "./styles/global.css";
import "./styles/refinements.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CategoryProvider>
          <ProductProvider>
            <PedidoProvider>
              <CartProvider>
                <App />
                <ScrollToTop />
              </CartProvider>
            </PedidoProvider>
          </ProductProvider>
        </CategoryProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
