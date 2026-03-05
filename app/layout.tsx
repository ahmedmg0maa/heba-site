import type { Metadata } from 'next';
import { Providers } from './providers';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Heba | Professional Coach & Educator',
  description: 'Transform your life with personalized coaching, online courses, and expert guidance from Heba — professional coach and educator.',
  keywords: 'coaching, personal development, online courses, life coach, Egypt, Arabic, تدريب, كوتشينج',
  openGraph: {
    title: 'Heba | Professional Coach & Educator',
    description: 'Transform your life with personalized coaching and expert guidance.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Cairo:wght@300;400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
