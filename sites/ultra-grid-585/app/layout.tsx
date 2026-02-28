import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ultra-grid-585 | Neo-Geo Command Surface",
  description: "ultra-grid-585 is a high-contrast operating layer for modern teams that move fast and ship boldly."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
