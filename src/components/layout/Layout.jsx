import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from './CartSidebar';

const Layout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1, paddingTop: 'var(--header-height)' }}>
                <Outlet />
            </main>
            <Footer />
            <CartSidebar />
        </div>
    );
};

export default Layout;
