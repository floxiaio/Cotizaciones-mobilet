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
                <p className="mb-2">¿Necesitas ayuda? Llámanos o manda un WhatsApp</p>
                <div className="flex justify-center space-x-4">
                  <a 
                    href="tel:+522224134798" 
                    className="flex items-center text-[var(--primary)] hover:underline"
                    aria-label="Llamar al 2224-13-47-98"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={1.5} 
                      stroke="currentColor" 
                      className="w-5 h-5 mr-1"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.144c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H3.75A2.25 2.25 0 0 0 1.5 4.5Z" 
                      />
                    </svg>
                    <span>2224-13-47-98</span>
                  </a>
                  <a 
                    href="https://wa.me/522224134798" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-green-600 hover:underline"
                    aria-label="Enviar mensaje por WhatsApp"
                  >
                    <svg 
                      height="20" 
                      width="20" 
                      viewBox="0 0 512 512"
                      className="mr-1"
                    >
                      <path fill="#EDEDED" d="M0,512l35.31-128C12.359,344.276,0,300.138,0,254.234C0,114.759,114.759,0,255.117,0S512,114.759,512,254.234S395.476,512,255.117,512c-44.138,0-86.51-14.124-124.469-35.31L0,512z"/>
                      <path fill="#55CD6C" d="M137.71,430.786l7.945,4.414c32.662,20.303,70.621,32.662,110.345,32.662c115.641,0,211.862-96.221,211.862-213.628S371.641,44.138,255.117,44.138S44.138,137.71,44.138,254.234c0,40.607,11.476,80.331,32.662,113.876l5.297,7.945l-20.303,74.152L137.71,430.786z"/>
                      <path fill="#FFFFFF" d="M187.145,135.945l-16.772-0.883c-5.297,0-10.593,1.766-14.124,5.297c-7.945,7.062-21.186,20.303-24.717,37.959c-6.179,26.483,3.531,58.262,26.483,90.041s67.09,82.979,144.772,105.048c24.717,7.062,44.138,2.648,60.028-7.062c12.359-7.945,20.303-20.303,22.952-33.545l2.648-12.359c0.883-3.531-0.883-7.945-4.414-9.71l-55.614-25.6c-3.531-1.766-7.945-0.883-10.593,2.648l-22.069,28.248c-1.766,1.766-4.414,2.648-7.062,1.766c-15.007-5.297-65.324-26.483-92.69-79.448c-0.883-2.648-0.883-5.297,0.883-7.062l21.186-23.834c1.766-2.648,2.648-6.179,1.766-8.828l-25.6-57.379C193.324,138.593,190.676,135.945,187.145,135.945"/>
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Soluciones */}
        <div className="mt-8 text-center text-sm text-[var(--text-secondary)] animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-gray-600 text-sm mb-4">Soluciones en sanitarios portátiles para eventos y construcción. Calidad y servicio en cada baño.</p>
          <p>© {new Date().getFullYear()} Mobilet. Todos los derechos reservados.</p>
          <p className="font-bold mt-2">Powered by floxia.io</p>
        </div>
      </div>
    </div>
  );
}
