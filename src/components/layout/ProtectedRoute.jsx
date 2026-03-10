import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#fff' }}>
        Verificando acceso...
      </div>
    );
  }

  // Si no hay usuario o si el usuario no tiene rol de admin, redirigir
  if (!user || !isAdmin) {
    // Optionally: You could have an "unauthorized" page instead of login if user exists but isn't admin
    return <Navigate to={user ? "/" : "/admin/login"} state={{ from: location }} replace />;
  }

  // Si hay usuario y es admin, renderizar el componente hijo
  return children;
};

export default ProtectedRoute;
