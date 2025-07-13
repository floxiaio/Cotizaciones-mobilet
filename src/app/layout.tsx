'use client';

import { Inter } from 'next/font/google';
import '../styles/globals.css';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import SupabaseProvider from '@/components/supabase-provider';
import MainLayout from '@/components/layout/MainLayout';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Asegurarse de que el viewport se configure correctamente
    const setViewportMeta = () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
      }
    };

    setViewportMeta();
  }, []);

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <title>Mobilet - Soluciones en sanitarios portátiles</title>
        <meta name="description" content="Servicio profesional de renta de baños portátiles para eventos y construcción" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#0f6395" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SupabaseProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </SupabaseProvider>
      </body>
    </html>
  );
}
