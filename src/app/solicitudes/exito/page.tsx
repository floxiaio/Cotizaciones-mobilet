'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SolicitudExitosa() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al inicio después de 5 segundos
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mt-3 text-2xl font-bold text-gray-900">
          ¡Solicitud Enviada con Éxito!
        </h2>
        <p className="mt-2 text-gray-600">
          Hemos recibido tu solicitud de cotización. Nos pondremos en contacto contigo a la brevedad.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Volver al inicio
          </button>
        </div>
        <p className="mt-3 text-sm text-gray-500">
          Serás redirigido automáticamente en 5 segundos...
        </p>
      </div>
    </div>
  );
}
