import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { CreditCard, Truck, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';

// Cargar Stripe fuera del renderizado del componente para evitar recrear el objecto
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ clientSecret, amount, cartItems }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        email: '',
        phone: '',
        estado: '',
        colonia: '',
        cp: '',
        alcaldia: '',
        calle: '',
        numeroExt: '',
        numeroInt: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: shippingDetails.name,
                    email: shippingDetails.email,
                    address: {
                        line1: `${shippingDetails.calle} ${shippingDetails.numeroExt} ${shippingDetails.numeroInt}`,
                        city: shippingDetails.alcaldia,
                        state: shippingDetails.estado,
                        postal_code: shippingDetails.cp,
                        country: 'MX', // Asumiendo México como destino por defecto, se podría hacer dinámico
                    }
                }
            }
        });

        if (payload.error) {
            setError(`Pago fallido: ${payload.error.message}`);
            setProcessing(false);
        } else {
            setError(null);
            
            try {
                // Intentar guardar la orden en Supabase
                const { data: orderData, error: orderError } = await supabase
                    .from('orders')
                    .insert([{
                        customer_name: shippingDetails.name,
                        customer_email: shippingDetails.email,
                        customer_phone: shippingDetails.phone,
                        address: `${shippingDetails.calle} ${shippingDetails.numeroExt}${shippingDetails.numeroInt ? ' Int ' + shippingDetails.numeroInt : ''}, Col. ${shippingDetails.colonia}, ${shippingDetails.alcaldia}, ${shippingDetails.estado}, CP ${shippingDetails.cp}`,
                        calle: shippingDetails.calle,
                        numero_ext: shippingDetails.numeroExt,
                        numero_int: shippingDetails.numeroInt,
                        colonia: shippingDetails.colonia,
                        alcaldia: shippingDetails.alcaldia,
                        estado: shippingDetails.estado,
                        cp: shippingDetails.cp,
                        total_amount: amount,
                        stripe_payment_id: payload.paymentIntent.id,
                        status: 'paid'
                    }])
                    .select();
                
                if (orderError) throw orderError;
                
                const orderId = orderData[0].id;

                // Guardar los items de la orden
                const orderItems = cartItems.map(item => ({
                    order_id: orderId,
                    product_id: item.id,
                    product_name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    brand: item.brand
                }));

                const { error: itemsError } = await supabase
                    .from('order_items')
                    .insert(orderItems);

                if (itemsError) throw itemsError;

            } catch (dbError) {
                console.error("Error guardando orden en Supabase:", dbError);
                // Aquí podrías decidir si fallas la transacción o solo haces console.error
                // Ya que el dinero se cobró, solo logeamos el error y dejamos pasar al usuario.
            }

            setProcessing(false);
            setSucceeded(true);
            
            // Redirigir
            setTimeout(() => {
                navigate('/success', { 
                    state: { 
                        orderId: payload.paymentIntent.id,
                        amount: amount 
                    } 
                });
            }, 2000);
        }
    };

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: 'Space Grotesk, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#aab7c4"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <h3 className="section-title"><Truck size={20}/> Datos de Envío</h3>
            <div className="form-grid">
                <input type="text" name="name" placeholder="Nombre completo" required onChange={handleInputChange} className="full-width" />
                <input type="email" name="email" placeholder="Correo electrónico" required onChange={handleInputChange} />
                <input type="tel" name="phone" placeholder="Teléfono a 10 dígitos" required onChange={handleInputChange} />
                
                <input type="text" name="calle" placeholder="Calle" required className="full-width" onChange={handleInputChange} />
                
                <input type="text" name="numeroExt" placeholder="Nº Exterior" required onChange={handleInputChange} />
                <input type="text" name="numeroInt" placeholder="Nº Interior (Opcional)" onChange={handleInputChange} />
                
                <input type="text" name="colonia" placeholder="Colonia" required onChange={handleInputChange} />
                <input type="text" name="cp" placeholder="Código Postal" required onChange={handleInputChange} />
                
                <input type="text" name="alcaldia" placeholder="Alcaldía o Municipio" required onChange={handleInputChange} />
                <input type="text" name="estado" placeholder="Estado" required onChange={handleInputChange} />
            </div>

            <h3 className="section-title" style={{ marginTop: '2rem' }}><CreditCard size={20}/> Pago Seguro</h3>
            <div className="card-element-container">
                <CardElement id="card-element" options={cardStyle} onChange={(e) => setError(e.error ? e.error.message : '')} />
            </div>

            {error && (
                <div className="card-error" role="alert">
                    {error}
                </div>
            )}

            <button
                disabled={processing || succeeded || !stripe}
                id="submit"
                className="btn-pay"
            >
                <span id="button-text">
                    {processing ? <Loader2 className="spinner" size={20}/> : `Pagar $${amount.toFixed(2)}`}
                </span>
            </button>
            
            {succeeded && (
                <p className="success-message">¡Pago procesado con éxito! Redirigiendo...</p>
            )}
            
            <p className="secure-badge"><ShieldCheck size={16}/> Tus pagos están protegidos por encriptación de 256 bits.</p>
        </form>
    );
};

