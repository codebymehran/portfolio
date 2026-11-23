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
  metadataBase: new URL('https://mehrankhan.net'),
  title: 'Mehran Khan | Full-Stack · AI Engineer · LLM Developer',
  description:
    'I went quiet. I never stopped. Mehran Khan is a full-stack and AI engineer building something new. Stay tuned.',
  keywords: ['Mehran Khan', 'full-stack developer', 'AI engineer', 'LLM developer'],
  authors: [{ name: 'Mehran Khan' }],
  creator: 'Mehran Khan',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Mehran Khan | I went quiet. I never stopped.',
    description: 'Full-stack · AI engineer · LLM developer. Something is being built. Stay tuned.',
    siteName: 'Mehran Khan',
    images: [{ url: '/mehran2.jpeg', alt: 'Mehran Khan' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mehran Khan | I went quiet. I never stopped.',
    description: 'Full-stack · AI engineer · LLM developer. Something is being built. Stay tuned.',
    images: ['/mehran2.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#060509',
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
