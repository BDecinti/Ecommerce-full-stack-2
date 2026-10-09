import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import TiendaLayout from "./layouts/TiendaLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

import Home from "./pages/Home.jsx";
import Products from "./pages/products/Products.jsx";
import ProductDetail from "./pages/products/ProductDetail.jsx";
import Cart from "./pages/checkout/Cart.jsx";
import Payment from "./pages/checkout/Payment.jsx";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import About from "./pages/company/About.jsx";
import Contact from "./pages/company/Contact.jsx";
import Posts from "./pages/blog/Posts.jsx";
import Post from "./pages/blog/Post.jsx";

import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminProducts from "./pages/admin/Products.jsx";
import AdminProductForm from "./pages/admin/ProductForm.jsx";
import AdminProductDetail from "./pages/admin/ProductDetail.jsx";
import AdminUsers from "./pages/admin/Users.jsx";
import AdminUserForm from "./pages/admin/UserForm.jsx";
import AdminUserDetail from "./pages/admin/UserDetail.jsx";

// Al cambiar de ruta se vuelve arriba, como ocurría al cargar una página HTML nueva
function ScrollAlInicio() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
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
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Posts />} />
          <Route path="/blog/:id" element={<Post />} />
        </Route>

        {/* Panel de administración: solo accesible con sesión de rol admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id" element={<AdminProductDetail />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/new" element={<AdminUserForm />} />
          <Route path="users/:id" element={<AdminUserDetail />} />
          <Route path="users/:id/edit" element={<AdminUserForm />} />
        </Route>
      </Routes>
    </>
  );
}
