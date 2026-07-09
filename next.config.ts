import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep native/binary-heavy packages out of the bundle so the PDF route and
  // Prisma driver adapter work on the Node.js serverless runtime.
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "puppeteer-core",
    "@sparticuz/chromium",
  ],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  // @sparticuz/chromium ships brotli-compressed binaries in bin/ that aren't
  // reached by import tracing — force them into the PDF route's function bundle.
  outputFileTracingIncludes: {
    "/offerte/[id]/pdf": ["./node_modules/@sparticuz/chromium/bin/**"],
  },
};

export default nextConfig;
