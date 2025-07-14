'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, type LatLngExpression } from 'leaflet';

// Configuración de íconos
const defaultIcon = new Icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapContainerProps {
  center?: LatLngExpression;
  zoom?: number;
}

const MapContainer: React.FC<MapContainerProps> = ({ 
  center = [19.0414, -98.2063] as LatLngExpression, 
  zoom = 13 
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="w-full h-64 bg-gray-200 animate-pulse"></div>;
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden">
      <LeafletMap 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={center} icon={defaultIcon}>
          <Popup>
            Ubicación seleccionada
          </Popup>
        </Marker>
      </LeafletMap>
    </div>
  );
};

export default MapContainer;
