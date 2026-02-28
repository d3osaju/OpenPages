import { NextResponse } from "next/server";
import { DodoPayments } from "dodopayments";

const dodo = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY || "fallback_for_build",
    environment: process.env.NODE_ENV === "production" ? "live_mode" : "test_mode"
});

export async function POST(req: Request) {
    try {
        if (!process.env.DODO_PAYMENTS_API_KEY) {
            return NextResponse.json({ error: "Missing Dodo API Key" }, { status: 500 });
        }

        const baseUrl = process.env.NODE_ENV === "production"
            ? "https://openpages.zetalabs.in"
            : "http://localhost:3001";

        let productId = "";

        // Attempt to find or create the product because product_cart requires a valid product_id
        try {
            const products = await dodo.products.list();
            const pack = products.items.find((p: any) => p.name === "OpenPages - The Complete Pack");
            if (pack) {
                productId = pack.product_id;
            } else {
                const newProduct = await dodo.products.create({
                    name: "OpenPages - The Complete Pack",
                    description: "Lifetime access to all 25+ premium Next.js landing page templates",
                    price: {
                        currency: "USD",
                        discount: 0,
                        price: 2900,
                        purchasing_power_parity: false,
                        type: "one_time_price"
                    },
                    tax_category: "digital_products"
                });
                productId = newProduct.product_id;
            }
        } catch (e: any) {
            console.error("Failed to initialize product catalog", e);
            return NextResponse.json({ error: "Failed to initialize product catalog" }, { status: 500 });
        }

        const tempEmail = "Openpages@proton.me";

        const payment = await dodo.payments.create({
            billing: {
                city: "",
                country: "IN",
                state: "",
                street: "",
                zipcode: ""
            },
            customer: {
                email: tempEmail,
                name: "OpenPages Buyer"
            },
            payment_link: true,
            product_cart: [
                {
                    product_id: productId,
                    quantity: 1
                }
            ],
            return_url: `${baseUrl}/download?session_id={CHECKOUT_SESSION_ID}`,
        });

        if (!payment || !payment.payment_link) {
            return NextResponse.json({ error: "Failed to generate Dodo payment link" }, { status: 500 });
        }

        return NextResponse.json({ url: payment.payment_link });

    } catch (error: any) {
        console.error("Payment Error:", error);
        return NextResponse.json({ error: error.message || "Unknown payment creation error" }, { status: 500 });
    }
}
