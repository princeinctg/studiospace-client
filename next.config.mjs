/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://studiospace-server-f9ek.onrender.com/api/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/my-bookings",
        destination: "/dashboard/my-bookings",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
