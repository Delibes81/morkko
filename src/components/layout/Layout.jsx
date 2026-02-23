import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Cart from './Cart';

const Layout = () => {
    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', paddingTop: 'var(--header-height)' }}>
                <Outlet />
            </main>
            <Cart />
        </>
    );
};

export default Layout;
