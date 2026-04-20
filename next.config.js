/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/apps', destination: '/', permanent: true },
      { source: '/apps/trainerdocs', destination: '/', permanent: true },
    ];
  },
};

module.exports = nextConfig;
