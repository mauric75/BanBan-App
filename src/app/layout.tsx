import type { Metadata } from "next";
import "./globals.css";

import { Inter, Bebas_Neue } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "BANBAN",
  description: "Barbería premium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`
          ${inter.variable}
          ${bebas.variable}
          bg-[#0B0B0B]
          text-white
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}