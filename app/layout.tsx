import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "LeadPulse AI — Prospecção inteligente",
  description: "Encontre, qualifique e converta leads com inteligência artificial.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} min-h-screen bg-zinc-950`}>{children}</body>
    </html>
  );
}
