import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const footerStyle = {
        backgroundColor: isDark ? '#050505' : '#F9F9F6',
        color: isDark ? '#FFFFFF' : '#222222',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        transition: 'background-color 0.8s, color 0.8s, border-color 0.8s'
    };

    return (
        <footer style={footerStyle} className="footer-global">
            <div className="container footer-content">
                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="brand-logos">
                            <span className="brand-primary">Morokko</span>
                            <span className="brand-divider">/</span>
                            <span className="brand-secondary">Guster</span>
                        </div>
                        <p className="brand-desc">
                            Dos marcas, una sola actitud. Explora nuestras colecciones lifestyle y streetwear.
                        </p>
                    </div>


                </div>

                <div className="footer-links-grid">
                    <div className="footer-column">
                        <h4>Tienda</h4>
                        <ul>
                            <li><Link to="/morokko">Morokko</Link></li>
                            <li><Link to="/guster">Guster</Link></li>
                            <li><Link to="/">Novedades</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Soporte</h4>
                        <ul>
                            <li><Link to="/">Preguntas Frecuentes</Link></li>
                            <li><Link to="/">Envíos y Entregas</Link></li>
                            <li><Link to="/">Cambios y Devoluciones</Link></li>
                            <li><Link to="/">Contacto</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Legal</h4>
                        <ul>
                            <li><Link to="/">Términos de Servicio</Link></li>
                            <li><Link to="/">Política de Privacidad</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column social-column">
                        <h4>Síguenos</h4>
                        <div className="social-icons">
                            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
                            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Morokko & Guster. Todos los derechos reservados.</p>
                    <div className="payment-icons">
                        {/* Placeholder para íconos de pago */}
                        <span>Visa</span>
                        <span>Mastercard</span>
                        <span>PayPal</span>
                    </div>
                </div>
            </div>

            <style>{`
                .footer-global {
                    padding: var(--space-4) 0 0 0;
                    margin-top: auto;
                }
                .footer-content {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                }
                .footer-top {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: var(--space-4);
                    padding-bottom: var(--space-4);
                    border-bottom: 1px solid inherit;
                }
                .footer-brand {
                    flex: 1;
                    min-width: 300px;
                }
                .brand-logos {
                    font-size: 1.5rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    margin-bottom: var(--space-2);
                    text-transform: uppercase;
                }
                .brand-primary {
                    font-family: 'Playfair Display', serif;
                }
                .brand-divider {
                    margin: 0 var(--space-1);
                    opacity: 0.5;
                    font-weight: 300;
                }
                .brand-secondary {
                    font-family: 'Space Grotesk', sans-serif;
                }
                .brand-desc {
                    opacity: 0.8;
                    max-width: 400px;
                    line-height: 1.5;
                }

                .footer-links-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: var(--space-4);
                    padding-bottom: var(--space-4);
                }
                .footer-column h4 {
                    font-size: 1rem;
                    margin-bottom: var(--space-3);
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .footer-column ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }
                .footer-column a {
                    text-decoration: none;
                    color: inherit;
                    opacity: 0.7;
                    transition: opacity 0.3s;
                    font-size: 0.9rem;
                }
                .footer-column a:hover {
                    opacity: 1;
                    text-decoration: underline;
                }
                .social-icons {
                    display: flex;
                    gap: var(--space-2);
                }
                .social-icons a {
                    opacity: 0.7;
                    transition: opacity 0.3s, transform 0.3s;
                }
                .social-icons a:hover {
                    opacity: 1;
                    transform: translateY(-2px);
                }

                .footer-bottom {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: var(--space-2);
                    padding: var(--space-3) 0;
                    border-top: 1px solid inherit;
                    font-size: 0.8rem;
                    opacity: 0.6;
                }
                .payment-icons {
                    display: flex;
                    gap: var(--space-2);
                    font-weight: 600;
                }

                @media (max-width: 768px) {
                    .footer-top {
                        flex-direction: column;
                    }
                    .footer-bottom {
                        flex-direction: column;
                        text-align: center;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
