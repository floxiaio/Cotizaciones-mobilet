'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

import { Location } from '@/components/ui/MapInput';

// Importar el componente de mapa dinámicamente para evitar problemas de SSR
const MapInput = dynamic(
  () => import('@/components/ui/MapInput'),
  { 
    ssr: false,
    loading: () => <div className="h-[500px] bg-gray-100 flex items-center justify-center">Cargando mapa...</div>
  }
);

interface ExtendedLocation extends Location {
  displayName?: string;
}

export default function TestMapaPage() {
  const [selectedLocation, setSelectedLocation] = useState<ExtendedLocation>({
    lat: 19.0440,  // Lomas de Angelópolis, Puebla
    lng: -98.2445,
    address: 'Lomas de Angelópolis, Puebla, México',
    displayName: 'Lomas de Angelópolis, Puebla, México'
  });

  const handleLocationSelect = (location: Location) => {
    console.log('Ubicación seleccionada:', location);
    setSelectedLocation(prev => ({
      ...prev,
      lat: location.lat,
      lng: location.lng,
      address: location.address || 'Sin dirección',
      displayName: location.address || 'Sin dirección'
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Prueba del Mapa con OpenStreetMap</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Selecciona una ubicación en el mapa</h2>
          
          <div className="mb-6 rounded-lg overflow-hidden border border-gray-200" style={{ height: "500px" }}>
            <MapInput 
              onLocationSelect={handleLocationSelect}
              initialLocation={{
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
                address: selectedLocation.address
              }}
              zoom={13}
              className="border-0"
            />
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium text-blue-800 mb-2">Información de la ubicación seleccionada:</h3>
            <div className="space-y-2">
              <p className="break-words">
                <span className="font-medium">Dirección:</span> {selectedLocation.address || 'No seleccionada'}
              </p>
              <p><span className="font-medium">Latitud:</span> {selectedLocation.lat.toFixed(6)}</p>
              <p><span className="font-medium">Longitud:</span> {selectedLocation.lng.toFixed(6)}</p>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p className="font-medium text-gray-700">Instrucciones:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Haz clic en cualquier parte del mapa para seleccionar una ubicación</li>
              <li>La dirección se actualizará automáticamente</li>
              <li>Puedes acercar/alejar con la rueda del mouse o los controles del mapa</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
