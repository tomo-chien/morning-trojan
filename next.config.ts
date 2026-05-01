import type { NextConfig } from "next";

const BEEHIIV = "https://morning-trojan.beehiiv.com";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/subscribe/:path*",
        destination: `${BEEHIIV}/subscribe/:path*`,
        permanent: false,
      },
      {
        source: "/subscribe",
        destination: `${BEEHIIV}/subscribe`,
        permanent: false,
      },
      {
        source: "/unsubscribe/:path*",
        destination: `${BEEHIIV}/unsubscribe/:path*`,
        permanent: false,
      },
      {
        source: "/unsubscribe",
        destination: `${BEEHIIV}/unsubscribe`,
        permanent: false,
      },
      // Catch any other Beehiiv subscription management paths
      {
        source: "/subscription/:path*",
        destination: `${BEEHIIV}/subscription/:path*`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
