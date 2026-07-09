import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep native/binary-heavy packages out of the bundle so the PDF route and
  // Prisma driver adapter work on the Node.js serverless runtime.
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "puppeteer-core",
    "@sparticuz/chromium-min",
  ],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
