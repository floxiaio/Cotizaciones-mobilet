'use client';

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuración de MapTiler
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || '';
const MAPTILER_STYLE = 'streets'; // Puedes cambiarlo a 'basic', 'bright', 'dark', etc.
const MAPTILER_URL = `https://api.maptiler.com/maps/${MAPTILER_STYLE}/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`;

// Coordenadas por defecto (San Andrés Cholula, Puebla)
const DEFAULT_CENTER: [number, number] = [19.0519, -98.3032];
const DEFAULT_ZOOM = 14;

// Configuración de íconos
const icon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Configuración de íconos por defecto
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png',
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png',
  });
}

// Importar dinámicamente los componentes de Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => {
    const { MapContainer } = mod;
    return MapContainer;
  }),
  { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Cargando mapa...</div>
  }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => {
    const { TileLayer } = mod;
    return function MaptilerTileLayer() {
      return (
        <TileLayer
          url={MAPTILER_URL}
          attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        />
      );
    };
  }),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface MapInputProps {
  onLocationSelect: (location: Location) => void;
  initialLocation?: Location;
  zoom?: number;
  className?: string;
}

const MapInput = ({
  onLocationSelect,
  initialLocation,
  zoom = DEFAULT_ZOOM,
  className = ''
}: MapInputProps) => {
  const [position, setPosition] = useState<[number, number]>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : DEFAULT_CENTER
  );
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // Actualizar ubicación y obtener dirección usando MapTiler
  const updateLocation = useCallback(async (lat: number, lng: number) => {
    console.log('Iniciando updateLocation con coordenadas:', { lat, lng });
    setIsLoading(true);
    
    try {
      console.log('Intentando con MapTiler...');
      const maptilerUrl = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_KEY}&language=es&limit=1`;
      console.log('URL de MapTiler:', maptilerUrl);
      
      const response = await fetch(maptilerUrl, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('Respuesta de MapTiler recibida. Estado:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la respuesta de MapTiler:', response.status, errorText);
        throw new Error(`Error al obtener la dirección: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Datos de MapTiler:', data);
      
      // Extraer la dirección del primer resultado
      const feature = data.features?.[0];
      console.log('Feature de MapTiler:', feature);
      
      let displayName = 'Ubicación seleccionada';
      
      if (feature) {
        const props = feature.properties || {};
        console.log('Propiedades de la dirección:', props);
        
        // Usar la dirección completa de MapTiler si está disponible
        displayName = (feature as any).place_name_es || (feature as any).place_name || '';
        
        // Si no hay dirección completa, construir una
        if (!displayName) {
          const context = (feature as any).context || [];
          const addressParts = [
            props.address || props.name || props.street || '',
            props.housenumber || '',
            context.find((c: any) => c.id.includes('neighborhood'))?.text || '',
            context.find((c: any) => c.id.includes('locality'))?.text || '',
            context.find((c: any) => c.id.includes('place'))?.text || '',
            context.find((c: any) => c.id.includes('region'))?.text || '',
            context.find((c: any) => c.id.includes('postcode'))?.text || '',
            context.find((c: any) => c.id.includes('country'))?.text || ''
          ].filter(Boolean);
          
          displayName = addressParts.join(', ');
        }
        
        console.log('Dirección formateada:', displayName);
      } else {
        // Si no hay resultados, usar las coordenadas
        displayName = `Ubicación (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
        console.log('No se encontraron características, usando coordenadas:', displayName);
      }
      
      setAddress(displayName);
      
      onLocationSelect({
        lat,
        lng,
        address: displayName
      });
      
      console.log('Dirección actualizada exitosamente');
      
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      
      // En caso de error, intentar con OpenStreetMap como respaldo
      try {
        console.log('Intentando con OpenStreetMap como respaldo...');
        const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=es`;
        console.log('URL de OpenStreetMap:', osmUrl);
        
        const fallbackResponse = await fetch(osmUrl, {
          headers: {
            'User-Agent': 'cotizaciones-mobilet/1.0',
            'Accept': 'application/json'
          }
        });
        
        console.log('Respuesta de OpenStreetMap recibida. Estado:', fallbackResponse.status);
        
        if (!fallbackResponse.ok) {
          throw new Error(`Error en la respuesta de OpenStreetMap: ${fallbackResponse.status}`);
        }
        
        const fallbackData = await fallbackResponse.json();
        console.log('Datos de OpenStreetMap:', fallbackData);
        
        const fallbackAddress = fallbackData.display_name || `Ubicación (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
        console.log('Dirección de respaldo:', fallbackAddress);
        
        setAddress(fallbackAddress);
        onLocationSelect({
          lat,
          lng,
          address: fallbackAddress
        });
        
      } catch (fallbackError) {
        console.error('Error al obtener la dirección de respaldo:', fallbackError);
        const coordinatesAddress = `Ubicación (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
        console.log('Usando solo coordenadas:', coordinatesAddress);
        
        setAddress(coordinatesAddress);
        onLocationSelect({
          lat,
          lng,
          address: coordinatesAddress
        });
      }
    } finally {
      console.log('Finalizando updateLocation');
      setIsLoading(false);
    }
  }, [onLocationSelect]);

  // Manejar clic en el mapa
  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
    if (isLoading) return;
    const { lat, lng } = e.latlng;
    setPosition([lat, lng]);
    updateLocation(lat, lng);
  }, [isLoading, updateLocation]);

  // Manejar arrastre del marcador
  const handleMarkerDragEnd = useCallback((e: L.LeafletEvent) => {
    if (isLoading) return;
    const marker = e.target as L.Marker;
    const { lat, lng } = marker.getLatLng();
    setPosition([lat, lng]);
    updateLocation(lat, lng);
  }, [isLoading, updateLocation]);

  // Inicializar con la ubicación inicial
  useEffect(() => {
    if (initialLocation) {
      setPosition([initialLocation.lat, initialLocation.lng]);
      if (initialLocation.address) {
        setAddress(initialLocation.address);
      } else {
        updateLocation(initialLocation.lat, initialLocation.lng);
      }
    }
  }, [initialLocation, updateLocation]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Contenedor del mapa */}
      <div className="w-full h-full" style={{ height: '100%' }}>
        <MapContainer
          center={position}
          zoom={zoom}
          style={{ height: '100%', width: '100%', position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
          zoomControl={true}
          className="z-0"
          whenReady={() => {
            const map = mapRef.current;
            if (map) {
              // Forzar un pequeño retraso para asegurar que el mapa esté completamente cargado
              setTimeout(() => {
                map.invalidateSize();
              }, 100);
            }
          }}
          ref={(map) => {
            if (map) {
              mapRef.current = map;
            }
          }}
        >
          <TileLayer />
          <Marker
            position={position}
            icon={icon}
            draggable={!isLoading}
            eventHandlers={{
              dragend: handleMarkerDragEnd,
            }}
          >
            <Popup>
              <div className="text-sm">
                {isLoading ? 'Cargando...' : address}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Controles de zoom personalizados */}
      <div className="absolute bottom-4 right-4 z-[1000] flex flex-col space-y-2">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
          aria-label="Acercar"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
          aria-label="Alejar"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      </div>

      {/* Indicador de carga */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="text-gray-700">Obteniendo dirección...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapInput;
