import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const Devoluciones = () => {
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
                    <h1>Cambios y Devoluciones</h1>
                    <p>Queremos que ames tu estilo. Si no es así, estamos aquí para ayudarte.</p>
                </header>

                <div className="info-content">
                    <div className="text-section">
                        <h2>Nuestra Política</h2>
                        <p>Tienes hasta <strong>15 días naturales</strong> tras haber recibido tu producto para solicitar un cambio o devolución. Para que proceda, la prenda debe cumplir con los siguientes requisitos:</p>
                        
                        <ul className="requirements-list">
                            <li>Estar en su estado original, sin usar, lavar ni alterar.</li>
                            <li>Conservar todas las etiquetas originales y el empaque.</li>
                            <li>No aplicable en ropa interior, calcetería o artículos rebajados en baratas finales por razones de higiene.</li>
                        </ul>

                        <h2>¿Cómo solicito un cambio o devolución?</h2>
                        <ol className="steps-list">
                            <li>Envía un correo a <strong>soporte@morokkoguster.com</strong> incluyendo tu número de pedido y detallando el motivo del cambio o devolución.</li>
                            <li>Nuestro equipo te responderá en un plazo máximo de 48 horas hábiles con una guía prepagada e instrucciones sobre cómo empacar el producto.</li>
                            <li>Lleva el paquete a la sucursal de correos indicada en el correo.</li>
                            <li>Una vez que recibamos e inspeccionemos la prenda (proceso que toma de 1 a 3 días hábiles), emitiremos el reembolso a tu método de pago original o te enviaremos la nueva talla solicitada.</li>
                        </ol>

                        <h2>Costos</h2>
                        <p>El primer cambio o devolución es completamente <strong>gratuito</strong>. En caso de requerir un segundo cambio sobre el mismo pedido original, el cliente deberá cubrir los gastos de envío.</p>

                        <h2>Artículos Defectuosos</h2>
                        <p>Revisamos exhaustivamente cada prenda antes de enviarla, pero si llegas a recibir un producto con defectos de fábrica (como costuras erróneas o desgaste irregular), por favor notifícanos de inmediato enviando fotografías del desperfecto a nuestro correo. En este caso, el reembolso o cambio procede de manera inmediata y sin ningún costo para ti.</p>
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
                    max-width: 800px;
                    margin: 0 auto;
                }
                .text-section h2 {
                    font-size: 1.8rem;
                    border-bottom: 2px solid #EEE;
                    padding-bottom: var(--space-2);
                    margin-bottom: var(--space-3);
                    margin-top: var(--space-5);
                }
                .text-section p, .text-section li {
                    line-height: 1.6;
                    color: #444;
                    margin-bottom: var(--space-3);
                }
                .requirements-list {
                    list-style-type: disc;
                    padding-left: var(--space-4);
                    margin-bottom: var(--space-4);
                }
                .steps-list {
                    list-style-type: decimal;
                    padding-left: var(--space-4);
                    margin-bottom: var(--space-4);
                }
                .steps-list li {
                    margin-bottom: var(--space-2);
                }
            `}</style>
        </motion.div>
    );
};

export default Devoluciones;
