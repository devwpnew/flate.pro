/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["flate.pro", "myflat.pro"],
  },
  crossOrigin: "anonymous",
  infrastructureLogging: { debug: /PackFileCache/ },
  devIndicators: {
    buildActivity: false,
  },
  async redirects() {
    return [
      {
        source: '/app',
        destination: 'https://app.flate.pro',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/v2/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,OPTIONS,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" }
        ]
      }
    ]
  }
};

module.exports = nextConfig;