const Checkout = () => {
    const { cartItems: cart } = useCart();
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(true);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 1500 ? 0 : 150; // Envío gratis en compras mayores a $1500
    const total = subtotal + shipping;

    useEffect(() => {
        // Redirigir de vuelta si el carrito está vacío
        if (cart.length === 0) {
            navigate('/');
            return;
        }

        // Simular llamada al backend para obtener el Client Secret
        // En producción, esto apuntaría a un archivo serverless de Supabase o Vercel
        const fetchPaymentIntent = async () => {
            try {
                const apiUrl = import.meta.env.DEV 
                    ? 'http://localhost:4242/create-payment-intent' 
                    : '/api/create-payment-intent';
                
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: total })
                });
                
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                
                const data = await response.json();
                
                if(data.clientSecret) {
                   setClientSecret(data.clientSecret);
                } else {
                   console.error("No client secret returned", data);
                }
                setLoading(false);
                
            } catch (err) {
                console.error("Error fetching intent", err);
                setLoading(false);
            }
        };

        fetchPaymentIntent();
    }, [cart, navigate, total]);

    if(loading) return (
        <div className="page-container checkout-page d-flex align-center justify-center m-h-screen">
            <Loader2 className="spinner big" size={40}/>
            <p>Preparando entorno seguro de pago...</p>
        </div>
    );

    return (
        <div className="page-container checkout-page">
            <div className="checkout-header">
                <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={20}/> Volver</button>
                <h1>Finalizar Compra</h1>
            </div>

            <div className="checkout-content">
                <div className="checkout-left">
                    <div className="payment-box">
                        {clientSecret && (
                            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                                <CheckoutForm clientSecret={clientSecret} amount={total} cartItems={cart} />
                            </Elements>
                        )}
                        {!clientSecret && (
                            <div className="no-secret">
                                Error connecting to Stripe servers. Please try again.
                            </div>
                        )}
                    </div>
                </div>

                <div className="checkout-right order-summary-box">
                    <h2>Resumen de Pedido</h2>
                    <div className="summary-items">
                        {cart.map((item, idx) => (
                            <div key={idx} className="summary-item">
                                <img src={item.image} alt={item.name} className="summary-img" />
                                <div className="summary-details">
                                    <h4>{item.name}</h4>
                                    <p className="brand-tag">{item.brand}</p>
                                    <p>Cant: {item.quantity}</p>
                                </div>
                                <div className="summary-price">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="summary-totals">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Envío</span>
                            <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="summary-row total-row">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .checkout-page {
                    min-height: calc(100vh - var(--header-height));
                    background-color: var(--bg-secondary);
                    color: var(--text-primary);
                    padding: var(--space-6) var(--space-4);
                }

                .checkout-header {
                    max-width: 1200px;
                    margin: 0 auto var(--space-6);
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                }

                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    font-size: 1rem;
                    transition: color 0.2s;
                }

                .back-btn:hover {
                    color: var(--text-primary);
                }

                .checkout-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: var(--space-6);
                    align-items: start;
                }

                .payment-box, .order-summary-box {
                    background-color: var(--bg-primary);
                    border-radius: var(--item-radius);
                    padding: var(--space-6);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }

                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: var(--space-4);
                    font-family: var(--font-heading);
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: 12px;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-3);
                }

                .form-grid input {
                    width: 100%;
                    padding: 12px 16px;
                    background-color: transparent;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    color: var(--text-primary);
                    font-family: var(--font-body);
                }

                .full-width {
                    grid-column: 1 / -1;
                }

                .card-element-container {
                    padding: 16px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    background-color: transparent;
                    margin-bottom: var(--space-4);
                }

                .btn-pay {
                    width: 100%;
                    padding: 16px;
                    background-color: var(--text-primary);
                    color: var(--bg-primary);
                    border: none;
                    border-radius: var(--radius-sm);
                    font-weight: 700;
                    font-size: 1.1rem;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: transform 0.2s, opacity 0.2s;
                }

                .btn-pay:hover {
                    transform: translateY(-2px);
                }

                .btn-pay:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .spinner {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    100% { transform: rotate(360deg); }
                }

                .secure-badge {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: var(--space-4);
                    font-size: 0.85rem;
                    color: #6b7280;
                }

                /* Summary Styles */
                .summary-items {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                    margin-bottom: var(--space-5);
                }

                .summary-item {
                    display: flex;
                    gap: var(--space-3);
                    align-items: center;
                }

                .summary-img {
                    width: 64px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: var(--radius-sm);
                }

                .summary-details h4 {
                    margin: 0 0 4px 0;
                    font-size: 0.95rem;
                }

                .brand-tag {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: var(--text-secondary);
                    margin-bottom: 4px;
                }

                .summary-price {
                    margin-left: auto;
                    font-weight: 600;
                }

                .summary-totals {
                    border-top: 1px solid var(--border-color);
                    padding-top: var(--space-4);
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    color: var(--text-secondary);
                }

                .total-row {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    border-top: 1px dashed var(--border-color);
                    padding-top: 12px;
                    margin-top: 4px;
                }

                @media (max-width: 900px) {
                    .checkout-content {
                        grid-template-columns: 1fr;
                    }
                    .checkout-right {
                        order: -1; /* Muestra el resumen primero en celular */
                    }
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default Checkout;
