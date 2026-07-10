import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";

// Trident's live site uses licensed fonts (sweet-sans-pro for display,
// mundial for body). These are free Google Fonts picked to match the same
// heavy-display / light-body character without reproducing licensed assets.
const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Helm, Concept Demo",
  description:
    "Unofficial concept demo built for a Trident Seafoods job application. Not affiliated with Trident Seafoods. All data synthetic.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <Footer />
      </body>
    </html>
  );
}
