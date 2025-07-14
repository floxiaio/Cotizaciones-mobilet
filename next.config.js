/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Configuración para manejar archivos estáticos
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  webpack: (config, { isServer, dev }) => {
    // Configuración de alias
    config.resolve.alias['@'] = __dirname + '/src';
    
    // Configuración para fuentes y recursos estáticos
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name][ext]',
      },
    });

    // Configuración para imágenes
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/images/[name][ext]',
      },
    });

    // Ignorar source maps de ciertos módulos solo en desarrollo
    if (dev) {
      config.ignoreWarnings = [
        { module: /node_modules\/leaflet/ },
        { module: /node_modules\/react-leaflet/ },
        { module: /node_modules\/react-toastify/ },
      ];
    }

    return config;
  },
  
  // Configuración experimental
  experimental: {
    // Habilita el soporte para styled-jsx con soporte para CSS global
    styledComponents: true,
  },
};

module.exports = nextConfig;
