'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Importar componentes dinámicamente para asegurar que se carguen solo en el cliente
const Header = dynamic(() => import('./Header'), { ssr: false });

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Contenido principal con padding para el header fijo */}
      <main className="flex-grow pt-16">
        {children}
      </main>
      
      {/* Estilos globales para el layout */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      
      {/* Elementos decorativos */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-96 -right-96 w-[800px] h-[800px] rounded-full bg-[var(--primary)] opacity-5 -z-10 animate-float"></div>
        <div className="absolute -bottom-64 -left-64 w-[600px] h-[600px] rounded-full bg-[var(--secondary)] opacity-5 -z-10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}
