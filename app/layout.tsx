import type { Metadata, Viewport } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'Aura — Feel the Connection',
  description: 'Discover real connections. Swipe, match, and meet people who share your energy.',
  keywords: ['dating', 'match', 'swipe', 'love', 'relationship', 'aura'],
  authors: [{ name: 'Aura' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#07060f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-brand-dark min-h-screen antialiased">
        <I18nProvider>
          <AuthProvider>
            <div className="max-w-md mx-auto min-h-screen relative overflow-hidden">
              {children}
            </div>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
