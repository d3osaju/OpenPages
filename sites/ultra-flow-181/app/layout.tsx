import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ultra Flow 181',
  description: 'Corporate-grade workflow acceleration platform.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
