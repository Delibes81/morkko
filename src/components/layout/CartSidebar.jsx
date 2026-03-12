import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartSidebar = () => {
    const { 
        cartItems, 
        isCartOpen, 
        closeCart, 
        removeFromCart, 
        updateQuantity, 
        totalPrice 
    } = useCart();
    const navigate = useNavigate();

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        className="cart-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                    />

                    {/* Sidebar container */}
                    <motion.div 
                        className="cart-sidebar"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                    >
                        {/* Header */}
                        <div className="cart-header">
                            <h2>Tu Bolsa <ShoppingBag size={20} /></h2>
                            <button className="cart-close-btn" onClick={closeCart}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="cart-content">
                            {cartItems.length === 0 ? (
                                <div className="cart-empty-state">
                                    <ShoppingBag size={48} className="empty-icon" />
                                    <p>Tu bolsa está vacía.</p>
                                    <button className="continue-shopping-btn" onClick={closeCart}>
                                        Continuar Explorando
                                    </button>
                                </div>
                            ) : (
                                <div className="cart-items-list">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="cart-item">
                                            
                                            <div className="cart-item-image">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} />
                                                ) : (
                                                    <div className={`img-placeholder ${item.brand.toLowerCase()}`}></div>
                                                )}
                                            </div>
                                            
                                            <div className="cart-item-details">
                                                <div className="cart-item-header">
                                                    <h3>{item.name}</h3>
                                                    <button 
                                                        className="remove-item-btn" 
                                                        onClick={() => removeFromCart(item.id)}
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                
                                                <div className="cart-item-footer">
                                                    <div className="quantity-controls">
                                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                            <Minus size={14} />
                                                        </button>
                                                        <span>{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer / Checkout section */}
                        {cartItems.length > 0 && (
                            <div className="cart-footer">
                                <div className="cart-total">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)} MXN</span>
                                </div>
                                <button className="checkout-btn" onClick={() => {
                                    closeCart();
                                    navigate('/checkout');
                                }}>
                                    Pagar Ahora <ArrowRight size={18} />
                                </button>
                            </div>
                        )}
                        
                    </motion.div>

                    <style>{`
                        .cart-backdrop {
                            position: fixed;
                            inset: 0;
                            background: rgba(0, 0, 0, 0.6);
                            backdrop-filter: blur(4px);
                            z-index: 1000;
                        }

                        .cart-sidebar {
                            position: fixed;
                            top: 0;
                            right: 0;
                            bottom: 0;
                            width: 100%;
                            max-width: 450px;
                            background: #111111;
                            border-left: 1px solid rgba(255,255,255,0.1);
                            z-index: 1001;
                            display: flex;
                            flex-direction: column;
                            box-shadow: -10px 0 30px rgba(0,0,0,0.5);
                            font-family: var(--font-primary, 'Space Grotesk', sans-serif);
                            color: #fff;
                        }

                        .cart-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: var(--space-4);
                            border-bottom: 1px solid rgba(255,255,255,0.1);
                        }

                        .cart-header h2 {
                            display: flex;
                            align-items: center;
                            gap: var(--space-2);
                            font-size: 1.5rem;
                            font-weight: 300;
                            letter-spacing: 1px;
                            text-transform: uppercase;
                        }

                        .cart-close-btn {
                            background: transparent;
                            border: none;
                            color: rgba(255,255,255,0.5);
                            cursor: pointer;
                            transition: color 0.3s;
                            padding: var(--space-2);
                        }

                        .cart-close-btn:hover {
                            color: #00E5FF;
                        }

                        .cart-content {
                            flex: 1;
                            overflow-y: auto;
                            padding: var(--space-4);
                        }

                        /* Custom Scrollbar for Content */
                        .cart-content::-webkit-scrollbar {
                            width: 6px;
                        }
                        .cart-content::-webkit-scrollbar-thumb {
                            background: rgba(255, 255, 255, 0.2);
                            border-radius: 3px;
                        }

                        .cart-empty-state {
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            color: rgba(255,255,255,0.4);
                            text-align: center;
                        }

                        .empty-icon {
                            margin-bottom: var(--space-3);
                            opacity: 0.5;
                        }

                        .continue-shopping-btn {
                            margin-top: var(--space-4);
                            background: transparent;
                            border: 1px solid rgba(255,255,255,0.3);
                            color: #fff;
                            padding: var(--space-2) var(--space-4);
                            border-radius: var(--radius-sm);
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            font-size: 0.85rem;
                            cursor: pointer;
                            transition: all 0.3s;
                        }

                        .continue-shopping-btn:hover {
                            background: rgba(255,255,255,0.1);
                            border-color: #fff;
                        }

                        /* Items List */
                        .cart-items-list {
                            display: flex;
                            flex-direction: column;
                            gap: var(--space-4);
                        }

                        .cart-item {
                            display: flex;
                            gap: var(--space-3);
                            padding-bottom: var(--space-4);
                            border-bottom: 1px dashed rgba(255,255,255,0.1);
                        }

                        .cart-item-image {
                            width: 80px;
                            height: 100px;
                            border-radius: var(--radius-sm);
                            overflow: hidden;
                            background: #222;
                            flex-shrink: 0;
                        }

                        .cart-item-image img {
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                        }

                        .img-placeholder {
                            width: 100%;
                            height: 100%;
                        }
                        .img-placeholder.morokko { background: #FFFFFF; border: 1px solid rgba(0,0,0,0.1); }
                        .img-placeholder.guster { background: #333; }

                        .cart-item-details {
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                        }

                        .cart-item-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                        }

                        .cart-item-header h3 {
                            font-size: 1rem;
                            font-weight: 500;
                            line-height: 1.3;
                            padding-right: var(--space-2);
                        }

                        .remove-item-btn {
                            background: transparent;
                            border: none;
                            color: rgba(255,255,255,0.3);
                            cursor: pointer;
                            transition: color 0.3s;
                            padding: 4px;
                        }

                        .remove-item-btn:hover {
                            color: #ff4757;
                        }

                        .cart-item-footer {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-top: var(--space-2);
                        }

                        .quantity-controls {
                            display: flex;
                            align-items: center;
                            gap: var(--space-2);
                            background: rgba(255,255,255,0.05);
                            border-radius: var(--radius-sm);
                            padding: 4px;
                            border: 1px solid rgba(255,255,255,0.1);
                        }

                        .quantity-controls button {
                            background: transparent;
                            border: none;
                            color: #fff;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 24px;
                            height: 24px;
                            border-radius: 4px;
                            transition: background 0.2s;
                        }

                        .quantity-controls button:hover {
                            background: rgba(255,255,255,0.1);
                        }

                        .quantity-controls span {
                            font-family: monospace;
                            width: 20px;
                            text-align: center;
                            font-size: 0.9rem;
                        }

                        .cart-item-price {
                            font-family: monospace;
                            font-size: 1.1rem;
                            color: #00E5FF;
                        }

                        /* Footer */
                        .cart-footer {
                            padding: var(--space-4);
                            border-top: 1px solid rgba(255,255,255,0.1);
                            background: rgba(0,0,0,0.3);
                        }

                        .cart-total {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: var(--space-4);
                            font-size: 1.2rem;
                            font-weight: 500;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                        }

                        .cart-total span:last-child {
                            font-family: monospace;
                            color: #00E5FF;
                            font-size: 1.4rem;
                        }

                        .checkout-btn {
                            width: 100%;
                            background: #fff;
                            color: #000;
                            border: none;
                            padding: var(--space-3);
                            font-size: 1.1rem;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: var(--space-2);
                            border-radius: var(--radius-sm);
                            transition: all 0.3s;
                        }

                        .checkout-btn:hover {
                            background: #00E5FF;
                            box-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
                        }

                        @media (max-width: 480px) {
                            .cart-sidebar {
                                max-width: 100%;
                            }
                        }
                    `}</style>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
