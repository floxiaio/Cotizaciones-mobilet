import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

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
      
      <Footer />
      
      {/* Elementos decorativos */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-96 -right-96 w-[800px] h-[800px] rounded-full bg-[var(--primary)] opacity-5 -z-10 animate-float"></div>
        <div className="absolute -bottom-64 -left-64 w-[600px] h-[600px] rounded-full bg-[var(--secondary)] opacity-5 -z-10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}
