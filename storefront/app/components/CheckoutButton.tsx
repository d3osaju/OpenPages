"use client";

import { useState } from "react";

export default function CheckoutButton() {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/checkout", { method: "POST" });
            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || "Payment initialization failed");
            }
        } catch (e) {
            console.error(e);
            alert("Error connecting to payment server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={handleCheckout}
            disabled={loading}
        >
            {loading ? "Loading Secure Checkout..." : "Buy The Complete Pack - $29"}
        </button>
    );
}
