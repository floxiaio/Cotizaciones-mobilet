import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Mobilet - Soluciones en sanitarios portátiles',
  description: 'Servicio profesional de renta de baños portátiles para eventos y construcción',
  keywords: ['baños portátiles', 'sanitarios portátiles', 'renta de baños', 'eventos', 'construcción'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mobilet - Soluciones en sanitarios portátiles',
    description: 'Servicio profesional de renta de baños portátiles para eventos y construcción',
    url: '/',
    siteName: 'Mobilet',
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobilet - Soluciones en sanitarios portátiles',
    description: 'Servicio profesional de renta de baños portátiles para eventos y construcción',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0f6395',
  colorScheme: 'light',
};
