'use client';

import { useEffect, useState } from 'react';
import { solicitudService } from '@/lib/services/solicitudService';

export default function DBTestPage() {
  const [message, setMessage] = useState('Probando conexión con Supabase...');
  const [solicitudes, setSolicitudes] = useState<any[]>([]);

  useEffect(() => {
    async function testConnection() {
      try {
        // Probamos obtener las solicitudes existentes
        const data = await solicitudService.getAll();
        setSolicitudes(data || []);
        setMessage('✅ Conexión exitosa con Supabase');
      } catch (error) {
        console.error('Error:', error);
        setMessage(`❌ Error al conectar con Supabase: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Prueba de Conexión con Supabase</h1>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-md">
          <p className="font-medium">{message}</p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Solicitudes existentes:</h2>
          {solicitudes.length === 0 ? (
            <p>No hay solicitudes en la base de datos.</p>
          ) : (
            <div className="space-y-4">
              {solicitudes.map((solicitud) => (
                <div key={solicitud.id} className="p-4 border rounded-md">
                  <p><span className="font-medium">ID:</span> {solicitud.id}</p>
                  <p><span className="font-medium">Cliente:</span> {solicitud.nombre_cliente_o_empresa}</p>
                  <p><span className="font-medium">Teléfono:</span> {solicitud.telefono_whatsapp}</p>
                  <p><span className="font-medium">Estado:</span> {solicitud.estado}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
