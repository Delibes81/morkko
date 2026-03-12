import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const Privacidad = () => {
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
                    <h1>Política de Privacidad</h1>
                    <p>Tu privacidad es fundamental para nosotros.</p>
                </header>

                <div className="info-content text-section">
                    <p>La presente Política de Privacidad describe cómo se recopila, utiliza y comparte tu información personal cuando visitas o realizas una compra en <strong>morokkoguster.com</strong>.</p>

                    <h2>Información Personal que Recopilamos</h2>
                    <p>Cuando visitas el Sitio, recopilamos automáticamente cierta información sobre tu dispositivo, incluida información sobre tu navegador web, dirección IP, zona horaria y algunas de las cookies que están instaladas en tu dispositivo. Además, a medida que navegas por el Sitio, recopilamos información sobre las páginas web individuales o los productos que ves, qué páginas web o términos de búsqueda te remitieron al Sitio y sobre cómo interactúas con el Sitio.</p>
                    <p>Además, cuando realizas una compra o intentas realizar una compra a través del Sitio, recopilamos cierta información tuya, como tu nombre, dirección de facturación, dirección de envío, información de pago (incluyendo números de tarjetas de crédito/débito), dirección de correo electrónico y número de teléfono. Nos referimos a esta información como "Información del Pedido".</p>

                    <h2>¿Cómo utilizamos tu Información Personal?</h2>
                    <p>En general, utilizamos la Información del Pedido que recopilamos para cumplir con cualquier pedido realizado a través del Sitio (incluyendo el procesamiento de tu información de pago, la organización del envío y el suministro de facturas y/o confirmaciones de pedidos). Además, utilizamos esta Información del Pedido para:</p>
                    <ul className="requirements-list">
                        <li>Comunicarnos contigo.</li>
                        <li>Identificar y prevenir posibles riesgos o fraudes.</li>
                        <li>Proporcionarte información o publicidad relacionada con nuestras líneas de productos (Morokko y Guster) cuando esté en línea con las preferencias que has compartido con nosotros.</li>
                    </ul>

                    <h2>Compartir tu Información Personal</h2>
                    <p>Compartimos tu Información Personal con terceros para que nos ayuden a utilizarla, tal como se describió anteriormente. Por ejemplo, utilizamos pasarelas de pago seguras para procesar las transacciones y servicios de paquetería para la entrega de los pedidos. También podemos compartir tu Información Personal para cumplir con las leyes y regulaciones aplicables, para responder a una citación o solicitud legal de información que recibamos, o para proteger nuestros derechos.</p>

                    <h2>Retención de Datos y Seguridad</h2>
                    <p>Cuando realizas un pedido a través del Sitio, mantendremos tu Información del Pedido para nuestros registros a menos y hasta que nos pidas que eliminemos esta información. Tomamos medidas razonables para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.</p>
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
                    font-size: 1rem;
                    color: #888;
                }
                .info-content {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .text-section h2 {
                    font-size: 1.5rem;
                    border-bottom: 2px solid #EEE;
                    padding-bottom: var(--space-2);
                    margin-bottom: var(--space-3);
                    margin-top: var(--space-5);
                }
                .text-section p, .text-section li {
                    line-height: 1.7;
                    color: #444;
                    margin-bottom: var(--space-3);
                    font-size: 1.05rem;
                }
                .requirements-list {
                    list-style-type: disc;
                    padding-left: var(--space-4);
                    margin-bottom: var(--space-4);
                }
            `}</style>
        </motion.div>
    );
};

export default Privacidad;
