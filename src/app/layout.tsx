import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Banner from "@/components/Banner";

const BASE_URL = 'https://papumoviemkv.store';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'PAPU MOVIE - Descargar Películas y Series HD',
    template: '%s | PAPU MOVIE',
  },
  description:
    'Descarga películas y series en HD, 4K, BluRay y MKV gratis. Las mejores películas de acción, terror, drama y más en PAPU MOVIE.',
  keywords: [
    'descargar peliculas',
    'descargar series',
    'peliculas HD',
    'peliculas 4K',
    'peliculas MKV',
    'peliculas BluRay',
    'papu movie',
    'descargar gratis',
    'series latino',
    'peliculas latino',
  ],
  authors: [{ name: 'PAPU MOVIE', url: BASE_URL }],
  creator: 'PAPU MOVIE',
  publisher: 'PAPU MOVIE',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: BASE_URL,
    siteName: 'PAPU MOVIE',
    title: 'PAPU MOVIE - Descargar Películas y Series HD',
    description:
      'Descarga películas y series en HD, 4K, BluRay y MKV gratis. Las mejores películas de acción, terror, drama y más.',
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'PAPU MOVIE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PAPU MOVIE - Descargar Películas y Series HD',
    description:
      'Descarga películas y series en HD, 4K, BluRay y MKV gratis.',
    images: [`${BASE_URL}/og-image.jpg`],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Banner />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
