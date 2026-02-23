import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const { theme } = useTheme();
  const { totalItems, openCart } = useCart();

  // Estilos de Glassmorphism dinámicos según el tema base actual (para mimetizarse)
  const isDark = theme === 'dark';

  const headerStyle = {
    background: isDark ? 'rgba(5, 5, 5, 0.7)' : 'rgba(249, 249, 246, 0.7)',
    backdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    color: isDark ? '#FFFFFF' : '#222222',
    transition: 'background 0.8s, color 0.8s, border-color 0.8s'
  };

  return (
    <header
      style={headerStyle}
      className="header-base"
    >
      <div className="container header-content">
        <nav className="header-nav">
          <Link to="/morokko" className="nav-link">Morokko</Link>
          <Link to="/guster" className="nav-link">Guster</Link>
        </nav>

        <div className="header-logo">
          <Link to="/" style={{ fontWeight: 700, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Morokko
          </Link>
        </div>

        <div className="header-actions">
          <button className="icon-btn"><Search size={20} /></button>
          <button className="icon-btn"><User size={20} /></button>
          <button className="icon-btn cart-btn" onClick={openCart}>
            <ShoppingBag size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
        </div>
      </div>

      {/* Estilos específicos de los componentes para no saturar index.css */}
      <style>{`
        .header-base {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--header-height);
          z-index: 100;
        }
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }
        .header-nav {
          display: flex;
          gap: var(--space-3);
          flex: 1;
        }
        .nav-link {
          font-weight: 500;
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0%;
          height: 1px;
          background-color: currentColor;
          transition: width 0.3s;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .header-logo {
          flex: 1;
          text-align: center;
        }
        .header-actions {
          display: flex;
          gap: var(--space-2);
          flex: 1;
          justify-content: flex-end;
        }
        .icon-btn {
          color: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.3s;
        }
        .icon-btn:hover {
          opacity: 0.7;
        }
        .cart-btn {
          position: relative;
        }
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: var(--accent-color);
          color: var(--text-inverse);
          font-size: 0.7rem;
          font-weight: 600;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .header-nav {
            gap: var(--space-2);
          }
          .header-logo {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
