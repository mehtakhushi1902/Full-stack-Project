import type { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const makePayment = async (req: Request, res: Response) => {
    try {
        const baseUrl = process.env.FRONTEND_URL;
        const { products } = req.body;

        const lineItems = products.map((product: any) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: product.name,
                },
                unit_amount: Math.round(product.price),
            },
            quantity: product.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            success_url: `${baseUrl}/payment/success`,
            cancel_url: `${baseUrl}/payment/cancel`,
        });

        console.log("session", session)

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error creating Stripe session:", error);
        res.status(500).json({ error: "Failed to create payment session" });
    }
};