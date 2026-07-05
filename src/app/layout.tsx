import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Banner from "@/components/Banner";
import MaintenanceBlocker from "@/components/MaintenanceBlocker";
import { getMaintenanceStatus } from "@/app/actions/maintenanceActions";

const BASE_URL = 'https://papumoviemkv.store';

export const viewport: Viewport = {
  themeColor: '#141414',
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  appleWebApp: { capable: true, statusBarStyle: "default", title: "PAPU MOVIE" },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const maintenanceStatus = await getMaintenanceStatus();

  return (
    <html lang="es" className="dark-mode">
      <head>
      </head>
      <body>
        <MaintenanceBlocker active={maintenanceStatus.active} message={maintenanceStatus.message} />
        <Header />
        <Banner />
        <main>{children}</main>
        <Footer />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://tuxedoarbourannouncement.com/34/7e/82/347e823532a54f0fc9405265225f281e.js"></script>
      </body>
    </html>
  );
}
