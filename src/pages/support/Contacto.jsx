import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Mail, MessageCircle, MapPin } from 'lucide-react';

const Contacto = () => {
    const { setSpecificTheme } = useTheme();
    const [status, setStatus] = useState('');

    useEffect(() => {
        setSpecificTheme('light');
        window.scrollTo(0, 0);
    }, [setSpecificTheme]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Enviando...');
        // Simulamos envío
        setTimeout(() => {
            setStatus('¡Mensaje enviado con éxito! Te contactaremos pronto.');
            e.target.reset();
        }, 1500);
    };

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
                    <h1>Contacto</h1>
                    <p>Estamos aquí para escucharte y ayudarte. Habla con nosotros.</p>
                </header>

                <div className="contact-grid">
                    <div className="contact-info">
                        <h2>Nuestros Canales</h2>
                        <p>El equipo de soporte de Morokko y Guster opera de Lunes a Viernes de 9:00 AM a 6:00 PM.</p>

                        <div className="contact-method">
                            <Mail className="contact-icon" />
                            <div>
                                <h3>Correo Electrónico</h3>
                                <p>soporte@morokkoguster.com</p>
                                <span>Tiempo de respuesta: ~24hrs hábiles</span>
                            </div>
                        </div>

                        <div className="contact-method">
                            <MessageCircle className="contact-icon" />
                            <div>
                                <h3>WhatsApp (Ventas)</h3>
                                <p>+52 55 1234 5678</p>
                                <span>Solo mensajes de texto</span>
                            </div>
                        </div>

                        <div className="contact-method">
                            <MapPin className="contact-icon" />
                            <div>
                                <h3>Oficinas Centrales</h3>
                                <p>Av. Siempre Viva 123, Colonia Centro<br />Ciudad de México, CP 01000</p>
                                <span>*No hay venta directa al público en esta ubicación</span>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-wrapper">
                        <h2>Envíanos un Mensaje</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Nombre Completo</label>
                                <input type="text" id="name" required placeholder="Ej. Juan Pérez" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Correo Electrónico</label>
                                <input type="email" id="email" required placeholder="tucorreo@ejemplo.com" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">Asunto</label>
                                <select id="subject" required>
                                    <option value="">Selecciona una opción</option>
                                    <option value="duda">Duda sobre producto</option>
                                    <option value="pedido">Estatus de mi pedido</option>
                                    <option value="devolucion">Solicitud de devolución/cambio</option>
                                    <option value="colaboracion">Colaboraciones</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Tu Mensaje</label>
                                <textarea id="message" rows="5" required placeholder="Escribe aquí los detalles..."></textarea>
                            </div>
                            <button type="submit" className="btn-submit" disabled={status === 'Enviando...'}>
                                {status === 'Enviando...' ? 'Procesando...' : 'Enviar Mensaje'}
                            </button>
                            {status && <p className={`status-msg ${status.includes('éxito') ? 'success' : ''}`}>{status}</p>}
                        </form>
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
                .contact-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-6);
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .contact-info h2, .contact-form-wrapper h2 {
                    font-size: 1.8rem;
                    border-bottom: 2px solid #EEE;
                    padding-bottom: var(--space-2);
                    margin-bottom: var(--space-4);
                }
                .contact-info > p {
                    color: #555;
                    margin-bottom: var(--space-4);
                    line-height: 1.5;
                }
                .contact-method {
                    display: flex;
                    gap: var(--space-3);
                    margin-bottom: var(--space-4);
                }
                .contact-icon {
                    color: #222;
                    margin-top: 4px;
                    flex-shrink: 0;
                }
                .contact-method h3 {
                    font-size: 1.1rem;
                    margin-bottom: 4px;
                }
                .contact-method p {
                    color: #333;
                    font-weight: 500;
                    margin-bottom: 4px;
                }
                .contact-method span {
                    font-size: 0.85rem;
                    color: #777;
                }
                
                .contact-form {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-3);
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .form-group label {
                    font-weight: 500;
                    color: #333;
                    font-size: 0.95rem;
                }
                .form-group input, .form-group select, .form-group textarea {
                    padding: var(--space-2) var(--space-3);
                    border: 1px solid #CCC;
                    border-radius: var(--radius-sm);
                    font-family: inherit;
                    font-size: 1rem;
                    background: #FAFAFA;
                    transition: border-color 0.3s;
                }
                .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
                    outline: none;
                    border-color: #222;
                    background: #FFF;
                }
                .btn-submit {
                    background: #222;
                    color: #FFF;
                    border: none;
                    padding: var(--space-3);
                    border-radius: var(--radius-sm);
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.3s;
                    margin-top: var(--space-2);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .btn-submit:hover {
                    background: #000;
                }
                .btn-submit:disabled {
                    background: #666;
                    cursor: not-allowed;
                }
                .status-msg {
                    text-align: center;
                    font-size: 0.95rem;
                    color: #666;
                }
                .status-msg.success {
                    color: #2ed573;
                    font-weight: 600;
                }

                @media (max-width: 768px) {
                    .contact-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </motion.div>
    );
};

export default Contacto;
