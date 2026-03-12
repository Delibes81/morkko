import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

// Variante de la página: The Ink Eclipse (Círculo negro expansivo + Reveal cascada y zoom down)
const eclipseVariants = {
    initial: {
        clipPath: 'circle(0% at 50% 50%)',
        backgroundColor: '#000000',
    },
    animate: {
        clipPath: 'circle(150% at 50% 50%)',
        backgroundColor: '#FFFFFF', // animates to white
        transition: {
            duration: 0.6, // Sped up the main circle reveal
            ease: [0.85, 0, 0.15, 1],
            when: 'beforeChildren',
            staggerChildren: 0.05, // Sped up the staggering of children
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
        transition: { duration: 0.4, ease: [0.85, 0, 0.15, 1] } // Sped up individual item load
    }
};

const Guster = () => {
    const { addToCart } = useCart();
    const { setSpecificTheme } = useTheme();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setSpecificTheme('light');
        
        const fetchProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('productos')
                    .select('*')
                    .eq('marca', 'guster')
                    .order('created_at', { ascending: false });
                    
                if (error) throw error;
                setProducts(data || []);
            } catch (error) {
                console.error('Error fetching Guster products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
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
                    <img src="/guster_logo.png" alt="Guster" className="guster-page-logo" />
                    <p className="guster-subtitle">Cultura urbana, actitud implacable, oscuridad absoluta.</p>
                </motion.div>

                <motion.div className="product-grid" variants={itemVariants}>
                    {loading ? (
                        <p style={{ textAlign: 'center', gridColumn: '1 / -1', opacity: 0.5, padding: 'var(--space-6)' }}>Entrando al territorio...</p>
                    ) : products.length === 0 ? (
                        <p style={{ textAlign: 'center', gridColumn: '1 / -1', opacity: 0.5, padding: 'var(--space-6)' }}>El territorio Guster aún no tiene diseños disponibles.</p>
                    ) : (
                        products.map((product) => {
                            let coverImg = product.imagen_url;
                            try {
                              const parsed = JSON.parse(product.imagen_url);
                              if (Array.isArray(parsed) && parsed.length > 0) coverImg = parsed[0];
                            } catch (e) {}

                            return (
                            <motion.div 
                                key={product.id} 
                                className="product-card guster-card" 
                                variants={itemVariants}
                                onClick={() => navigate(`/producto/${product.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="card-image-wrapper guster-image-wrapper">
                                    {coverImg ? (
                                        <img src={coverImg} alt={product.nombre} className="product-real-img" />
                                    ) : (
                                        <div className="image-placeholder bg-dark">
                                            <span className="text-neon">Dark Contrast</span>
                                        </div>
                                    )}
                                </div>
                                <div className="card-info guster-info">
                                    <div>
                                        <h3 className="product-name">{product.nombre}</h3>
                                        <p className="product-form">{product.descripcion?.substring(0, 30)}</p>
                                    </div>
                                    <span className="product-price text-neon">${product.precio}</span>
                                </div>
                                <button
                                    className="add-to-cart-btn btn-guster-add"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevenir navegacion a detail
                                        addToCart({
                                            id: product.id,
                                            name: product.nombre,
                                            price: product.precio,
                                            image: coverImg,
                                            brand: product.marca
                                        });
                                    }}
                                >
                                    Agregar a carrito
                                </button>
                            </motion.div>
                        )})
                    )}
                </motion.div>
            </div>

            <style>{`
        .guster-page {
          background-color: transparent; /* Animation handles the background initially */
          color: var(--text-primary);
          min-height: calc(100vh - var(--header-height));
        }
        .guster-header {
          text-align: center;
          margin-bottom: var(--space-8);
          max-width: 600px;
          margin-inline: auto;
        }
        .guster-page-logo {
          height: 10rem;
          width: auto;
          object-fit: contain;
          margin-bottom: var(--space-2);
          display: block;
          margin-inline: auto;
        }
        .guster-subtitle {
          font-size: 1.1rem;
          color: #555555;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--space-4);
        }

        @media (max-width: 600px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-2);
          }
          .product-name {
            font-size: 0.95rem;
          }
          .product-price {
            font-size: 0.95rem;
          }
          .btn-guster-add {
            font-size: 0.7rem;
            padding: var(--space-1);
          }
        }

        .guster-card {
          border-radius: var(--item-radius);
          background-color: transparent;
          padding: var(--space-2);
          border: none;
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .guster-card:hover {
          transform: translateY(-5px);
        }
        .guster-image-wrapper {
          position: relative;
          width: 100%;
          border-radius: var(--item-radius);
          aspect-ratio: 3/4;
          overflow: hidden;
          background-color: transparent; /* Changed from #F0F0F0 to avoid stripes */
        }
        
        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.5s ease;
        }
        
        .product-real-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover; /* Changed from contain to cover to eliminate empty space */
          transition: transform 0.5s ease;
          /* Removed grayscale to look better on light bg */
        }
        
        .guster-card:hover .image-placeholder,
        .guster-card:hover .product-real-img {
          transform: scale(1.05);
        }
        
        .bg-dark { background-color: #f5f5f5; }
        .text-neon { color: #222; font-weight: 600; }
        
        .guster-info {
          padding: var(--space-2) 0;
        }
        .product-form {
          font-size: 0.85rem;
          color: #777777;
          margin-top: 4px;
        }
        
        .btn-guster-add {
          background-color: transparent;
          border: 1px solid #EEEEEE;
          color: #222222;
          border-radius: var(--btn-radius);
          text-transform: uppercase;
          font-size: 0.95rem; /* Increased font size */
          letter-spacing: 1px;
          margin-top: var(--space-3); /* Added more margin */
          padding: var(--space-2) var(--space-3); /* Increased padding for a bigger button */
          cursor: pointer;
        }
        .btn-guster-add:hover {
          border-color: #222222;
          background-color: #F5F5F5;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        }
      `}</style>
        </motion.div>
    );
};

export default Guster;
