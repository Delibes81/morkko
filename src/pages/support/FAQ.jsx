import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const FAQ = () => {
    const { setSpecificTheme, theme } = useTheme();

    useEffect(() => {
        // Defaults to light theme (Morokko) for general info, but respects current context if preferred
        setSpecificTheme('light');
        window.scrollTo(0, 0);
    }, [setSpecificTheme]);

    return (
        <motion.div 
            className="info-page-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container">
                <header className="info-header">
                    <h1>Preguntas Frecuentes</h1>
                    <p>Encuentra respuestas a las dudas más comunes sobre Morokko y Guster.</p>
                </header>

                <div className="info-content">
                    <section className="faq-section">
                        <h2>General</h2>
                        <div className="faq-item">
                            <h3>¿Cuál es la diferencia entre Morokko y Guster?</h3>
                            <p>Morokko es nuestra línea enfocada en el estilo de vida, la frescura y elegancia casual, utilizando materiales como lino y algodón predominantemente en colores claros. Guster, por otro lado, es nuestra declaración de streetwear urbano, nocturno y rebelde, diseñado predominantemente en negro contrastante y centrado en la cultura y actitud urbana.</p>
                        </div>
                        <div className="faq-item">
                            <h3>¿Puedo comprar productos de ambas marcas en un solo pedido?</h3>
                            <p>¡Totalmente! Ambas colecciones comparten el mismo carrito de compras (La Bolsa) y se procesarán juntas como una única orden para tu comodidad.</p>
                        </div>
                    </section>

                    <section className="faq-section">
                        <h2>Pedidos y Pagos</h2>
                        <div className="faq-item">
                            <h3>¿Qué métodos de pago aceptan?</h3>
                            <p>Aceptamos todas las tarjetas de crédito y débito principales (Visa, Mastercard, American Express), así como pagos mediante PayPal para garantizar la seguridad de tus transacciones.</p>
                        </div>
                        <div className="faq-item">
                            <h3>¿Cómo sé que mi compra fue exitosa?</h3>
                            <p>Una vez procesado el pago, recibirás un correo electrónico de confirmación con los detalles de tu orden y tu número de pedido. Si no lo recibes en 15 minutos, revisa tu carpeta de spam.</p>
                        </div>
                    </section>
                </div>
            </div>

            <style>{`
                .info-page-container {
                    padding-top: calc(var(--header-height) + var(--space-6));
                    padding-bottom: var(--space-8);
                    min-height: 100vh;
                    background-color: var(--bg-color, #FFFFFF);
                    color: var(--text-color, #111111);
                }
                .info-header {
                    text-align: center;
                    margin-bottom: var(--space-6);
                }
                .info-header h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: 3rem;
                    margin-bottom: var(--space-2);
                    color: #222;
                }
                .info-header p {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 1.1rem;
                    color: #666;
                }
                .info-content {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .faq-section {
                    margin-bottom: var(--space-6);
                }
                .faq-section h2 {
                    font-size: 1.8rem;
                    border-bottom: 2px solid #EEE;
                    padding-bottom: var(--space-2);
                    margin-bottom: var(--space-4);
                }
                .faq-item {
                    margin-bottom: var(--space-4);
                }
                .faq-item h3 {
                    font-size: 1.2rem;
                    margin-bottom: var(--space-2);
                    font-weight: 600;
                }
                .faq-item p {
                    line-height: 1.6;
                    color: #444;
                }
            `}</style>
        </motion.div>
    );
};

export default FAQ;
