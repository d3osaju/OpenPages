import { NextResponse } from "next/server";
import { DodoPayments } from "dodopayments";

const dodo = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    environment: process.env.NODE_ENV === "production" ? "live_mode" : "test_mode"
});

export async function POST(req: Request) {
    try {
        if (!process.env.DODO_PAYMENTS_API_KEY) {
            return NextResponse.json({ error: "Missing Dodo API Key" }, { status: 500 });
        }

        const baseUrl = process.env.NODE_ENV === "production"
            ? "https://openpages.zetalabs.in" // User's prod domain
            : "http://localhost:3001";

        /*
         * 1. Ensure the product exists in Dodo Payments
         */
        // Let's manually retrieve or create the product if it doesn't exist.
        // Dodo currently doesn't allow random throwaway products in checkout.

        let targetProductId = "";

        // Use a generic placeholder email since Dodo requires it upfront if bypassing their own collector
        const tempEmail = "buyer@openpages.zetalabs.in";

        const payment = await dodo.payments.create({
            billing: {
                city: "",
                country: "US", // Billing country required by API interface
                state: "",
                street: "",
                zipcode: ""
            },
            customer: {
                email: tempEmail,
                name: "OpenPages Buyer",
                create_new_customer: false
            },
            payment_link: true,
            // Since we don't have a product ID created by the user yet, let's use the alternative schema if it exists or hardcode a placeholder for now. 
            // Better yet, we will just pass empty for product cart and see if the API allows dynamic pricing via total_amount or another field, 
            // but the typescript error says product_cart is required.
            // Let's create the product inline.
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
