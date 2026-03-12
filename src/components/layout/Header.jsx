import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { theme } = useTheme();
  const { totalItems, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Estilos de Glassmorphism dinámicos según el tema base actual (para mimetizarse)
  const isDark = theme === 'dark';

  const headerStyle = {
    background: isDark ? 'rgba(5, 5, 5, 0.7)' : 'rgba(255, 255, 255, 0.7)',
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
        
        {/* Mobile Hamburger Icon */}
        <button className="icon-btn mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-only">
          <Link to="/morokko" className="nav-link">Morokko</Link>
          <Link to="/guster" className="nav-link">Guster</Link>
        </nav>

        {/* Logo (Centered) */}
        <div className="header-logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src="/MG_LOGO_LARGO.png" 
              alt="Morokko y Guster" 
              className="logo-desktop"
              style={{ 
                height: '28px', 
                objectFit: 'contain',
                filter: isDark ? 'invert(1)' : 'none',
                transition: 'filter 0.8s'
              }} 
            />
            <img 
              src="/MG_ISOTIPO.png" 
              alt="M&G" 
              className="logo-mobile"
              style={{ 
                height: '32px', 
                objectFit: 'contain',
                filter: isDark ? 'invert(1)' : 'none',
                transition: 'filter 0.8s'
              }} 
            />
          </Link>
        </div>

        {/* Actions (Cart is always visible, others move to menu on mobile) */}
        <div className="header-actions">
          <div className="desktop-only action-group">
            <button className="icon-btn"><Search size={20} /></button>
            <button className="icon-btn"><User size={20} /></button>
          </div>
          <button className="icon-btn cart-btn" onClick={openCart}>
            <ShoppingBag size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content" style={{ backgroundColor: isDark ? '#050505' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#222222' }}>
            <nav className="mobile-nav">
              <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
              <Link to="/morokko" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Morokko</Link>
              <Link to="/guster" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Guster</Link>
            </nav>
            <div className="mobile-actions">
              <button className="mobile-action-btn"><Search size={20} /> Buscar</button>
              <button className="mobile-action-btn"><User size={20} /> Mi Cuenta</button>
            </div>
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

        .mobile-menu-btn {
          display: none; /* Hidden on desktop */
          flex: 1;
          justify-content: flex-start;
        }
        
        .action-group {
          display: flex;
          gap: var(--space-2);
        }

        .logo-mobile {
          display: none;
        }
        
        /* Mobile Menu Overlay Styles */
        .mobile-menu-overlay {
          position: fixed;
          top: var(--header-height);
          left: 0;
          width: 100%;
          height: calc(100vh - var(--header-height));
          background-color: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 90;
        }
        
        .mobile-menu-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        
        .mobile-menu-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          background-color: white;
          padding: var(--space-4);
          transform: translateY(-100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        
        .mobile-menu-overlay.open .mobile-menu-content {
          transform: translateY(0);
        }
        
        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        
        .mobile-nav-link {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          text-transform: uppercase;
          text-decoration: none;
          color: inherit;
          padding: var(--space-2) 0;
          border-bottom: 1px solid rgba(128,128,128,0.2);
        }
        
        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        
        .mobile-action-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: none;
          border: none;
          font-size: 1.1rem;
          font-family: inherit;
          color: inherit;
          cursor: pointer;
          padding: var(--space-2) 0;
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          
          .mobile-menu-btn {
            display: flex;
          }
          
          .logo-desktop {
            display: none;
          }
          
          .logo-mobile {
            display: block;
          }
          
          .header-nav {
             display: none;
          }
          
          .header-logo {
            flex: 2;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
