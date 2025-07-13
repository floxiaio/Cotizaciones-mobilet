"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

// Componente para actualizar automáticamente el centro del mapa
export default function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const initialCenterSet = useRef(false);
  
  useEffect(() => {
    if (map && typeof map.setView === "function") {
      // Pequeño retraso para asegurar que el mapa esté listo
      const timer = setTimeout(() => {
        if (map && typeof map.setView === "function") {
          map.setView(center, zoom);
          initialCenterSet.current = true;
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [center, zoom, map]);
  
  return null;
}
