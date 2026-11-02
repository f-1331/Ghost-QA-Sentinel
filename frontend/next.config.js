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
        destination: 'http://localhost:8000/api/:path*',
      },
      {
        source: '/screenshots/:path*',
        destination: 'http://localhost:8000/screenshots/:path*',
      },
      {
        source: '/sandbox/:path*',
        destination: 'http://localhost:8000/sandbox/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
