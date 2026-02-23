import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const GUSTER_PRODUCTS = [
    { id: 'g1', name: 'Catrina Neón', brand: 'Guster', price: 65, form: 'Oversize Fit' },
    { id: 'g2', name: 'Calavera Urbana', brand: 'Guster', price: 60, form: 'Boxy Fit' },
    { id: 'g3', name: 'Santa Muerte Acid', brand: 'Guster', price: 70, form: 'Oversize Fit' },
    { id: 'g4', name: 'Esqueleto Minimal', brand: 'Guster', price: 55, form: 'Regular Fit' },
];

// Variante de la página: The Ink Eclipse (Círculo negro expansivo + Reveal cascada y zoom down)
const eclipseVariants = {
    initial: {
        clipPath: 'circle(0% at 50% 50%)',
        backgroundColor: '#000000',
    },
    animate: {
        clipPath: 'circle(150% at 50% 50%)',
        transition: {
            duration: 1.2,
            ease: [0.85, 0, 0.15, 1],
            when: 'beforeChildren',
            staggerChildren: 0.1,
        }
    },
    exit: {
        opacity: 0,
        y: 20,
        filter: 'blur(8px)',
        transition: { duration: 0.6, ease: [0.85, 0, 0.15, 1] }
    }
};

// Aparecen desde abajo con peso grave
const itemVariants = {
    initial: { opacity: 0, y: 50, scale: 1.05 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.8, ease: [0.85, 0, 0.15, 1] }
    }
};

const Guster = () => {
    const { addToCart } = useCart();
    const { setSpecificTheme } = useTheme();

    useEffect(() => {
        setSpecificTheme('dark');
    }, [setSpecificTheme]);

    return (
        <motion.div
            className="page-container guster-page"
            variants={eclipseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
                <motion.div variants={itemVariants} className="page-header guster-header">
                    <h1 className="guster-title">Territorio Guster</h1>
                    <p className="guster-subtitle">Cultura urbana, actitud implacable, oscuridad absoluta.</p>
                </motion.div>

                <motion.div className="product-grid" variants={itemVariants}>
                    {GUSTER_PRODUCTS.map(product => (
                        <motion.div key={product.id} className="product-card guster-card" variants={itemVariants}>
                            <div className="card-image-wrapper guster-image-wrapper">
                                <div className="image-placeholder bg-dark">
                                    <span className="text-neon">Dark Contrast</span>
                                </div>
                            </div>
                            <div className="card-info guster-info">
                                <div>
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-form">{product.form}</p>
                                </div>
                                <span className="product-price text-neon">${product.price}</span>
                            </div>
                            <button
                                className="add-to-cart-btn btn-guster-add"
                                onClick={() => addToCart(product)}
                            >
                                Sumar a mi estilo
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <style>{`
        .guster-page {
          background-color: var(--bg-primary);
          color: var(--text-primary);
          min-height: calc(100vh - var(--header-height));
        }
        .guster-header {
          text-align: center;
          margin-bottom: var(--space-8);
          max-width: 600px;
          margin-inline: auto;
        }
        .guster-title {
          font-size: 3rem;
          margin-bottom: var(--space-2);
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--accent-color);
        }
        .guster-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
        }
        .guster-card {
          border-radius: var(--item-radius);
          background-color: var(--bg-secondary);
          padding: var(--space-2);
          border: 1px solid var(--border-color);
          transition: border-color 0.3s;
        }
        .guster-card:hover {
          border-color: var(--accent-color);
        }
        .guster-image-wrapper {
          border-radius: var(--item-radius);
        }
        .bg-dark { background-color: #1A1A1A; }
        .text-neon { color: var(--accent-color); font-weight: 600; }
        
        .guster-info {
          padding: var(--space-2) 0;
        }
        .product-form {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }
        
        .btn-guster-add {
          background-color: transparent;
          border: 2px solid var(--border-color);
          color: var(--text-primary);
          border-radius: var(--btn-radius);
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }
        .btn-guster-add:hover {
          border-color: var(--accent-color);
          background-color: rgba(0, 229, 255, 0.1);
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.2);
        }
      `}</style>
        </motion.div>
    );
};

export default Guster;
