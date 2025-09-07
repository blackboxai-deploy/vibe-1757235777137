import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from './providers/session-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LoveOS - Where Psychology Meets AI',
  description: 'Psychology-driven compatibility platform for meaningful connections',
  keywords: ['dating', 'psychology', 'compatibility', 'relationships', 'AI'],
  authors: [{ name: 'LoveOS Team' }],
  creator: 'LoveOS',
  publisher: 'LoveOS',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://loveos.app',
    title: 'LoveOS - Where Psychology Meets AI',
    description: 'Psychology-driven compatibility platform for meaningful connections',
    siteName: 'LoveOS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LoveOS - Where Psychology Meets AI',
    description: 'Psychology-driven compatibility platform for meaningful connections',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
            <main className="relative">
              {children}
            </main>
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'white',
                border: '1px solid #e5e7eb',
                color: '#374151',
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}