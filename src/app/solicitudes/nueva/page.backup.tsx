'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { solicitudService } from '@/lib/services/solicitudService';
import dynamic from 'next/dynamic';

// Importación dinámica del componente MapInput
const MapInput = dynamic(
  () => import('@/components/ui/MapInput').then((mod) => {
    // Definir el tipo Location que espera el componente MapInput
    type MapLocation = {
      lat: number;
      lng: number;
      address?: string;
    };
    
    // Tipar el componente con los props correctos
    const MapInputComponent = mod.default as React.ComponentType<{
      onLocationSelect: (location: MapLocation) => void;
      initialLocation?: MapLocation;
      zoom?: number;
      className?: string;
    }>;
    
    return MapInputComponent;
  }),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p>Cargando mapa...</p>
      </div>
    ),
  }
);

type FormData = {
  nombreCliente: string;
  telefono: string;
  codigoPais: string;
  ubicacion: {
    lat: number;
    lng: number;
    calle: string;
    numeroExterior: string;
    numeroInterior?: string;
    colonia: string;
    ciudad: string;
    estado: string;
    codigoPostal: string;
    pais: string;
    referencias?: string;
    direccionCompleta: string;
    confirmada: boolean;
  };
  cantidadBanos: number;
  tipoRenta: 'obra' | 'evento';
  tipoPago: 'transferencia_bancaria' | 'efectivo';
  requiereFactura: boolean;
  notas?: string;
};

