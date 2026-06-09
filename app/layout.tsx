import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Discordium — Find Your Match',
  description: 'A modern dating app combining swipe matching, browse, and real connections.',
  keywords: ['dating', 'match', 'swipe', 'love', 'relationship'],
  authors: [{ name: 'Discordium' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f0a1a',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-brand-dark min-h-screen antialiased">
        <div className="max-w-md mx-auto min-h-screen relative overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
