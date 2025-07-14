'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import { useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Interfaz para la respuesta de geocodificación inversa
interface GeocodingFeatureProperties {
  housenumber?: string;
  street?: string;
  locality?: string;
  city?: string;
  postcode?: string;
  [key: string]: any;
}

interface GeocodingFeature {
  place_name: string;
  center: [number, number];
  properties: GeocodingFeatureProperties;
}

interface GeocodingResult {
  features: GeocodingFeature[];
}

// Estilos globales para el mapa
const mapStyles = `
  .leaflet-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
    overflow: hidden;
    border-radius: 8px !important;
  }
  .leaflet-bar {
    border: none !important;
  }
  .leaflet-bar a {
    width: 32px !important;
    height: 32px !important;
    line-height: 30px !important;
    border: 1px solid #e5e7eb !important;
    border-bottom: none !important;
    transition: all 0.2s ease;
  }
  .leaflet-bar a:first-child {
    border-top-left-radius: 8px !important;
    border-top-right-radius: 8px !important;
  }
  .leaflet-bar a:last-child {
    border-bottom-left-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
    border-bottom: 1px solid #e5e7eb !important;
  }
  .leaflet-bar a:hover {
    background-color: #f9fafb !important;
  }
`;

// Estilos para el tooltip personalizado
const tooltipStyles = `
  .custom-tooltip {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 500;
    color: #1a202c;
    white-space: nowrap;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    pointer-events: none;
    transform: translateY(-10px);
  }
  .custom-tooltip:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    width: 10px;
    height: 10px;
    background: white;
    border-right: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    transform: translateX(-50%) rotate(45deg);
  }
`;

// Agregar estilos al head del documento
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = mapStyles + tooltipStyles;
  document.head.appendChild(styleElement);
}

// Coordenadas por defecto (San Andrés Cholula, Puebla)
const DEFAULT_CENTER: [number, number] = [19.0514, -98.3272];

// Configuración de MapTiler
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || '';

    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Componente de carga mejorado
const MapLoading = () => (
  <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center z-10 space-y-4">
    <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
    <p className="text-gray-600 font-medium">Cargando mapa...</p>
    <p className="text-sm text-gray-400">Por favor espera un momento</p>
  </div>
);

// Definir los componentes dinámicos
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <MapLoading /> }
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

const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  { ssr: false }
);

// Componente para manejar eventos del mapa
const MapEvents = ({ 
  onMapMove, 
  onClick 
}: { 
  onMapMove: (map: L.Map) => void;
  onClick: (e: L.LeafletMouseEvent) => void; 
}) => {
  const map = useMapEvents({
    move() {
      onMapMove(map);
    },
    click(e) {
      // Solo manejar clic si no es en el marcador
      if (!e.originalEvent.defaultPrevented) {
        onClick(e);
      }
    },
  });

  return null;
};

