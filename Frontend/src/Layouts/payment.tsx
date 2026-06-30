import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { loadStripe } from "@stripe/stripe-js";
export const Payment = () => {


    const makePayment = async () => {

        const baseUrl = import.meta.env.VITE_BACKEND_URL;

        const headers = {
            "Content-Type": "application/json"
        }

        const body = {
            products: [
                {
                    name: "Product 1",
                    price: 10000000,
                    quantity: 1
                },
                {
                    name: "Product 2",
                    price: 20000000,
                    quantity: 2
                },
            ]
        }

        const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

        const stripe = await stripePromise;

        if (!stripe) {
            throw new Error("Stripe failed to initialize");
        }

        const response = await fetch(`${baseUrl}/payments`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });

        const data = await response.json();

        window.location.href = data.url;
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>  Payment Intgration with Stripe </CardTitle>
                </CardHeader>
                <Button onClick={makePayment}> Make payment </Button>
            </Card>
        </div>
    )
}