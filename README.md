# Cotizaciones Mobilet

Sistema de gestión de cotizaciones desarrollado con Next.js y Tailwind CSS.

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior

## Configuración inicial

1. Clona el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd cotizaciones-mobilet
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.example .env.local
   ```
   Edita el archivo `.env.local` y agrega tus credenciales.

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## Estructura del proyecto

```
/cotizaciones-mobilet
├── /public                 # Archivos estáticos
├── /src
│   ├── /app                # Rutas de la aplicación
│   ├── /components         # Componentes reutilizables
│   └── /styles             # Estilos globales
├── .env.example           # Variables de entorno de ejemplo
├── .gitignore             # Archivos ignorados por git
├── next.config.js         # Configuración de Next.js
├── package.json           # Dependencias y scripts
├── postcss.config.js      # Configuración de PostCSS
└── tailwind.config.js     # Configuración de Tailwind CSS
```

## Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia la aplicación en producción
- `npm run lint` - Ejecuta ESLint

## Despliegue

Puedes desplegar esta aplicación en Vercel, Netlify o cualquier otro servicio que soporte Next.js.
