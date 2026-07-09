import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SamSam Offertes",
  description: "Offertes voor energieopslag — SamSam geeft energie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-muted/40">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
