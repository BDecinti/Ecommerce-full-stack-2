import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import TiendaLayout from "./layouts/TiendaLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

import Home from "./pages/Home.jsx";
import Products from "./pages/products/Products.jsx";
import ProductDetail from "./pages/products/ProductDetail.jsx";
import Categories from "./pages/products/Categories.jsx";
import Cart from "./pages/checkout/Cart.jsx";
import Payment from "./pages/checkout/Payment.jsx";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import About from "./pages/company/About.jsx";
import Contact from "./pages/company/Contact.jsx";
import Posts from "./pages/blog/Posts.jsx";
import Post from "./pages/blog/Post.jsx";

import Dashboard from "./pages/admin/Dashboard.jsx";
import ProductReports from "./pages/admin/ProductReports.jsx";
import AdminProducts from "./pages/admin/Products.jsx";
import AdminProductForm from "./pages/admin/ProductForm.jsx";
import AdminProductDetail from "./pages/admin/ProductDetail.jsx";
import AdminCategories from "./pages/admin/Categories.jsx";
import AdminCategoryForm from "./pages/admin/CategoryForm.jsx";
import AdminOrders from "./pages/admin/Orders.jsx";
import AdminOrderForm from "./pages/admin/OrderForm.jsx";
import AdminOrderDetail from "./pages/admin/OrderDetail.jsx";
import AdminUsers from "./pages/admin/Users.jsx";
import AdminUserForm from "./pages/admin/UserForm.jsx";
import AdminUserDetail from "./pages/admin/UserDetail.jsx";
import AdminUserOrders from "./pages/admin/UserOrders.jsx";
import AdminReports from "./pages/admin/Reports.jsx";
import AdminProfile from "./pages/admin/Profile.jsx";

// Al cambiar de ruta se vuelve arriba, como ocurría al cargar una página HTML nueva
function ScrollAlInicio() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollAlInicio />

      <Routes>
        {/* Tienda (usuario): header y footer completos */}
        <Route element={<TiendaLayout />}>
          <Route path="/" element={<Home />} />

          {/* Productos */}
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<Categories />} />

          {/* Compra */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Payment />} />
          <Route path="/payment" element={<Payment />} />

          <Route
            path="*"
            element={
              <section className="container result-card card">
                <h1>Página no encontrada</h1>
                <p>Usa el menú para volver a la tienda.</p>
                <a href="/">Volver al inicio</a>
              </section>
            }
          />
          {/* Autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Empresa */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Blog */}
          <Route path="/blog" element={<Posts />} />
          <Route path="/blog/:id" element={<Post />} />
        </Route>

        {/* Panel de administración: solo accesible con sesión de rol admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />

          {/* Productos */}
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/reports" element={<ProductReports />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id" element={<AdminProductDetail />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />

          {/* Categorías */}
          <Route path="categories" element={<AdminCategories />} />
          <Route path="categories/new" element={<AdminCategoryForm />} />
          <Route path="categories/:id/edit" element={<AdminCategoryForm />} />

          {/* Pedidos */}
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/new" element={<AdminOrderForm />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />

          {/* Usuarios */}
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/new" element={<AdminUserForm />} />
          <Route path="users/:id" element={<AdminUserDetail />} />
          <Route path="users/:id/edit" element={<AdminUserForm />} />
          <Route path="users/:id/orders" element={<AdminUserOrders />} />

          {/* Reportes */}
          <Route path="reports" element={<AdminReports />} />

          {/* Perfil */}
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </>
  );
}
