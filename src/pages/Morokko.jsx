import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const MOROKKO_PRODUCTS = [
    { id: 'm1', name: 'Camisa Lino Amalfi', brand: 'Morokko', price: 125, color: 'Blanco' },
    { id: 'm2', name: 'Oversize Algodón', brand: 'Morokko', price: 95, color: 'Beige' },
    { id: 'm3', name: 'Oxford Clásica', brand: 'Morokko', price: 110, color: 'Celeste' },
    { id: 'm4', name: 'Polo Knit Verano', brand: 'Morokko', price: 85, color: 'Arena' },
];

// Variante de la página: The Canvas Dawn (Barrido desde abajo + subida escalada)
const dawnVariants = {
    initial: {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        scale: 0.95,
        filter: 'blur(10px)',
    },
    animate: {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            duration: 1.2,
            ease: [0.85, 0, 0.15, 1],
            when: 'beforeChildren',
            staggerChildren: 0.1,
        }
    },
    exit: {
        scale: 0.95,
        opacity: 0,
        filter: 'blur(5px)',
        transition: { duration: 0.6, ease: [0.85, 0, 0.15, 1] }
    }
};

const itemVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.85, 0, 0.15, 1] }
    }
};

const Morokko = () => {
    const { addToCart } = useCart();
    const { setSpecificTheme } = useTheme();

    useEffect(() => {
        setSpecificTheme('light');
    }, [setSpecificTheme]);

    return (
        <motion.div
            className="page-container morokko-page"
            variants={dawnVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
                <motion.div variants={itemVariants} className="page-header">
                    <h1 className="morokko-title">Colección Morokko</h1>
                    <p className="morokko-subtitle">La pureza del lino y algodón natural para tus días de sol.</p>
                </motion.div>

                <motion.div className="product-grid" variants={itemVariants}>
                    {MOROKKO_PRODUCTS.map(product => (
                        <motion.div key={product.id} className="product-card morokko-card" variants={itemVariants}>
                            <div className="card-image-wrapper">
                                {/* Placeholders for actual high-end photography */}
                                <div className="image-placeholder bg-light">
                                    <span className="text-light">Luz Natural</span>
                                </div>
                            </div>
                            <div className="card-info">
                                <div>
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-color">{product.color}</p>
                                </div>
                                <span className="product-price">${product.price}</span>
                            </div>
                            <button
                                className="add-to-cart-btn btn-morokko-add"
                                onClick={() => addToCart(product)}
                            >
                                Añadir al carrito
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <style>{`
        .morokko-page {
          background-color: var(--bg-primary);
          color: var(--text-primary);
          min-height: calc(100vh - var(--header-height));
        }
        .page-header {
          text-align: center;
          margin-bottom: var(--space-8);
          max-width: 600px;
          margin-inline: auto;
        }
        .morokko-title {
          font-size: 3rem;
          margin-bottom: var(--space-2);
        }
        .morokko-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--space-4);
        }
        .product-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .morokko-card {
          border-radius: var(--item-radius);
        }
        .card-image-wrapper {
          aspect-ratio: 3/4;
          border-radius: var(--item-radius);
          overflow: hidden;
          background-color: var(--bg-secondary);
        }
        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.5s ease;
        }
        .bg-light { background-color: #EFEFE9; }
        .text-light { color: #A3B19B; font-weight: 500; letter-spacing: 1px; }
        
        .product-card:hover .image-placeholder {
          transform: scale(1.05);
        }
        .card-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-top: var(--space-2);
        }
        .product-name {
          font-size: 1.1rem;
          font-family: var(--font-heading);
        }
        .product-color {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }
        .product-price {
          font-weight: 600;
          font-size: 1.1rem;
        }
        .add-to-cart-btn {
          width: 100%;
          padding: var(--space-2);
          margin-top: var(--space-2);
          font-weight: 600;
          transition: all 0.3s;
        }
        .btn-morokko-add {
          background-color: transparent;
          border: 1px solid var(--text-primary);
          color: var(--text-primary);
          border-radius: var(--btn-radius);
        }
        .btn-morokko-add:hover {
          background-color: var(--text-primary);
          color: var(--bg-primary);
        }
      `}</style>
        </motion.div>
    );
};

export default Morokko;
