const Stripe = require('stripe');

exports.handler = async (event) => {
    // Solo permitir solicitudes POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);
        const { amount } = JSON.parse(event.body);

        // Convertir la cantidad a centavos
        const amountInCents = Math.round(amount * 100);

        // Crear el intento de pago
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'mxn',
            payment_method_types: ['card'],
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientSecret: paymentIntent.client_secret
            }),
        };
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
