import L from 'leaflet';

// URLs de los íconos desde CDN
const ICON_URL = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const ICON_RETINA_URL = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const SHADOW_URL = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

// Configuración por defecto para los íconos
export const defaultIcon = new L.Icon({
  iconUrl: ICON_URL,
  iconRetinaUrl: ICON_RETINA_URL,
  shadowUrl: SHADOW_URL,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Configuración global de Leaflet
export const configureLeaflet = () => {
  // Eliminar la función _getIconUrl por defecto para evitar problemas
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;

  // Configurar las URLs de los íconos por defecto
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: ICON_RETINA_URL,
    iconUrl: ICON_URL,
    shadowUrl: SHADOW_URL,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Función para cargar el CSS de Leaflet
export const loadLeafletCSS = () => {
  if (typeof document === 'undefined') return;
  
  // Verificar si el CSS ya está cargado
  const existingLink = document.querySelector('link[href*="leaflet.css"]');
  if (existingLink) return;
  
  // Crear y agregar el elemento link
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
  link.crossOrigin = '';
  
  // Asegurarse de que el head esté disponible
  if (document.head) {
    document.head.appendChild(link);
  } else {
    // Si el head no está disponible, esperar a que el DOM esté listo
    const observer = new MutationObserver(() => {
      if (document.head) {
        document.head.appendChild(link);
        observer.disconnect();
      }
    });
    
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
};
