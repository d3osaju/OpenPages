import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "apex-grid-929 | Scale Intelligence at Grid Speed",
  description:
    "Apex Grid is the dark-mode SaaS platform for high-performance analytics, orchestration, and growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
