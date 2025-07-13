'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { solicitudService } from '@/lib/services/solicitudService';

export default function NuevaSolicitudPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState<{
    nombreCliente: string;
    telefono: string;
    codigoPais: string;
    cantidadBanos: number;
    tipoRenta: 'evento' | 'obra';
    tipoPago: 'efectivo' | 'transferencia_bancaria';
    requiereFactura: boolean;
    notas: string;
  }>({
    nombreCliente: '',
    telefono: '',
    codigoPais: '+52',
    cantidadBanos: 1,
    tipoRenta: 'evento',
    tipoPago: 'efectivo',
    requiereFactura: false,
    notas: '',
  });

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const target = e.target as HTMLInputElement;
    
    setFormData(prev => {
      // Si es un checkbox, usamos el estado checked, de lo contrario el valor
      const value = type === 'checkbox' ? target.checked : target.value;
      
      // Para campos numéricos, convertimos el valor a número
      if (name === 'cantidadBanos') {
        return {
          ...prev,
          [name]: Number(value)
        };
      }
      
      // Para los demás campos, usamos el valor directamente
      return {
        ...prev,
        [name]: value
      };
    });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {

      // Preparar los datos para el servicio
      const datosSolicitud = {
        nombre_cliente_o_empresa: formData.nombreCliente,
        telefono_whatsapp: `${formData.codigoPais}${formData.telefono}`,
        cantidad_banos: Number(formData.cantidadBanos),
        tipo_renta: formData.tipoRenta,
        tipo_pago: formData.tipoPago,
        requiere_factura: formData.requiereFactura,
        notas: formData.notas || undefined,
        estado: 'pendiente' as const
      };
      
      // Enviar los datos al servidor
      await solicitudService.create(datosSolicitud);
      
      // Redirigir a la página de éxito o al listado de solicitudes
      router.push('/solicitudes');
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      alert('Ocurrió un error al crear la solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Solicitar Cotización</h1>
          <p className="mt-2 text-sm text-gray-600">
            Completa el siguiente formulario para solicitar una cotización de baños móviles.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow overflow-hidden sm:rounded-lg p-6 space-y-6">
          {/* Sección de Datos del Cliente */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Datos del Cliente</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="nombreCliente" className="block text-sm font-medium text-gray-700">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nombreCliente"
                  name="nombreCliente"
                  value={formData.nombreCliente}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <select
                    name="codigoPais"
                    value={formData.codigoPais}
                    onChange={handleChange}
                    className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                  >
                    <option value="+52">+52 MX</option>
                    <option value="+1">+1 US</option>
                  </select>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          </div>



          {/* Sección de Detalles del Servicio */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Servicio</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="cantidadBanos" className="block text-sm font-medium text-gray-700">
                  Cantidad de baños <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="cantidadBanos"
                  name="cantidadBanos"
                  min="1"
                  value={formData.cantidadBanos}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="tipoRenta" className="block text-sm font-medium text-gray-700">
                  Tipo de renta <span className="text-red-500">*</span>
                </label>
                <select
                  id="tipoRenta"
                  name="tipoRenta"
                  value={formData.tipoRenta}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="evento">Evento</option>
                  <option value="obra">Obra</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="tipoPago" className="block text-sm font-medium text-gray-700">
                  Forma de pago <span className="text-red-500">*</span>
                </label>
                <select
                  id="tipoPago"
                  name="tipoPago"
                  value={formData.tipoPago}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia_bancaria">Transferencia bancaria</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center h-5">
                  <input
                    id="requiereFactura"
                    name="requiereFactura"
                    type="checkbox"
                    checked={formData.requiereFactura}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="requiereFactura" className="font-medium text-gray-700">
                    Requiero factura
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <label htmlFor="notas" className="block text-sm font-medium text-gray-700">
                Notas adicionales (opcional)
              </label>
              <div className="mt-1">
                <textarea
                  id="notas"
                  name="notas"
                  rows={3}
                  value={formData.notas}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Especificaciones adicionales, horarios, etc."
                />
              </div>
            </div>
          </div>
          
          {/* Botón de envío */}
          <div className="pt-6 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
