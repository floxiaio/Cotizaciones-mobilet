/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = __dirname + '/src';
    return config;
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
