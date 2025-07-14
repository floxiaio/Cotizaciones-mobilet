'use client';

import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import SupabaseProvider from '@/components/supabase-provider';
import MainLayout from '@/components/layout/MainLayout';

// Importar estilos de Leaflet
import 'leaflet/dist/leaflet.css';

// Importar estilos de react-toastify
import 'react-toastify/dist/ReactToastify.css';

// Configuración de la fuente Inter
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

// Obtener el nombre de la familia de fuentes de manera segura
const fontFamily = inter.style?.fontFamily || 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Asegurarse de que el viewport se configure correctamente
  useEffect(() => {
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
        <style jsx global>{`
          :root {
            --font-inter: ${fontFamily};
          }
          body {
            font-family: ${fontFamily}, sans-serif;
          }
        `}</style>
      </head>
      <body className="font-sans antialiased">
        <SupabaseProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </SupabaseProvider>
      </body>
    </html>
  );
}
