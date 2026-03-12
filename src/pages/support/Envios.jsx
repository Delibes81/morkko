import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Truck, Clock, ShieldCheck } from 'lucide-react';

const Envios = () => {
    const { setSpecificTheme } = useTheme();

    useEffect(() => {
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
                    <h1>Envíos y Entregas</h1>
                    <p>Llevamos el estilo de Morokko y Guster directo a tu puerta.</p>
                </header>

                <div className="info-content">
                    <div className="features-grid">
                        <div className="feature-card">
                            <Truck size={40} className="feature-icon" />
                            <h3>Envíos Nacionales</h3>
                            <p>Realizamos envíos a toda la República Mexicana utilizando las paqueterías más seguras y rápidas del mercado.</p>
                        </div>
                        <div className="feature-card">
                            <Clock size={40} className="feature-icon" />
                            <h3>Tiempos de Entrega</h3>
                            <p>El envío estándar toma entre 3 y 5 días hábiles procesar y entregar. El envío exprés toma de 1 a 2 días hábiles.</p>
                        </div>
                        <div className="feature-card">
                            <ShieldCheck size={40} className="feature-icon" />
                            <h3>Envíos Asegurados</h3>
                            <p>Todos nuestros envíos van asegurados. Si por alguna razón tu paquete se extravía, nosotros nos hacemos responsables.</p>
                        </div>
                    </div>

                    <div className="text-section">
                        <h2>Costos de Envío</h2>
                        <p>El costo del envío se calcula automáticamente al finalizar tu compra, dependiendo de tu código postal. <strong>¡Ofrecemos envío estándar gratuito en compras superiores a $1,500 MXN!</strong></p>

                        <h2>Rastreo de tu Pelido</h2>
                        <p>Una vez que tu paquete salga de nuestro almacén, recibirás un correo electrónico con tu número de guía y las instrucciones para que puedas monitorear su trayecto en tiempo real.</p>

                        <h2>Dudas Adicionales</h2>
                        <p>Si tienes alguna pregunta sobre el estatus de tu envío que no se resolvió con la guía de rastreo, por favor revisa nuestra sección de Contacto para comunicarte con el equipo de soporte.</p>
                    </div>
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
                    max-width: 900px;
                    margin: 0 auto;
                }
                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: var(--space-4);
                    margin-bottom: var(--space-6);
                }
                .feature-card {
                    background: #FAFAFA;
                    padding: var(--space-4);
                    border-radius: var(--radius-md);
                    text-align: center;
                    border: 1px solid #EEE;
                }
                .feature-icon {
                    margin-bottom: var(--space-3);
                    color: #222;
                }
                .feature-card h3 {
                    font-size: 1.2rem;
                    margin-bottom: var(--space-2);
                }
                .feature-card p {
                    font-size: 0.95rem;
                    color: #555;
                    line-height: 1.5;
                }
                .text-section h2 {
                    font-size: 1.8rem;
                    border-bottom: 2px solid #EEE;
                    padding-bottom: var(--space-2);
                    margin-bottom: var(--space-3);
                    margin-top: var(--space-5);
                }
                .text-section p {
                    line-height: 1.6;
                    color: #444;
                    margin-bottom: var(--space-3);
                }
            `}</style>
        </motion.div>
    );
};

export default Envios;
