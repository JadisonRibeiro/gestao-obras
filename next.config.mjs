import withPWAInit from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  // Service worker desativado em desenvolvimento para evitar cache agressivo.
  disable: process.env.NODE_ENV === "development",
});

export default withPWA(nextConfig);
