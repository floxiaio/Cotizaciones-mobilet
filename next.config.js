/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = __dirname + '/src';
    return config;
  }
};

module.exports = nextConfig;
