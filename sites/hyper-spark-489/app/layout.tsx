import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "hyper-spark-489 — Kinetic Launch Engine",
  description: "Kinetic product launch operating system for teams that ship fast and convert faster."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
