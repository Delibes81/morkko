import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Initialize cart from localStorage if available
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem('morkko_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart from localStorage', error);
            return [];
        }
    });
    
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Sync cart changes to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('morkko_cart', JSON.stringify(cartItems));
        } catch (error) {
            console.error('Error saving cart to localStorage', error);
        }
    }, [cartItems]);

    const addToCart = (product) => {
        // product will now need to have a product.cartItemId passed in (e.g. '123-M' or '123-null' if no sizes)
        setCartItems(prev => {
            const existing = prev.find(item => item.cartItemId === product.cartItemId);
            if (existing) {
                return prev.map(item =>
                    item.cartItemId === product.cartItemId ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (cartItemId) => {
        setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
    };

    const updateQuantity = (cartItemId, newQuantity) => {
        if (newQuantity < 1) return removeFromCart(cartItemId);
        setCartItems(prev =>
            prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item)
        );
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);
    const clearCart = () => setCartItems([]);

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Cross-pollination logic:
    const hasMorokko = cartItems.some(item => item.brand === 'Morokko');
    const hasGuster = cartItems.some(item => item.brand === 'Guster');

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            isCartOpen,
            toggleCart,
            openCart,
            closeCart,
            clearCart,
            totalItems,
            totalPrice,
            hasMorokko,
            hasGuster
        }}>
            {children}
        </CartContext.Provider>
    );
};
