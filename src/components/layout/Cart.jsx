import React from 'react';
import { useCart } from '../../context/CartContext';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const {
        isCartOpen,
        closeCart,
        cartItems,
        removeFromCart,
        totalPrice,
        hasMorokko,
        hasGuster
    } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="cart-overlay"
                        onClick={closeCart}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="cart-sidebar"
                    >
                        <div className="cart-header">
                            <h3>Tu Carrito</h3>
                            <button onClick={closeCart} className="close-btn"><X /></button>
                        </div>

                        <div className="cart-items">
                            {cartItems.length === 0 ? (
                                <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', opacity: 0.6 }}>El carrito está vacío.</p>
                            ) : (
                                cartItems.map(item => (
                                    <div key={item.id} className={`cart-item theme-${item.brand.toLowerCase()}`}>
                                        <div className="item-image-placeholder">IMG</div>
                                        <div className="item-details">
                                            <h4>{item.name}</h4>
                                            <p className="item-brand">{item.brand}</p>
                                            <p className="item-price">${item.price}</p>
                                            <button onClick={() => removeFromCart(item.id)} className="remove-btn">Quitar</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <div className="cart-footer">
                                <div className="cart-total">
                                    <span>Total</span>
                                    <span>${totalPrice}</span>
                                </div>

                                {/* Cross-pollination Logic */}
                                {hasMorokko && !hasGuster && (
                                    <div className="cross-sell dark-cross">
                                        <p>Añade contraste a tu estilo</p>
                                        <button>Explorar Guster</button>
                                    </div>
                                )}
                                {hasGuster && !hasMorokko && (
                                    <div className="cross-sell light-cross">
                                        <p>Eleva tu outfit de día</p>
                                        <button>Explorar Morokko</button>
                                    </div>
                                )}

                                <button className="checkout-btn">Ir al Checkout</button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}

            <style>{`
        .cart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 200;
        }
        .cart-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 400px;
          background: #F3F4F6; /* Neutral Ground */
          color: #222222;
          z-index: 201;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
        }
        .cart-header {
          padding: var(--space-3) var(--space-4);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        .close-btn {
          color: inherit;
        }
        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .cart-item {
          display: flex;
          gap: var(--space-3);
          padding: var(--space-2);
          border-radius: var(--radius-sm);
        }
        /* Product Cards according to their brand */
        .cart-item.theme-morokko {
          background: #FFFFFF;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .cart-item.theme-guster {
          background: #111111;
          color: #FFFFFF;
          border-left: 2px solid #00E5FF;
        }
        
        .item-image-placeholder {
          width: 80px;
          height: 100px;
          background: rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: rgba(0,0,0,0.3);
        }
        .theme-guster .item-image-placeholder {
          background: #222;
          color: rgba(255,255,255,0.3);
        }
        .item-details h4 {
          font-size: 1rem;
          margin-bottom: 4px;
        }
        .theme-guster .item-details h4 {
          font-family: 'Space Grotesk', sans-serif;
        }
        .theme-morokko .item-details h4 {
          font-family: 'Playfair Display', serif;
        }
        .item-brand {
          font-size: 0.8rem;
          opacity: 0.6;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .item-price {
          font-weight: 600;
        }
        .remove-btn {
          font-size: 0.8rem;
          text-decoration: underline;
          margin-top: 8px;
          opacity: 0.7;
        }
        
        .cart-footer {
          padding: var(--space-4);
          background: #FFFFFF;
          border-top: 1px solid rgba(0,0,0,0.1);
        }
        .cart-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: var(--space-4);
        }
        .checkout-btn {
          width: 100%;
          padding: var(--space-3);
          background: #222222;
          color: #FFFFFF;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .cross-sell {
          padding: var(--space-3);
          text-align: center;
          margin-bottom: var(--space-3);
          border-radius: var(--radius-sm);
        }
        .dark-cross {
          background: #111111;
          color: #FFFFFF;
        }
        .dark-cross button {
          color: #00E5FF;
          margin-top: 8px;
          font-weight: 600;
        }
        .light-cross {
          background: #F9F9F6;
          color: #222222;
          border: 1px solid #E5E7EB;
        }
        .light-cross button {
          color: #A3B19B;
          margin-top: 8px;
          font-weight: 600;
        }
      `}</style>
        </AnimatePresence>
    );
};

export default Cart;
