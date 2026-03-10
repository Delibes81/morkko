import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const LoginAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { setSpecificTheme } = useTheme();

  useEffect(() => {
    setSpecificTheme('dark'); // Dark theme for internal admin pages
    
    // Si ya hay usuario, redirigir al dashboard
    if (user) {
      navigate('/admin/productos', { replace: true });
    }
  }, [user, navigate, setSpecificTheme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await signIn(email, password);

    if (error) {
      setErrorMsg(error.message || 'Credenciales inválidas');
      setLoading(false);
    } else {
      // Éxito: onAuthStateChange en AuthContext actualizará 'user', 
      // y el useEffect superior hará el redireccionamiento.
    }
  };

  return (
    <motion.div 
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="login-card">
        <div className="login-header">
          <div className="lock-icon">
            <Lock size={32} />
          </div>
          <h1>System Access</h1>
          <p>Área exclusiva para administradores</p>
        </div>

        {errorMsg && (
          <div className="error-message">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Admin</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@morokko.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Verificando...' : (
              <>
                <span>Ingresar</span>
                <LogIn size={18} />
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #0a0a0a;
          background-image: radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%);
          padding: var(--space-4);
          font-family: 'Space Grotesk', sans-serif;
        }

        .login-card {
          background: rgba(20, 20, 20, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.05);
          width: 100%;
          max-width: 400px;
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
        }

        .login-header {
          text-align: center;
          margin-bottom: var(--space-5);
        }

        .lock-icon {
          width: 64px;
          height: 64px;
          background: rgba(0, 229, 255, 0.1);
          color: #00E5FF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--space-3);
          border: 1px solid rgba(0, 229, 255, 0.2);
        }

        .login-header h1 {
          font-size: 1.8rem;
          color: #fff;
          margin-bottom: var(--space-1);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .login-header p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
        }

        .error-message {
          background: rgba(255, 71, 87, 0.1);
          border: 1px solid rgba(255, 71, 87, 0.3);
          color: #ff4757;
          padding: var(--space-3);
          border-radius: var(--radius-sm);
          margin-bottom: var(--space-4);
          font-size: 0.9rem;
          text-align: center;
        }

        .form-group {
          margin-bottom: var(--space-4);
        }

        .form-group label {
          display: block;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: var(--space-2);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: rgba(255, 255, 255, 0.3);
        }

        .input-with-icon input {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 12px 12px 12px 40px;
          border-radius: var(--radius-sm);
          font-family: inherit;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .input-with-icon input:focus {
          outline: none;
          background: rgba(0, 0, 0, 0.5);
          border-color: #00E5FF;
        }

        .input-with-icon input:focus + .input-icon,
        .input-with-icon input:not(:placeholder-shown) ~ .input-icon {
          color: #00E5FF;
        }

        .login-btn {
          width: 100%;
          background: #ffffff;
          color: #000000;
          border: none;
          padding: 14px;
          border-radius: var(--radius-sm);
          font-family: inherit;
          font-weight: 600;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: var(--space-5);
        }

        .login-btn:hover:not(:disabled) {
          background: #00E5FF;
          box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
          transform: translateY(-2px);
        }

        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-btn:disabled {
          background: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.5);
          cursor: not-allowed;
        }
      `}</style>
    </motion.div>
  );
};

export default LoginAdmin;
