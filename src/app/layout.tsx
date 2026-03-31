import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '900'] });

export const metadata: Metadata = {
  title: "R-DAS — Rosen Dinner Allocation System",
  description: 'The Rosen family dinner tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white min-h-screen`}>{children}</body>
    </html>
  );
}
