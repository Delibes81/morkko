import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

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
                    .eq('marca', 'morokko')
                    .order('created_at', { ascending: false });
                    
                if (error) throw error;
                setProducts(data || []);
            } catch (error) {
                console.error('Error fetching Morokko products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
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
                    {loading ? (
                        <p style={{ textAlign: 'center', gridColumn: '1 / -1', opacity: 0.5, padding: 'var(--space-6)' }}>Cargando colección...</p>
                    ) : products.length === 0 ? (
                        <p style={{ textAlign: 'center', gridColumn: '1 / -1', opacity: 0.5, padding: 'var(--space-6)' }}>Aún no hay prendas en la colección.</p>
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
                                className="product-card morokko-card" 
                                variants={itemVariants}
                                onClick={() => navigate(`/producto/${product.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="card-image-wrapper">
                                    {coverImg ? (
                                        <img src={coverImg} alt={product.nombre} className="product-real-img" />
                                    ) : (
                                        <div className="image-placeholder bg-light">
                                            <span className="text-light">Luz Natural</span>
                                        </div>
                                    )}
                                </div>
                                <div className="card-info">
                                    <div>
                                        <h3 className="product-name">{product.nombre}</h3>
                                        <p className="product-color">{product.descripcion?.substring(0, 30)}</p>
                                    </div>
                                    <span className="product-price">${product.precio}</span>
                                </div>
                                <button
                                    className="add-to-cart-btn btn-morokko-add"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevenir navegacion
                                      addToCart({
                                        id: product.id,
                                        name: product.nombre,
                                        price: product.precio,
                                        image: coverImg,
                                        brand: product.marca
                                      });
                                    }}
                                >
                                    Añadir al carrito
                                </button>
                            </motion.div>
                        )})
                    )}
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
          position: relative;
          width: 100%;
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
        .bg-light { background-color: #FFFFFF; border: 1px solid rgba(0,0,0,0.05); }
        .text-light { color: #A3B19B; font-weight: 500; letter-spacing: 1px; }
        
        .product-real-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.5s ease;
        }
        
        .product-card:hover .image-placeholder,
        .product-card:hover .product-real-img {
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
