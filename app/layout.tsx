import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Mehran Khan - Coming Soon',
  description: 'Building the future, one line at a time. Something amazing is coming soon.',
  keywords: ['Mehran Khan', 'developer', 'coming soon', 'portfolio'],
  authors: [{ name: 'Mehran Khan' }],
  creator: 'Mehran Khan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Mehran Khan - Coming Soon',
    description: 'Building the future, one line at a time. Something amazing is coming soon.',
    siteName: 'Mehran Khan',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mehran Khan - Coming Soon',
    description: 'Building the future, one line at a time. Something amazing is coming soon.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
