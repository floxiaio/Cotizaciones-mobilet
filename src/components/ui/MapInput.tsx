'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuración del ícono del marcador
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Coordenadas del centro de San Andrés Cholula, Puebla
const SAN_ANDRES_CHOLULA = {
  lat: 19.0514,
  lng: -98.3016
};

// Componentes dinámicos para evitar problemas de SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  { ssr: false }
);

export default function MapInput() {
  const [position, setPosition] = useState<[number, number]>([SAN_ANDRES_CHOLULA.lat, SAN_ANDRES_CHOLULA.lng]);
  const [address, setAddress] = useState('Cargando dirección...');
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const isDragging = useRef(false);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  // Función para obtener la dirección a partir de coordenadas
  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener la dirección');
      }
      
      const data = await response.json();
      return data?.features?.[0]?.place_name || 'Ubicación desconocida';
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      return 'No se pudo determinar la dirección';
    }
  };

  // Función para actualizar la posición del marcador y la dirección
  const updateMarkerPosition = async (lat: number, lng: number) => {
    const newPosition: [number, number] = [lat, lng];
    setPosition(newPosition);
    
    // Actualizar la dirección
    try {
      const newAddress = await getAddressFromCoords(lat, lng);
      setAddress(newAddress);
      
      // Notificar al componente padre si es necesario
      // onLocationSelect?.({
      //   lat,
      //   lng,
      //   address: newAddress
      // });
    } catch (error) {
      console.error('Error al actualizar la dirección:', error);
    }
  };

  // Manejador de clic en el mapa
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    console.log('Mapa clickeado en:', { lat, lng });
    
    // Mover el marcador a la posición del clic
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
    
    // Actualizar el estado y la dirección
    updateMarkerPosition(lat, lng);
  };

  // Manejador de arrastre del marcador
  const handleMarkerDragEnd = (e: L.LeafletEvent) => {
    const marker = e.target;
    const { lat, lng } = marker.getLatLng();
    updateMarkerPosition(lat, lng);
  };

  // Cargar la dirección inicial
  useEffect(() => {
    const loadInitialAddress = async () => {
      const initialAddress = await getAddressFromCoords(SAN_ANDRES_CHOLULA.lat, SAN_ANDRES_CHOLULA.lng);
      setAddress(initialAddress);
    };
    
    loadInitialAddress();
  }, []);

  return (
    <div className="relative w-full h-[800px] min-h-[800px] rounded-lg overflow-hidden" style={{ height: '800px' }}>
      {/* Mostrar la dirección actual */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-gray-200 max-w-xs">
        <p className="text-sm text-gray-800 font-medium">
          📍 {address}
        </p>
      </div>

      {/* Mapa */}
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: '800px', width: '100%', minHeight: '800px' }}
        className="z-0"
        ref={(map) => {
          if (map && !mapRef.current) {
            mapRef.current = map;
            // Configurar el manejador de clics después de que el mapa se monte
            map.on('click', (e: L.LeafletMouseEvent) => {
              // Verificar si el clic vino de un control
              const target = e.originalEvent?.target as HTMLElement;
              if (target?.closest('.leaflet-control-zoom, .leaflet-control-zoom-in, .leaflet-control-zoom-out')) {
                return; // Ignorar clics en los controles de zoom
              }
              
              const { lat, lng } = e.latlng;
              console.log('Mapa clickeado en:', { lat, lng });
              
              // Mover el marcador a la posición del clic
              if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
                updateMarkerPosition(lat, lng);
              }
            });
          }
        }}
        zoomControl={false} // Deshabilitar controles por defecto
      >
        {/* Controles de zoom personalizados */}
        <div className="leaflet-top leaflet-right">
          <div className="leaflet-control-zoom leaflet-bar leaflet-control">
            <button 
              type="button"
              className="leaflet-control-zoom-in" 
              title="Acercar"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevenir que el clic llegue al mapa
                if (mapRef.current) mapRef.current.zoomIn(1);
              }}
              onMouseDown={(e) => e.stopPropagation()} // Prevenir arrastre al hacer clic en el botón
            >+</button>
            <button 
              type="button"
              className="leaflet-control-zoom-out" 
              title="Alejar"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevenir que el clic llegue al mapa
                if (mapRef.current) mapRef.current.zoomOut(1);
              }}
              onMouseDown={(e) => e.stopPropagation()} // Prevenir arrastre al hacer clic en el botón
            >−</button>
          </div>
        </div>
        <TileLayer
          url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
          attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
          className="select-none"
        />
        
        <Marker
          position={position}
          icon={defaultIcon}
          ref={markerRef}
          draggable={true}
          eventHandlers={{
            dragend: handleMarkerDragEnd
          }}
        />
      </MapContainer>
    </div>
  );
}