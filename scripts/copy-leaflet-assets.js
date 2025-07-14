const fs = require('fs');
const path = require('path');

// Crear directorio de imágenes si no existe
const imagesDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Archivos a copiar
const filesToCopy = [
  {
    src: path.join(process.cwd(), 'node_modules', 'leaflet', 'dist', 'images', 'marker-icon.png'),
    dest: path.join(imagesDir, 'marker-icon.png')
  },
  {
    src: path.join(process.cwd(), 'node_modules', 'leaflet', 'dist', 'images', 'marker-icon-2x.png'),
    dest: path.join(imagesDir, 'marker-icon-2x.png')
  },
  {
    src: path.join(process.cwd(), 'node_modules', 'leaflet', 'dist', 'images', 'marker-shadow.png'),
    dest: path.join(imagesDir, 'marker-shadow.png')
  }
];

// Copiar archivos
filesToCopy.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copiado: ${src} -> ${dest}`);
  } else {
    console.error(`Archivo no encontrado: ${src}`);
  }
});
