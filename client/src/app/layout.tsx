import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthHydrator } from '@/components/AuthHydrator';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MicroSphere',
  description: 'Node.js Microservices Architecture',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthHydrator />
        {children}
      </body>
    </html>
  );
}