// Tipos para las props
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
  initialLocation = { lat: 19.24647, lng: -98.3942, address: 'Lomas de Angelópolis, Puebla' },
  zoom = 15,
  className = ''
}: MapInputProps) => {
  // Estados
  const [isClient, setIsClient] = useState(false);
  const [position, setPosition] = useState<[number, number]>([initialLocation.lat, initialLocation.lng]);
  const [address, setAddress] = useState(initialLocation.address || '');
  
  // Referencias
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Efectos
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Función para obtener la dirección a partir de coordenadas
  const getAddressFromCoords = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_KEY}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from MapTiler:', errorData);
        throw new Error('Error al obtener la dirección');
      }
      
      const data = await response.json();
      
      // Usar la dirección formateada directamente desde la API
      if (data.features && data.features.length > 0) {
        return data.features[0].place_name || `Ubicación (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
      }
      
      return `Ubicación (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
    } catch (error) {
      console.error('Error en geocodificación inversa:', error);
      return `Ubicación (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
    }
  }, []);

  // Función para actualizar la dirección mostrada
  const updateMarkerTooltip = useCallback((marker: L.Marker, text: string) => {
    if (marker) {
      // Actualizar el estado de la dirección
      setAddress(text || 'Ubicación seleccionada');
      // Eliminar cualquier tooltip existente
      marker.unbindTooltip();
    }
  }, []);

  // Función para manejar el movimiento del marcador
  const handleMarkerMove = useCallback(async (e: { latlng: L.LatLng } | L.LeafletEvent) => {
    let lat: number, lng: number;
    let marker: L.Marker | undefined;
    
    if ('latlng' in e) {
      lat = e.latlng.lat;
      lng = e.latlng.lng;
    } else {
      marker = e.target as L.Marker;
      const position = marker.getLatLng();
      lat = position.lat;
      lng = position.lng;
    }
    
    setPosition([lat, lng]);
    
    // Mostrar coordenadas temporalmente
    const coords = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    setAddress('Cargando dirección...');
    
    // Actualizar tooltip temporal
    if (marker) {
      updateMarkerTooltip(marker, 'Cargando dirección...');
    }
    
    // Obtener dirección en segundo plano
    getAddressFromCoords(lat, lng).then(address => {
      setAddress(address);
      
      // Actualizar tooltip con la dirección
      if (marker) {
        updateMarkerTooltip(marker, address);
      }
      
      onLocationSelect({
        lat,
        lng,
        address
      });
    });
  }, [onLocationSelect]);

  // Función para manejar el clic en el mapa
  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
    if (markerRef.current) {
      const { lat, lng } = e.latlng;
      markerRef.current.setLatLng([lat, lng]);
      handleMarkerMove({
        target: markerRef.current,
        latlng: e.latlng
      } as L.LeafletMouseEvent);
    }
  }, [handleMarkerMove]);

  // Efecto para configurar el marcador inicial
  useEffect(() => {
    if (mapRef.current && initialLocation) {
      const { lat, lng } = initialLocation;
      setPosition([lat, lng]);
      
      // Mostrar dirección si existe, de lo contrario cargarla
      if (initialLocation.address) {
        setAddress(initialLocation.address);
      } else {
        setAddress('Cargando dirección...');
        getAddressFromCoords(lat, lng).then(address => {
          setAddress(address);
          if (markerRef.current) {
            updateMarkerTooltip(markerRef.current, address);
          }
        });
      }
      
      // Asegurarse de que el mapa esté centrado en la ubicación inicial
      mapRef.current.flyTo([lat, lng], 15, {
        duration: 0.5
      });
    }
  }, [initialLocation]);

  if (!isClient) {
    return (
      <div className={`relative h-[400px] w-full ${className} bg-gray-100 flex items-center justify-center`}>
        <div className="animate-pulse text-gray-500">Cargando mapa...</div>
      </div>
    );
  }

  return (
    <div className={"relative w-full h-full " + className}>
      {/* Indicador de dirección fijo */}
      <div className="absolute top-2 left-0 right-0 z-[1000] px-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 max-w-md mx-auto border border-gray-200">
          <p className="text-sm font-medium text-gray-800 truncate">
            {address || 'Arrastra el marcador para seleccionar una ubicación'}
          </p>
        </div>
      </div>
      
      <div className="absolute inset-0 z-0" ref={mapContainerRef}>
        <MapContainer
          center={position}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          whenReady={() => {
            const map = mapRef.current;
            if (map) {
              // Habilitar interacciones
              map.dragging.enable();
              map.touchZoom.enable();
              map.doubleClickZoom.enable();
              map.scrollWheelZoom.enable();
            }
          }}
          ref={(map) => {
            mapRef.current = map || null;
          }}
        >
          <TileLayer
            url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
            attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>'
          />
          
          <Marker
            position={position}
            draggable={true}
            eventHandlers={{
              dragend: handleMarkerMove,
              mousedown: (e: L.LeafletMouseEvent) => {
                L.DomEvent.stopPropagation(e);
              },
              click: (e: L.LeafletMouseEvent) => {
                L.DomEvent.stopPropagation(e);
              },
              dblclick: (e: L.LeafletMouseEvent) => {
                L.DomEvent.stopPropagation(e);
              }
            }}
            ref={(ref: L.Marker) => {
              if (ref) {
                markerRef.current = ref;
                // Configurar tooltip inicial
                if (initialLocation?.address) {
                  updateMarkerTooltip(ref, initialLocation.address);
                }
              }
            }}
          >
            <Tooltip permanent direction="top" offset={[0, -20]}>
              {address || 'Ubicación seleccionada'}
            </Tooltip>
          </Marker>
          
          <ZoomControl position="bottomright" />
          
          {/* Botón para centrar en la ubicación actual */}
          <div className="leaflet-top leaflet-right">
            <div className="leaflet-control leaflet-bar">
              <a 
                href="#" 
                className="flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-50 transition-colors"
                title="Centrar en mi ubicación"
                onClick={(e) => {
                  e.preventDefault();
                  if (mapRef.current) {
                    mapRef.current.locate({
                      setView: true,
                      maxZoom: 16
                    }).on('locationfound', (e) => {
                      const { lat, lng } = e.latlng;
                      });
                    });
                  });
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243 4.244-4.242a2 2 0 012.828 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </a>
          </div>
        </div>
        
        <style>
          /* Estilos para el tooltip del marcador */
          .leaflet-tooltip {
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            font-weight: 500;
            color: #1a202c;
            white-space: nowrap;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            pointer-events: none;
          }
          
          .leaflet-bar a.leaflet-disabled {
            background: #f7fafc;
            color: #a0aec0;
          }
        </style>
      </MapContainer>
              white-space: nowrap;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              pointer-events: none;
            }
            
            .leaflet-bar a.leaflet-disabled {
              background: #f7fafc;
              color: #a0aec0;
            }
          `}</style>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapInput;
