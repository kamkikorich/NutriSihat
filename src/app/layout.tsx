import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Metadata for PWA - Bahasa Malaysia
export const metadata: Metadata = {
  title: 'NutriSihat | Panduan Pemakanan untuk Kesihatan Mak',
  description: 'Aplikasi panduan pemakanan untuk ibu dengan Diabetes dan masalah kesihatan uterus. Dapatkan nasihat pemakanan dalam Bahasa Malaysia.',
  keywords: ['diabetes', 'uterus', 'pemakanan', 'kesihatan', 'Malaysia', 'Bahasa Malaysia', 'kencing manis', 'nutrisihat'],
  authors: [{ name: 'NutriSihat Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NutriSihat',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'NutriSihat',
    title: 'NutriSihat | Panduan Pemakanan untuk Kesihatan Mak',
    description: 'Aplikasi panduan pemakanan untuk ibu dengan Diabetes dan masalah kesihatan uterus.',
  },
  twitter: {
    card: 'summary',
    title: 'NutriSihat | Panduan Pemakanan untuk Kesihatan Mak',
    description: 'Aplikasi panduan pemakanan untuk ibu dengan Diabetes dan masalah kesihatan uterus.',
  },
};

// Mobile-first viewport settings
export const viewport: Viewport = {
  themeColor: '#1E3A5F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow zoom for accessibility
  userScalable: true, // Allow zoom for elderly users who need larger text
  viewportFit: 'cover', // Support for notched devices
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="ms" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Safe area support for notched devices */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${inter.className} antialiased bg-background text-foreground min-h-screen`}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}