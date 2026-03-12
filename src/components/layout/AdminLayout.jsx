import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, LogOut, Settings, LayoutDashboard, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const AdminLayout = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/admin/login');
    };

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Admin Panel</h2>
                </div>
                
                <nav className="sidebar-nav">
                    <NavLink to="/admin/productos" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Package size={20} />
                        <span>Productos</span>
                    </NavLink>
                    <NavLink to="/admin/pedidos" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <ShoppingBag size={20} />
                        <span>Pedidos</span>
                    </NavLink>
                    {/* Link to main website */}
                    <NavLink to="/" target="_blank" className="nav-item">
                        <Globe size={20} />
                        <span>Ver Tienda</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Contenido Principal */}
            <main className="admin-main-content">
                <Outlet />
            </main>

            <style>{`
                .admin-dashboard {
                    display: flex;
                    min-height: 100vh;
                    background-color: #F3F4F6;
                    font-family: var(--font-body, 'Space Grotesk', sans-serif);
                }

                .admin-sidebar {
                    width: 260px;
                    background-color: #111827;
                    color: #FFFFFF;
                    display: flex;
                    flex-direction: column;
                    position: sticky;
                    top: 0;
                    height: 100vh;
                    box-shadow: 4px 0 10px rgba(0,0,0,0.1);
                    z-index: 1000;
                }

                .sidebar-header {
                    padding: 32px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .sidebar-header h2 {
                    font-family: var(--font-heading);
                    font-size: 1.5rem;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                    margin: 0;
                    line-height: 1;
                }

                .sidebar-nav {
                    flex: 1;
                    padding: var(--space-4) 0;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 32px;
                    text-decoration: none;
                    color: #9CA3AF;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    border-left: 3px solid transparent;
                    line-height: 1;
                }

                .nav-item:hover:not(.disabled) {
                    background-color: rgba(255,255,255,0.05);
                    color: #F3F4F6;
                }

                .nav-item.active {
                    background-color: rgba(255,255,255,0.1);
                    color: #FFFFFF;
                    border-left-color: var(--color-guster, #00E5FF); /* Accent color */
                    font-weight: 600;
                }

                .nav-item.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .sidebar-footer {
                    padding: 32px;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }

                .logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    padding: 12px;
                    background: transparent;
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #FCA5A5;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                }

                .logout-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                    color: #FECACA;
                }

                .admin-main-content {
                    flex: 1;
                    padding: var(--space-6);
                    overflow-y: auto;
                    /* Ensure content starts cleanly without layout shifts from headers */
                }

                @media (max-width: 768px) {
                    .admin-dashboard {
                        flex-direction: column;
                    }
                    .admin-sidebar {
                        width: 100%;
                        height: auto;
                        position: relative;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 var(--space-4);
                    }
                    .sidebar-header {
                        border-bottom: none;
                        padding: var(--space-3) 0;
                    }
                    .sidebar-nav {
                        flex-direction: row;
                        padding: 0;
                    }
                    .nav-item {
                        padding: var(--space-3);
                        border-left: none;
                        border-bottom: 3px solid transparent;
                    }
                    .nav-item.active {
                        border-bottom-color: var(--color-guster, #00E5FF);
                        border-left-color: transparent;
                    }
                    .sidebar-footer {
                        border-top: none;
                        padding: 0;
                    }
                    .logout-btn {
                        padding: 8px;
                        border: none;
                    }
                    .logout-btn span {
                        display: none; /* Icon only on mobile header */
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;
