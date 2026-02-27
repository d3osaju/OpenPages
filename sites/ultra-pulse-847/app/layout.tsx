import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ultra-pulse-847 | AI-Powered Growth Infrastructure",
  description:
    "ultra-pulse-847 helps teams orchestrate growth, automate insights, and scale faster with real-time intelligence."
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
