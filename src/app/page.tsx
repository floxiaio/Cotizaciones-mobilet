'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Cargar el formulario dinámicamente para evitar problemas de hidratación
const SolicitudForm = dynamic(
  () => import('@/components/forms/SolicitudForm'),
  { ssr: false }
);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFormSubmitSuccess = () => {
    setFormSubmitted(true);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        {/* Encabezado */}
        <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
            Cotización de Baños Portátiles
          </h1>
          <p className="text-[var(--text-secondary)]">
            Completa el formulario y un especialista del equipo Mobilet se pondrá en contacto contigo para validar datos y confirmar el servicio en menos de 24 hrs.
          </p>
        </div>

        {/* Tarjeta del formulario */}
        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="p-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-xl">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 md:p-8">
              {!formSubmitted && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                      Solicita tu cotización
                    </h2>
                    <p className="text-[var(--text-secondary)] mt-1">
                      Llena los datos y nos pondremos en contacto contigo
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <SolicitudForm onSubmitSuccess={handleFormSubmitSuccess} />
                  </div>
                </>
              )}
              
              {formSubmitted && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                    ¡Gracias por tu solicitud!
                  </h2>
                  <p className="text-[var(--text-secondary)] mb-6">
                    Hemos recibido tu información y nos pondremos en contacto contigo a la brevedad.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Enviar otra cotización
                  </button>
                </div>
              )}
              
              <div className="mt-8 text-center text-sm text-[var(--text-secondary)]">
                <p className="whitespace-nowrap">
                  ¿Necesitas ayuda? Llámanos al{' '}
                  <a href="tel:+525555555555" className="text-[var(--primary)] hover:underline whitespace-nowrap">
                    55-5555-5555
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pie de página */}
        <div className="mt-8 text-center text-sm text-[var(--text-secondary)] animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p>© {new Date().getFullYear()} Mobilet. Todos los derechos reservados. <span className="text-xs">Powered by floxia.io</span></p>
        </div>
      </div>
    </div>
  );
}
