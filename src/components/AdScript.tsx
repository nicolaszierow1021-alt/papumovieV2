'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function AdScript() {
  const pathname = usePathname();

  // No mostrar el anuncio en el panel de administración
  if (pathname && pathname.startsWith('/adminpanel')) {
    return null;
  }

  return (
    <Script
      src="https://tuxedoarbourannouncement.com/34/7e/82/347e823532a54f0fc9405265225f281e.js"
      strategy="afterInteractive"
    />
  );
}
