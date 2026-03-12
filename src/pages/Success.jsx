import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';

const Success = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const { clearCart } = useCart();

    useEffect(() => {
        // Obtenemos los datos del pago pasados por React Router state
        if (location.state && location.state.orderId) {
            setOrderDetails(location.state);
            clearCart();
            
            // Disparar confeti de celebración
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#000000', '#FFFFFF', '#4CAF50']
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#000000', '#FFFFFF', '#4CAF50']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        } else {
            // Si el usuario entra a /success manualmente sin haber comprado
            navigate('/');
        }
    }, [location, navigate]);

    if (!orderDetails) return null;

    return (
        <motion.div 
            className="page-container success-page d-flex flex-column align-center justify-center m-h-screen text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="success-card">
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                    <CheckCircle2 size={80} className="success-icon" />
                </motion.div>
                
                <h1>¡Compra Exitosa!</h1>
                <p className="success-subtitle">Tu pedido ha sido procesado y confirmado correctamente.</p>
                
                <div className="order-info-box">
                    <div className="info-row highlight-order">
                        <span className="label">Número de Pedido:</span>
                        <div className="value-group">
                            <span className="value order-id-text">{orderDetails.orderId.split('_').pop().toUpperCase()}</span>
                            <span className="security-note">⚠️ Por favor anota este número para tu seguridad y seguimiento</span>
                        </div>
                    </div>
                    <div className="info-row">
                        <span className="label">Total Pagado:</span>
                        <span className="value font-bold">${orderDetails.amount.toFixed(2)}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Estado:</span>
                        <span className="value badge-success">Confirmado</span>
                    </div>
                </div>

                <div className="next-steps">
                    <h3><Package size={20}/> ¿Qué sigue?</h3>
                    <p>Enviaremos un correo electrónico de confirmación con los detalles de tu envío. Podrás rastrear tu paquete en cuanto sea recolectado por la paquetería.</p>
                </div>

                <div className="success-actions">
                    <Link to="/" className="btn-primary-outline">Seguir Comprando <ArrowRight size={18}/></Link>
                </div>
            </div>

            <style>{`
                .success-page {
                    background-color: var(--bg-secondary);
                    min-height: calc(100vh - var(--header-height));
                    padding: var(--space-6) var(--space-4);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .success-card {
                    background-color: var(--bg-primary);
                    max-width: 600px;
                    width: 100%;
                    margin: 0 auto;
                    padding: var(--space-6) var(--space-5);
                    border-radius: var(--item-radius);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .success-icon {
                    color: #10B981;
                    margin-bottom: var(--space-3);
                }

                .success-card h1 {
                    font-family: var(--font-heading);
                    margin-bottom: 8px;
                    color: var(--text-primary);
                }

                .success-subtitle {
                    color: var(--text-secondary);
                    margin-bottom: var(--space-5);
                    font-size: 1.1rem;
                }

                .order-info-box {
                    width: 100%;
                    background-color: var(--bg-secondary);
                    border-radius: var(--radius-sm);
                    padding: var(--space-4);
                    margin-bottom: var(--space-5);
                    border: 1px dashed var(--border-color);
                }

                .info-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                }

                .info-row:last-child {
                    border-bottom: none;
                }

                .info-row .label {
                    color: var(--text-secondary);
                }

                .info-row .value {
                    color: var(--text-primary);
                    font-family: monospace;
                    font-size: 1.05rem;
                }

                .font-bold {
                    font-weight: 700;
                    font-family: var(--font-body) !important;
                }

                .highlight-order {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                    background-color: rgba(0,0,0,0.02);
                    padding: 12px;
                    border-radius: var(--radius-sm);
                    border: 1px solid rgba(0,0,0,0.05);
                }

                .value-group {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .order-id-text {
                    font-size: 1.25rem !important;
                    font-weight: 700;
                    color: var(--text-primary);
                    letter-spacing: 1px;
                }

                .security-note {
                    font-size: 0.8rem;
                    color: #D97706; /* Un color de advertencia sutil */
                    font-weight: 500;
                }

                .badge-success {
                    background-color: #D1FAE5;
                    color: #065F46;
                    padding: 2px 10px;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    font-family: var(--font-body) !important;
                }

                .next-steps {
                    text-align: left;
                    width: 100%;
                    margin-bottom: var(--space-6);
                    background-color: rgba(16, 185, 129, 0.05);
                    padding: var(--space-4);
                    border-radius: var(--radius-sm);
                    border-left: 4px solid #10B981;
                }

                .next-steps h3 {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                    font-size: 1.1rem;
                }

                .next-steps p {
                    color: var(--text-secondary);
                    line-height: 1.6;
                    font-size: 0.95rem;
                }

                .success-actions {
                    width: 100%;
                }

                .btn-primary-outline {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    width: 100%;
                    padding: 14px 24px;
                    border: 1px solid var(--text-primary);
                    background-color: transparent;
                    color: var(--text-primary);
                    border-radius: var(--radius-sm);
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s;
                }

                .btn-primary-outline:hover {
                    background-color: var(--text-primary);
                    color: var(--bg-primary);
                }

                /* Soporte para Dark Mode de la base de datos de Tailwind/Vars */
                @media (prefers-color-scheme: dark) {
                    .info-row { border-bottom-color: rgba(255,255,255,0.05); }
                    .badge-success {
                        background-color: rgba(16, 185, 129, 0.2);
                        color: #34D399;
                    }
                }
            `}</style>
        </motion.div>
    );
};

export default Success;
