import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ultra-grid-448 | AI-native Grid Infrastructure",
  description:
    "Scale your SaaS in seconds with ultra-grid-448 — blazing-fast orchestration, observability, and secure global delivery.",
  keywords: [
    "ultra-grid-448",
    "SaaS",
    "cloud infrastructure",
    "grid platform",
    "scaling",
    "observability"
  ],
  openGraph: {
    title: "ultra-grid-448",
    description:
      "Premium AI-native grid infrastructure for modern SaaS teams.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
