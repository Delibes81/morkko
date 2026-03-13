import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, ChevronLeft, ChevronRight, ShieldCheck, Truck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { setSpecificTheme } = useTheme();

    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data, error } = await supabase
                    .from('productos')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                setProduct(data);
                
                // Force theme based on brand
                setSpecificTheme(data.marca);

                // Parse Images Array
                let parsedImages = [];
                if (data.imagen_url) {
                    try {
                        const parsed = JSON.parse(data.imagen_url);
                        parsedImages = Array.isArray(parsed) ? parsed : [data.imagen_url];
                    } catch (e) {
                         parsedImages = [data.imagen_url];
                    }
                }
                setImages(parsedImages);

            } catch (error) {
                console.error('Error fetching product details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, setSpecificTheme]);

    const handleAddToCart = () => {
        if (!product) return;
        
        const availableSizes = product.tallas ? (typeof product.tallas === 'string' ? JSON.parse(product.tallas) : product.tallas) : [];
        if (availableSizes.length > 0 && !selectedSize) {
           alert("Por favor selecciona una talla antes de agregar a la bolsa.");
           return;
        }

        // Use the first image for the cart
        const cartImg = images.length > 0 ? images[0] : null;

        for(let i=0; i<quantity; i++) {
           addToCart({
              id: product.id,
              cartItemId: product.id + '-' + (selectedSize || 'none'),
              name: product.nombre,
              price: product.precio,
              image: cartImg,
              brand: product.marca,
              size: selectedSize
           });
        }
        
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    if (loading) {
        return (
            <div className="product-detail-loading">
                <div className="loader-spinner"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-not-found">
                <h2>Producto no encontrado</h2>
                <button onClick={() => navigate('/')}>Volver al Inicio</button>
            </div>
        );
    }

    const isGuster = product.marca === 'guster';

    return (
        <motion.div 
            className={`product-detail-container ${isGuster ? 'theme-guster' : 'theme-morokko'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="product-detail-wrapper">
                
                {/* Back Button */}
                <button className="back-link" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} /> Volver
                </button>

                <div className="product-grid">
                    
                    {/* Left Column: Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image-container">
                            <AnimatePresence mode="wait">
                                {images.length > 0 ? (
                                    <motion.img 
                                        key={currentImageIndex}
                                        src={images[currentImageIndex]} 
                                        alt={`${product.nombre} - vista ${currentImageIndex + 1}`}
                                        className="main-image"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                ) : (
                                    <div className={`img-placeholder ${product.marca}`}>
                                        <span>Sin Imagen</span>
                                    </div>
                                )}
                            </AnimatePresence>

                            {/* Carousel Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button className="nav-arrow left" onClick={prevImage}>
                                        <ChevronLeft size={28} />
                                    </button>
                                    <button className="nav-arrow right" onClick={nextImage}>
                                        <ChevronRight size={28} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {images.length > 1 && (
                            <div className="thumbnail-strip">
                                {images.map((img, idx) => (
                                    <button 
                                        key={idx} 
                                        className={`thumbnail-btn ${currentImageIndex === idx ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(idx)}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="product-info-block">
                        <span className="brand-badge">{product.marca.toUpperCase()}</span>
                        <h1 className="product-title">{product.nombre}</h1>
                        <p className="product-price">${product.precio} <span className="currency">MXN</span></p>

                        <div className="product-description">
                            <p>{product.descripcion}</p>
                        </div>

                        {product.tallas && (typeof product.tallas === 'string' ? JSON.parse(product.tallas) : product.tallas).length > 0 && (
                            <div className="size-selector">
                                <h3>SELECCIONA TU TALLA</h3>
                                <div className="sizes-grid">
                                    {(typeof product.tallas === 'string' ? JSON.parse(product.tallas) : product.tallas).map(size => (
                                        <button 
                                            key={size}
                                            className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                            title={`Talla ${size}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="purchase-actions">
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)}>+</button>
                            </div>

                            <button 
                                className={`add-to-bag-btn ${isAdded ? 'added' : ''}`} 
                                onClick={handleAddToCart}
                            >
                                <ShoppingBag size={20} />
                                {isAdded ? 'Añadido' : 'Añadir a la bolsa'}
                            </button>
                        </div>
                        
                        <div className="trust-badges">
                            <div className="trust-badge">
                                <ShieldCheck size={20} />
                                <span>Compra 100% Segura</span>
                            </div>
                            <div className="trust-badge">
                                <Truck size={20} />
                                <span>Envíos a todo México</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
                .product-detail-container {
                    min-height: 100vh;
                    padding: calc(var(--header-height) + var(--space-4)) var(--space-4) var(--space-6);
                    font-family: var(--font-primary, 'Space Grotesk', sans-serif);
                    background: var(--bg-color, #111111);
                    color: var(--text-color, #ffffff);
                    transition: background-color 0.5s ease;
                }

                .theme-morokko {
                    --bg-color: #FFFFFF;
                    --text-color: #111111;
                    --accent-color: #111111;
                    --border-color: rgba(0,0,0,0.1);
                }

                .theme-guster {
                    --bg-color: #FFFFFF;
                    --text-color: #111111;
                    --accent-color: #222222;
                    --border-color: rgba(0,0,0,0.1);
                }

                .product-detail-wrapper {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .back-link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: transparent;
                    border: none;
                    color: var(--text-color);
                    font-size: 1rem;
                    cursor: pointer;
                    margin-bottom: var(--space-5);
                    opacity: 0.6;
                    transition: opacity 0.3s;
                }
                .back-link:hover {
                    opacity: 1;
                }

                .product-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-6);
                }

                /* Gallery Styles */
                .product-gallery {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-3);
                }

                .main-image-container {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 4/5;
                    border-radius: var(--radius-md);
                    overflow: hidden;
                    background: transparent;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .main-image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .img-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0.3;
                    font-size: 1.5rem;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }

                .nav-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255,255,255,0.8);
                    color: #000;
                    border: none;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    z-index: 10;
                }
                .nav-arrow:hover {
                    background: #fff;
                    transform: translateY(-50%) scale(1.1);
                }
                .nav-arrow.left { left: 16px; }
                .nav-arrow.right { right: 16px; }

                .thumbnail-strip {
                    display: flex;
                    gap: var(--space-3);
                    overflow-x: auto;
                    padding-bottom: 8px;
                }
                .thumbnail-strip::-webkit-scrollbar { height: 4px; }
                .thumbnail-strip::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px;}

                .thumbnail-btn {
                    width: 80px;
                    height: 100px;
                    flex-shrink: 0;
                    border-radius: var(--radius-sm);
                    overflow: hidden;
                    border: 2px solid transparent;
                    padding: 0;
                    cursor: pointer;
                    transition: all 0.2s;
                    opacity: 0.6;
                }
                .thumbnail-btn.active {
                    border-color: var(--accent-color);
                    opacity: 1;
                }
                .thumbnail-btn img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                /* Info Styles */
                .product-info-block {
                    display: flex;
                    flex-direction: column;
                    padding-top: var(--space-4);
                }

                .brand-badge {
                    display: inline-block;
                    align-self: flex-start;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    letter-spacing: 2px;
                    border: 1px solid var(--border-color);
                    margin-bottom: var(--space-3);
                }

                .product-title {
                    font-size: 3.5rem;
                    font-weight: 300;
                    line-height: 1.1;
                    margin-bottom: var(--space-4);
                    text-transform: uppercase;
                }

                .product-price {
                    font-family: monospace;
                    font-size: 2.5rem;
                    font-weight: 600;
                    margin-bottom: var(--space-5);
                    color: var(--accent-color);
                }
                .currency {
                    font-size: 1.2rem;
                    font-weight: 400;
                    opacity: 0.5;
                }

                .product-description {
                    font-size: 1.1rem;
                    line-height: 1.6;
                    opacity: 0.8;
                    margin-bottom: var(--space-6);
                    padding-bottom: var(--space-5);
                    border-bottom: 1px solid var(--border-color);
                }

                .size-selector {
                    margin-bottom: var(--space-4);
                }

                .size-selector h3 {
                    font-size: 0.95rem;
                    font-weight: 600;
                    margin-bottom: var(--space-3);
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                }

                .sizes-grid {
                    display: flex;
                    gap: var(--space-2);
                    flex-wrap: wrap;
                }

                .size-btn {
                    width: 50px;
                    height: 50px;
                    border-radius: 4px; /* Square shape */
                    border: 1px solid var(--border-color);
                    background: transparent;
                    color: var(--text-color);
                    font-size: 1.1rem;
                    font-weight: 400; /* Lighter font weight to match screenshot */
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .size-btn:hover {
                    border-color: var(--text-color);
                }

                .size-btn.active {
                    background: var(--text-color);
                    color: var(--bg-color);
                    border-color: var(--text-color);
                }

                .purchase-actions {
                    display: flex;
                    gap: var(--space-3);
                    margin-bottom: var(--space-6);
                    align-items: center; /* Ensure horizontal alignment */
                }

                .quantity-selector {
                    display: flex;
                    align-items: center;
                    border: 1px solid var(--border-color);
                    border-radius: 50px;
                    padding: 0 16px;
                    height: 60px;
                }
                .quantity-selector button {
                    background: transparent;
                    border: none;
                    color: var(--text-color);
                    font-size: 1.5rem;
                    cursor: pointer;
                    width: 30px;
                }
                .quantity-selector span {
                    font-family: monospace;
                    font-size: 1.2rem;
                    width: 40px;
                    text-align: center;
                }

                .add-to-bag-btn {
                    flex: 1; /* Take up remaining space */
                    height: 60px;
                    border-radius: 50px;
                    border: none;
                    background: var(--accent-color);
                    color: var(--bg-color); /* Contrast color */
                    font-size: 1.1rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-2);
                    transition: all 0.3s;
                }

                .theme-morokko .add-to-bag-btn { color: #FFFFFF; }
                .theme-guster .add-to-bag-btn { color: #FFFFFF; background: #222222; }

                .add-to-bag-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                
                .theme-guster .add-to-bag-btn:hover {
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
                    background: #000000;
                }

                .add-to-bag-btn.added {
                    background: #2ed573;
                    color: #111;
                }

                .trust-badges {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-3);
                }

                .trust-badge {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    opacity: 0.6;
                    font-size: 0.95rem;
                }

                /* Loading State */
                .product-detail-loading {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #FFFFFF;
                }
                .loader-spinner {
                    width: 50px;
                    height: 50px;
                    border: 3px solid rgba(0,0,0,0.1);
                    border-top-color: #222222;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .product-not-found {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #FFFFFF;
                    color: #111111;
                    gap: var(--space-4);
                }

                @media (max-width: 900px) {
                    .product-grid {
                        grid-template-columns: 1fr;
                    }
                    .product-title {
                        font-size: 2.5rem;
                    }
                    .product-price {
                        font-size: 2rem;
                    }
                }

                @media (max-width: 480px) {
                    .purchase-actions {
                        flex-direction: column;
                    }
                    .quantity-selector {
                        justify-content: center;
                    }
                }
            `}</style>
        </motion.div>
    );
};

export default ProductDetail;
