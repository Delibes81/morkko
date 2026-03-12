import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const Terminos = () => {
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
                    <h1>Términos de Servicio</h1>
                    <p>Última actualización: Noviembre 2023</p>
                </header>

                <div className="info-content text-section">
                    <p>Bienvenido al sitio web de <strong>Morokko y Guster</strong>. Al acceder o utilizar este sitio, aceptas estar sujeto a los siguientes Términos y Condiciones. Lee detenidamente este documento antes de realizar cualquier compra o uso de nuestros servicios.</p>

                    <h2>1. Condiciones Generales</h2>
                    <p>Nos reservamos el derecho de rechazar el servicio a cualquier persona por cualquier motivo en cualquier momento. Entiendes que tu contenido (sin incluir la información de la tarjeta de crédito), puede transferirse sin encriptar e involucrar transmisiones a través de varias redes.</p>

                    <h2>2. Exactitud y Modificación de la Información</h2>
                    <p>No nos hacemos responsables si la información disponible en este sitio no es exacta, completa o actual. El material de este sitio se proporciona solo para información general. Nos reservamos el derecho de modificar los contenidos de este sitio en cualquier momento, pero no tenemos obligación de actualizar ninguna información. Asimismo, los precios de nuestros productos (tanto de la línea Morokko como Guster) están sujetos a cambios sin previo aviso.</p>

                    <h2>3. Productos y Servicios</h2>
                    <p>Ciertos productos o servicios pueden estar disponibles exclusivamente en línea a través del sitio web. Estos productos o servicios pueden tener cantidades limitadas y están sujetos a devolución o cambio únicamente de acuerdo con nuestra Política de Cambios y Devoluciones.</p>
                    <p>Hemos hecho todo lo posible para mostrar con la mayor precisión posible los colores y las imágenes de nuestros productos que aparecen en la tienda. No podemos garantizar que la visualización de cualquier color en la pantalla de tu computadora o dispositivo móvil sea precisa.</p>

                    <h2>4. Propiedad Intelectual</h2>
                    <p>Todo el contenido incluido en este sitio web, texto, gráficos, logotipos, imágenes y software, es propiedad de Morokko/Guster y está protegido por las leyes de propiedad intelectual y derechos de autor internacionales.</p>

                    <h2>5. Ley Aplicable</h2>
                    <p>Estos Términos de Servicio y cualquier acuerdo separado por el cual te proporcionemos Servicios se regirán e interpretarán de acuerdo con las leyes de México.</p>
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
            `}</style>
        </motion.div>
    );
};

export default Terminos;
