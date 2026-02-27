import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "lunar-spark-308 | Ignite Growth at Lunar Speed",
  description:
    "lunar-spark-308 is a premium SaaS platform for teams who want automation, insights, and growth in one lightning-fast workflow.",
  keywords: ["SaaS", "automation", "analytics", "productivity", "lunar-spark-308"]
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
