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
            className="home-split"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
        >
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

            <style>{`
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
        }
      `}</style>
        </motion.div>
    );
};

export default Home;
