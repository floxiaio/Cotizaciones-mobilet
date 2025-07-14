const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

async function setupLeafletIcons() {
  try {
    // Crear directorio de imágenes si no existe
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    try {
      await mkdir(imagesDir, { recursive: true });
      console.log('Directorio de imágenes creado:', imagesDir);
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }

    // Copiar archivos de íconos
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

    for (const file of filesToCopy) {
      try {
        await copyFile(file.src, file.dest);
        console.log(`Archivo copiado: ${file.dest}`);
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.error(`Archivo fuente no encontrado: ${file.src}`);
        } else {
          throw err;
        }
      }
    }

    console.log('Configuración de íconos de Leaflet completada.');
  } catch (error) {
    console.error('Error al configurar los íconos de Leaflet:', error);
    process.exit(1);
  }
}

// Ejecutar la función
setupLeafletIcons();
