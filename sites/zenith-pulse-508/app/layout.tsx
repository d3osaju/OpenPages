import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
title: "zenith-pulse-508 | Real-time SaaS Intelligence",
description:
"zenith-pulse-508 helps teams monitor, automate, and scale with real-time operational clarity."
};

export default function RootLayout({
children
}: Readonly<{
children: React.ReactNode;
}>) {
return (
<html lang="en">
<body>{children}</body>
</html>
);
}
