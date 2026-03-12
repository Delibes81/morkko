import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

import Home from './pages/Home';
import Morokko from './pages/Morokko';
import Guster from './pages/Guster';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import ProductosCRUD from './pages/admin/ProductosCRUD';
import OrdersCRUD from './pages/admin/OrdersCRUD';
import LoginAdmin from './pages/admin/LoginAdmin';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Nuevas páginas de info
import FAQ from './pages/support/FAQ';
import Envios from './pages/support/Envios';
import Devoluciones from './pages/support/Devoluciones';
import Contacto from './pages/support/Contacto';
import Terminos from './pages/legal/Terminos';
import Privacidad from './pages/legal/Privacidad';

// Componente para manejar las transiciones de ruta animadas
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="morokko" element={<Morokko />} />
          <Route path="guster" element={<Guster />} />
          <Route path="producto/:id" element={<ProductDetail />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="success" element={<Success />} />
          
          {/* Páginas de soporte y legales */}
          <Route path="soporte/faq" element={<FAQ />} />
          <Route path="soporte/envios" element={<Envios />} />
          <Route path="soporte/devoluciones" element={<Devoluciones />} />
          <Route path="soporte/contacto" element={<Contacto />} />
          <Route path="legal/terminos" element={<Terminos />} />
          <Route path="legal/privacidad" element={<Privacidad />} />

          <Route path="admin/login" element={<LoginAdmin />} />
        </Route>

        <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/productos" replace />} />
            <Route path="productos" element={<ProductosCRUD />} />
            <Route path="pedidos" element={<OrdersCRUD />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
