import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback a .env si .local no existe

const app = express();
const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;
        
        // Convertir la cantidad a centavos (Stripe requiere enteros mínimos de divisa)
        const amountInCents = Math.round(amount * 100);

        // Crear el intento de pago
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'mxn',
            payment_method_types: ['card'],
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

const port = process.env.PORT || 4242;
app.listen(port, () => console.log(`Stripe Mock Server corriendo en el puerto ${port}`));
