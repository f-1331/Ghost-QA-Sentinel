/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8001/api/:path*',
      },
      {
        source: '/screenshots/:path*',
        destination: 'http://localhost:8001/screenshots/:path*',
      },
      {
        source: '/sandbox/:path*',
        destination: 'http://localhost:8001/sandbox/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
