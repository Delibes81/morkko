import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const [hoveredSide, setHoveredSide] = useState(null);
  const navigate = useNavigate();
  const { setSpecificTheme } = useTheme();

  // Reset theme on home just in case
  useEffect(() => {
    setSpecificTheme('light');
  }, [setSpecificTheme]);

  const handleNavigate = (path, theme) => {
    // We update the specific theme early to start color transitions
    setSpecificTheme(theme);
    navigate(path);
  };

  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="home-split">
        {/* Morokko Side */}
        <motion.div
          className="split-side morokko-side"
          onMouseEnter={() => setHoveredSide('morokko')}
          onMouseLeave={() => setHoveredSide(null)}
          animate={{
            flex: hoveredSide === 'morokko' ? 1.5 : hoveredSide === 'guster' ? 0.5 : 1,
            opacity: hoveredSide === 'guster' ? 0.5 : 1
          }}
          transition={{ duration: 0.6, ease: [0.85, 0, 0.15, 1] }}
        >
          <div className="side-content">
            <h1>Morokko</h1>
            <p>Lino, Algodón, Lifestyle.</p>
            <button
              className="btn btn-morokko"
              onClick={() => handleNavigate('/morokko', 'light')}
            >
              Descubre Morokko
            </button>
          </div>
          <div className="side-bg morokko-bg"></div>
        </motion.div>

        {/* Guster Side */}
        <motion.div
          className="split-side guster-side"
          onMouseEnter={() => setHoveredSide('guster')}
          onMouseLeave={() => setHoveredSide(null)}
          animate={{
            flex: hoveredSide === 'guster' ? 1.5 : hoveredSide === 'morokko' ? 0.5 : 1,
            opacity: hoveredSide === 'morokko' ? 0.5 : 1
          }}
          transition={{ duration: 0.6, ease: [0.85, 0, 0.15, 1] }}
        >
          <div className="side-content">
            <h1>Guster</h1>
            <p>Urbano, Nocturno, Catrinas.</p>
            <button
              className="btn btn-guster"
              onClick={() => handleNavigate('/guster', 'dark')}
            >
              Adéntrate en Guster
            </button>
          </div>
          <div className="side-bg guster-bg"></div>
        </motion.div>
      </div>

      {/* Featured Products Section */}
      <section className="home-section featured-products">
        <div className="container">
          <h2 className="section-title">Descubre el Contraste</h2>
          <p className="section-subtitle">Lo mejor de ambos mundos</p>

          <div className="products-grid">
            {/* Placeholder Products */}
            {[1, 2].map((item) => (
              <div key={`m-${item}`} className="product-card">
                <div className="product-image-placeholder morokko-placeholder">
                  <span>Morokko Item {item}</span>
                </div>
                <h3>Playera Lino Básica</h3>
                <p>$450 MXN</p>
              </div>
            ))}
            {[1, 2].map((item) => (
              <div key={`g-${item}`} className="product-card dark-card">
                <div className="product-image-placeholder guster-placeholder">
                  <span>Guster Item {item}</span>
                </div>
                <h3>Sudadera Catrina</h3>
                <p>$850 MXN</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="home-section brand-story">
        <div className="brand-story-bg"></div>
        <div className="container brand-story-content">
          <h2 className="section-title">Dos Marcas, Una Actitud</h2>
          <div className="story-text">
            <p>Nacimos de la dualidad. <strong>Morokko</strong> representa la frescura, el día, la textura natural del lino y el algodón. Es el estilo de vida relajado y elegante.</p>
            <p><strong>Guster</strong> es la noche, el asfalto, la rebeldía urbana. Diseños audaces con nuestra icónica catrina que desafían lo convencional.</p>
            <p>No tienes que elegir. Eres ambos.</p>
          </div>
        </div>
      </section>

      <style>{`
        .home-page {
          width: 100%;
          min-height: 100vh;
          background-color: #F9F9F6; /* Color base */
        }
        
        .home-split {
          display: flex;
          height: calc(100vh - var(--header-height));
          width: 100vw;
          overflow: hidden;
          position: relative;
        }

        .split-side {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          overflow: hidden;
        }

        .side-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
        }

        .side-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
          background-size: cover;
          background-position: center;
          transition: transform 1.2s cubic-bezier(0.85, 0, 0.15, 1);
        }

        .split-side:hover .side-bg {
          transform: scale(1.05);
        }

        .morokko-side {
          background-color: #F9F9F6;
          color: #222222;
        }

        .morokko-side h1 {
          font-family: 'Playfair Display', serif;
          font-size: 4rem;
        }

        .guster-side {
          background-color: #111111;
          color: #FFFFFF;
        }
        
        .guster-side h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 4rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .btn {
          padding: var(--space-2) var(--space-4);
          font-weight: 600;
          letter-spacing: 1px;
          transition: transform 0.3s, background-color 0.3s;
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .btn-morokko {
          background-color: #222222;
          color: #FFFFFF;
          border-radius: var(--radius-full);
        }

        .btn-guster {
          background-color: transparent;
          color: #FFFFFF;
          border: 2px solid #00E5FF;
          border-radius: var(--radius-none);
          text-transform: uppercase;
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.2);
        }
        .btn-guster:hover {
          background-color: rgba(0, 229, 255, 0.1);
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.4);
        }

        /* Home Sections */
        .home-section {
            padding: var(--space-6) 0;
            text-align: center;
        }
        
        .section-title {
            font-family: 'Playfair Display', serif;
            font-size: 2.5rem;
            margin-bottom: var(--space-1);
            color: #222;
        }
        .section-subtitle {
            font-size: 1.1rem;
            opacity: 0.7;
            margin-bottom: var(--space-5);
            font-family: 'Space Grotesk', sans-serif;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: var(--space-4);
            text-align: left;
        }

        .product-card {
            display: flex;
            flex-direction: column;
            gap: var(--space-2);
            cursor: pointer;
            transition: transform 0.3s;
        }
        .product-card:hover {
            transform: translateY(-5px);
        }
        
        .product-image-placeholder {
            width: 100%;
            aspect-ratio: 3/4;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
            opacity: 0.8;
            border-radius: var(--radius-md);
        }
        .morokko-placeholder {
            background-color: #EAEAE4;
            color: #555;
        }
        .guster-placeholder {
            background-color: #222;
            color: #00E5FF;
            border: 1px solid rgba(0, 229, 255, 0.2);
            border-radius: var(--radius-none);
        }

        .product-card h3 {
            font-size: 1.1rem;
            font-weight: 500;
        }
        .product-card p {
            opacity: 0.7;
            font-weight: 600;
        }
        
        .dark-card h3 { color: #111; } /* Still light background for this section, so dark text */
        
        /* Brand Story Section */
        .brand-story {
            position: relative;
            background-color: #111;
            color: #FFF;
            padding: calc(var(--space-6) * 1.5) 0;
            overflow: hidden;
        }
        .brand-story .section-title {
            color: #FFF;
            font-family: 'Space Grotesk', sans-serif;
            text-transform: uppercase;
            letter-spacing: 3px;
        }
        .brand-story-bg {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(135deg, rgba(34,34,34,1) 0%, rgba(17,17,17,1) 100%);
            z-index: 1;
        }
        .brand-story-content {
            position: relative;
            z-index: 2;
            max-width: 800px;
            margin: 0 auto;
        }
        .story-text p {
            font-size: 1.2rem;
            line-height: 1.8;
            margin-bottom: var(--space-3);
            opacity: 0.9;
        }

        /* Benefits Section */
        .benefits-section {
            background-color: #FFFFFF;
            border-top: 1px solid rgba(0,0,0,0.05);
            padding: var(--space-5) 0;
        }
        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: var(--space-4);
            text-align: center;
        }
        .benefit-item {
            padding: var(--space-2);
        }
        .benefit-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.1rem;
            margin-bottom: var(--space-1);
            color: #222;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .benefit-desc {
            font-size: 0.9rem;
            color: #555;
            line-height: 1.5;
        }

        @media (max-width: 768px) {
          .home-split {
            flex-direction: column;
          }
          .split-side {
            min-height: 50%;
          }
          .morokko-side h1, .guster-side h1 {
            font-size: 2.5rem;
          }
          .section-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Home;
