import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "neon-grid-46 | Build faster with intelligent infrastructure",
  description:
    "Premium SaaS platform for teams shipping modern products with speed, reliability, and clarity."
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