export default function NuevaSolicitudPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    nombreCliente: '',
    telefono: '',
    codigoPais: '+52',
    ubicacion: {
      lat: 0,
      lng: 0,
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      colonia: '',
      ciudad: '',
      estado: '',
      codigoPostal: '',
      pais: 'México',
      referencias: '',
      direccionCompleta: '',
      confirmada: false,
    },
    cantidadBanos: 1,
    tipoRenta: 'obra',
    tipoPago: 'efectivo',
    requiereFactura: false,
    notas: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'cantidadBanos') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 1
      }));
    } else if (name === 'telefono') {
      // Solo números para el teléfono
      setFormData(prev => ({
        ...prev,
        telefono: value.replace(/\D/g, '')
      }));
    } else if (name === 'codigoPais') {
      setFormData(prev => ({
        ...prev,
        codigoPais: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address?: string }) => {
    console.log('Ubicación seleccionada:', location);
    
    // Extraer la dirección completa o usar una cadena vacía si no está definida
    const direccionCompleta = location.address || '';
    
    // Intentar extraer información de la dirección si está disponible
    let calle = '';
    let numeroExterior = '';
    let colonia = '';
    let ciudad = '';
    let estado = '';
    let codigoPostal = '';
    
    // Si hay una dirección, intentar extraer información relevante
    if (direccionCompleta) {
      // Aquí podrías agregar lógica para parsear la dirección si es necesario
      // Por ahora, simplemente usamos la dirección completa como calle
      calle = direccionCompleta;
    }
    
    setFormData(prev => ({
      ...prev,
      ubicacion: {
        ...prev.ubicacion,
        lat: location.lat,
        lng: location.lng,
        direccionCompleta,
        calle,
        numeroExterior,
        numeroInterior: '',
        colonia,
        ciudad,
        estado,
        codigoPostal,
        pais: 'México',
        referencias: '',
        confirmada: false
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ubicacion.confirmada) {
      alert('Por favor confirma la dirección antes de continuar');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const solicitudData = {
        nombre_cliente_o_empresa: formData.nombreCliente,
        telefono_whatsapp: `${formData.codigoPais}${formData.telefono}`,
        direccion: {
          calle: formData.ubicacion.calle,
          numero_exterior: formData.ubicacion.numeroExterior,
          numero_interior: formData.ubicacion.numeroInterior || undefined,
          colonia: formData.ubicacion.colonia,
          ciudad: formData.ubicacion.ciudad,
          estado: formData.ubicacion.estado,
          codigo_postal: formData.ubicacion.codigoPostal,
          pais: formData.ubicacion.pais,
          referencias: formData.ubicacion.referencias || undefined,
          direccion_completa: formData.ubicacion.direccionCompleta,
        },
        latitud: formData.ubicacion.lat,
        longitud: formData.ubicacion.lng,
        direccion_confirmada: formData.ubicacion.confirmada,
        cantidad_banos: formData.cantidadBanos,
        tipo_renta: formData.tipoRenta,
        tipo_pago: formData.tipoPago,
        requiere_factura: formData.requiereFactura,
        notas: formData.notas || undefined,
      };

      await solicitudService.create(solicitudData);
      
      router.push('/solicitudes');
      router.refresh();
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

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
            {/* Sección de Datos del Cliente */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Datos del Cliente</h2>
              <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="nombreCliente" className="block text-sm font-medium text-gray-700">
                    Nombre o Empresa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombreCliente"
                    id="nombreCliente"
                    required
                    value={formData.nombreCliente}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Ingrese su nombre o razón social"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                    Número de WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex gap-2">
                    <div className="w-32">
                      <select
                        name="codigoPais"
                        value={formData.codigoPais}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="+52">🇲🇽 +52</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+34">🇪🇸 +34</option>
                        <option value="+54">🇦🇷 +54</option>
                        <option value="+55">🇧🇷 +55</option>
                        <option value="+56">🇨🇱 +56</option>
                        <option value="+57">🇨🇴 +57</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <input
                        type="tel"
                        name="telefono"
                        id="telefono"
                        required
                        value={formData.telefono}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="55 1234 5678"
                        pattern="[0-9]{8,15}"
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Ejemplo: {formData.codigoPais} 55 1234 5678
                  </p>
                </div>
              </div>
            </div>

            {/* Sección de Ubicación */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ubicación del Servicio</h2>
              
              {/* Mapa */}
              <div className="mb-6">
                <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-300">
                  <MapInput 
                    onLocationSelect={handleLocationSelect}
                    initialLocation={
                      formData.ubicacion.lat && formData.ubicacion.lng 
                        ? { 
                            lat: formData.ubicacion.lat, 
                            lng: formData.ubicacion.lng,
                            address: formData.ubicacion.direccionCompleta
                          } 
                        : undefined
                    }
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">Arrastra el marcador para ajustar la ubicación</p>
              </div>
              
              {/* Dirección detectada */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">Dirección detectada:</p>
                <p className={`text-sm ${formData.ubicacion.direccionCompleta ? 'text-gray-700' : 'text-gray-500 italic'}`}>
                  {formData.ubicacion.direccionCompleta || 'Selecciona una ubicación en el mapa'}
                </p>
              </div>
              
              {/* Campos de dirección */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Detalles de la dirección
                </h3>
                <p className="text-sm text-gray-600 -mt-2">Completa los siguientes campos con la información de la dirección</p>
                
                {/* Mensaje de depuración */}
                <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                  <p className="font-bold">Depuración:</p>
                  <p>Formulario renderizado: {new Date().toLocaleTimeString()}</p>
                  <p>Campos de dirección: {Object.keys(formData.ubicacion).join(', ')}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="calle" className="block text-sm font-medium text-gray-700">
                        Calle <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="calle"
                        name="calle"
                        value={formData.ubicacion.calle}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          ubicacion: { ...prev.ubicacion, calle: e.target.value }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="numeroExterior" className="block text-sm font-medium text-gray-700">
                          No. Ext. <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="numeroExterior"
                          name="numeroExterior"
                          value={formData.ubicacion.numeroExterior}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            ubicacion: { ...prev.ubicacion, numeroExterior: e.target.value }
                          }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="numeroInterior" className="block text-sm font-medium text-gray-700">
                          No. Int.
                        </label>
                        <input
                          type="text"
                          id="numeroInterior"
                          name="numeroInterior"
                          value={formData.ubicacion.numeroInterior || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            ubicacion: { ...prev.ubicacion, numeroInterior: e.target.value }
                          }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="colonia" className="block text-sm font-medium text-gray-700">
                        Colonia <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="colonia"
                        name="colonia"
                        value={formData.ubicacion.colonia}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          ubicacion: { ...prev.ubicacion, colonia: e.target.value }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700">
                        Ciudad <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="ciudad"
                        name="ciudad"
                        value={formData.ubicacion.ciudad}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          ubicacion: { ...prev.ubicacion, ciudad: e.target.value }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                        Estado <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="estado"
                        name="estado"
                        value={formData.ubicacion.estado}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          ubicacion: { ...prev.ubicacion, estado: e.target.value }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-700">
                        Código Postal <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="codigoPostal"
                        name="codigoPostal"
                        value={formData.ubicacion.codigoPostal}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          ubicacion: { ...prev.ubicacion, codigoPostal: e.target.value }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="referencias" className="block text-sm font-medium text-gray-700">
                        Referencias adicionales
                      </label>
                      <input
                        type="text"
                        id="referencias"
                        name="referencias"
                        value={formData.ubicacion.referencias || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          ubicacion: { ...prev.ubicacion, referencias: e.target.value }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Ej: Casa de dos pisos color rojo, portón negro"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="confirmarDireccion"
                      name="ubicacion.confirmada"
                      type="checkbox"
                      checked={formData.ubicacion.confirmada}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          ubicacion: {
                            ...prev.ubicacion,
                            confirmada: e.target.checked
                          }
                        }));
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="confirmarDireccion" className="font-medium text-gray-700">
                      Confirmo que la dirección es correcta <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de Detalles del Servicio */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Detalles del Servicio</h2>
              <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="cantidadBanos" className="block text-sm font-medium text-gray-700">
                    Cantidad de Baños <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="cantidadBanos"
                    name="cantidadBanos"
                    value={formData.cantidadBanos}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'baño' : 'baños'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <p className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Renta <span className="text-red-500">*</span>
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[
                      { value: 'obra', label: '🏗️ Obra' },
                      { value: 'evento', label: '🎉 Evento' },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={`tipoRenta-${option.value}`}
                          name="tipoRenta"
                          type="radio"
                          checked={formData.tipoRenta === option.value}
                          onChange={() => setFormData(prev => ({
                            ...prev,
                            tipoRenta: option.value as 'obra' | 'evento'
                          }))}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                          required
                        />
                        <label
                          htmlFor={`tipoRenta-${option.value}`}
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="tipoPago" className="block text-sm font-medium text-gray-700">
                    Forma de Pago <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="tipoPago"
                    name="tipoPago"
                    value={formData.tipoPago}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="efectivo">💵 Efectivo</option>
                    <option value="transferencia_bancaria">💳 Transferencia Bancaria</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-start">
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
                      <p className="text-gray-500">Marca esta casilla si necesitas factura por el servicio.</p>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="notas" className="block text-sm font-medium text-gray-700">
                    Notas adicionales
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="notas"
                      name="notas"
                      rows={3}
                      value={formData.notas}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Detalles adicionales sobre el servicio requerido"
                      maxLength={500}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.notas?.length || 0}/500 caracteres
                  </p>
                </div>
              </div>
            </div>

            {/* Mensajes de error */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que deseas limpiar el formulario?')) {
                    setFormData({
                      nombreCliente: '',
                      telefono: '',
                      codigoPais: '+52',
                      ubicacion: {
                        lat: 0,
                        lng: 0,
                        calle: '',
                        numeroExterior: '',
                        numeroInterior: '',
                        colonia: '',
                        ciudad: '',
                        estado: '',
                        codigoPostal: '',
                        pais: 'México',
                        referencias: '',
                        direccionCompleta: '',
                        confirmada: false,
                      },
                      cantidadBanos: 1,
                      tipoRenta: 'obra',
                      tipoPago: 'efectivo',
                      requiereFactura: false,
                      notas: '',
                    });
                  }
                }}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Limpiar
              </button>
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
    </div>
  );
}
