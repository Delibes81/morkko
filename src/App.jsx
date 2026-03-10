import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/layout/Layout';

import Home from './pages/Home';
import Morokko from './pages/Morokko';
import Guster from './pages/Guster';
import ProductosCRUD from './pages/admin/ProductosCRUD';
import LoginAdmin from './pages/admin/LoginAdmin';
import ProtectedRoute from './components/layout/ProtectedRoute';

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
          <Route path="admin/login" element={<LoginAdmin />} />
          <Route 
            path="admin/productos" 
            element={
              <ProtectedRoute>
                <ProductosCRUD />
              </ProtectedRoute>
            } 
          />
          {/* Default redirect for /admin to products */}
          <Route path="admin" element={<Navigate to="/admin/productos" replace />} />
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
