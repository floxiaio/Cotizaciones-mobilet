'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import { useMap, useMapEvents } from 'react-leaflet';

// Solución para los iconos de Leaflet
if (typeof window !== 'undefined') {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  // @ts-ignore
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png',
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png',
  });
}

// Coordenadas del centro de San Andrés Cholula, Puebla
const SAN_ANDRES_CHOLULA = {
  lat: 19.0400,
  lng: -98.2476,
  address: 'Centro Comercial Angelópolis, Puebla'
};

// Definir las interfaces de tipos
export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface MapInputProps {
  onLocationSelect?: (location: Location) => void;
  initialLocation?: Location;
  zoom?: number;
  className?: string;
}

// Componente de carga
const Loading = () => (
  <div className="flex items-center justify-center h-full w-full bg-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p>Cargando mapa...</p>
    </div>
  </div>
);

// Importar dinámicamente los componentes de Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => {
    // Asegurarse de que Leaflet solo se cargue en el cliente
    if (typeof window !== 'undefined') {
      return mod.MapContainer;
    }
    return () => null;
  }),
  { 
    ssr: false,
    loading: () => <Loading />
  }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
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

// Componente personalizado para los controles de zoom
const CustomZoomControl = () => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    // Crear un contenedor personalizado para los controles
    const zoomControl = L.control.zoom({
      position: 'topright',
    });
    
    // Agregar estilos personalizados al contenedor de controles
    const originalAddTo = zoomControl.addTo;
    zoomControl.addTo = function(map) {
      originalAddTo.call(this, map);
      const container = this.getContainer();
      if (container) {
        container.style.margin = '10px';
        container.style.borderRadius = '4px';
        container.style.overflow = 'hidden';
        container.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
      }
      return this;
    };
    
    zoomControl.addTo(map);
    
    return () => {
      zoomControl.remove();
    };
  }, [map]);
  
  return null;
};

// Envolver el componente en un dynamic para evitar problemas de SSR
const DynamicZoomControl = dynamic(
  () => Promise.resolve(CustomZoomControl),
  { ssr: false }
);

// Configuración del ícono del marcador
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Componente para manejar los clics en el mapa
const MapClickHandler = ({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) => {
  useMapEvents({
    click: onMapClick
  });
  return null;
};

const MapInput: React.FC<MapInputProps> = ({
  onLocationSelect = () => {},
  initialLocation = { ...SAN_ANDRES_CHOLULA, address: '' },
  zoom = 14,
  className = ''
}) => {
  const [isClient, setIsClient] = useState(false);
  const [position, setPosition] = useState<[number, number]>([
    initialLocation.lat || SAN_ANDRES_CHOLULA.lat,
    initialLocation.lng || SAN_ANDRES_CHOLULA.lng
  ]);
  const [address, setAddress] = useState(initialLocation.address || 'Cargando dirección...');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const mapRef = useRef<L.Map>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const isDragging = useRef(false);

  // Inicializar el estado del cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cargar la dirección inicial cuando el componente se monte
  useEffect(() => {
    const loadInitialAddress = async () => {
      try {
        setIsLoading(true);
        const lat = initialLocation.lat || SAN_ANDRES_CHOLULA.lat;
        const lng = initialLocation.lng || SAN_ANDRES_CHOLULA.lng;
        
        // Solo cargar si no tenemos una dirección o si las coordenadas han cambiado
        if (address === 'Cargando dirección...' || 
            position[0] !== lat || 
            position[1] !== lng) {
          const initialAddress = await getAddressFromCoords(lat, lng);
          setAddress(initialAddress);
          setPosition([lat, lng]);
          onLocationSelect({
            lat,
            lng,
            address: initialAddress
          });
        }
      } catch (err) {
        console.error('Error al cargar la dirección inicial:', err);
        setError('Error al cargar la dirección inicial');
      } finally {
        setIsLoading(false);
      }
    };

    if (isClient) {
      loadInitialAddress();
    }
  }, [isClient]); // Solo dependemos de isClient

  // Función para obtener la dirección a partir de coordenadas
  const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('No se pudo obtener la dirección');
      }
      
      const data = await response.json();
      return data.features[0]?.place_name || 'Dirección no disponible';
    } catch (err) {
      console.error('Error al obtener la dirección:', err);
      return 'Error al cargar la dirección';
    }
  };

  // Manejador de clic en el mapa
  const handleMapClick = useCallback(async (e: L.LeafletMouseEvent) => {
    // Si hay un arrastre en curso, no hacer nada
    if (isDragging.current) {
      isDragging.current = false;
      return;
    }
    
    const { lat, lng } = e.latlng;
    
    // Actualizar la posición del marcador
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
    
    // Actualizar el estado
    setPosition([lat, lng]);
    
    try {
      setIsLoading(true);
      const newAddress = await getAddressFromCoords(lat, lng);
      setAddress(newAddress);
      onLocationSelect({ lat, lng, address: newAddress });
    } catch (err) {
      setError('Error al actualizar la ubicación');
      console.error('Error al actualizar la ubicación:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onLocationSelect]);

  // Manejador de arrastre del marcador
  const handleMarkerDragEnd = useCallback(async (e: L.LeafletEvent) => {
    isDragging.current = true;
    const { lat, lng } = e.target.getLatLng();
    setPosition([lat, lng]);
    
    try {
      setIsLoading(true);
      const newAddress = await getAddressFromCoords(lat, lng);
      setAddress(newAddress);
      onLocationSelect({ lat, lng, address: newAddress });
    } catch (err) {
      setError('Error al actualizar la ubicación');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [onLocationSelect]);

  // Si no estamos en el cliente, mostrar el estado de carga
  if (!isClient) {
    return <Loading />;
  }

  return (
    <div className={`relative ${className}`} style={{ height: '400px' }}>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        zoomControl={false} // Deshabilitar el control de zoom por defecto
        whenReady={() => {
          // Asegurarse de que el mapa esté completamente cargado
          if (mapRef.current) {
            mapRef.current.invalidateSize();
          }
        }}
      >
        <MapClickHandler onMapClick={handleMapClick} />
        <TileLayer
          url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
          attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
          errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        />
        
        {/* Componente de controles personalizados */}
        <DynamicZoomControl />
        <Marker
          position={position}
          icon={defaultIcon}
          draggable={true}
          eventHandlers={{
            dragend: handleMarkerDragEnd,
            click: () => {
              // Manejar clic en el marcador si es necesario
            }
          }}
          ref={(ref) => {
            if (ref) {
              markerRef.current = ref;
            }
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-medium">Ubicación seleccionada</p>
              <p className="text-gray-600">{address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      
      {error && (
        <div className="absolute bottom-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      
      <div className="absolute top-4 left-4 max-w-xs z-[1000] bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200">
        <p className="text-xs text-gray-800 font-medium line-clamp-2">
          {isLoading ? (
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></span>
              <span>Actualizando ubicación...</span>
            </span>
          ) : (
            `📍 ${address}`
          )}
        </p>
      </div>
    </div>
  );
};

export default MapInput;
