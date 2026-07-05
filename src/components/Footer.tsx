'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/adminpanel')) {
    return null;
  }

  return (
    <footer style={{ background: '#080b0f', padding: '60px 40px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '2px', color: '#fff' }}>
              <Link href="/" title="PAPU MOVIE">PAPU<b style={{ fontWeight: 900 }}>MOVIE</b></Link>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', display: 'flex', gap: '20px' }}>
            <Link href="/">Inicio</Link>
            <Link href="/?filter=movie">Películas</Link>
            <Link href="/?filter=series">Series</Link>
            <a href="https://t.me/+3IdHSZT-qDIyYmRh" target="_blank" rel="noopener noreferrer">Telegram</a>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '20px', textAlign: 'center' }}>
            © {new Date().getFullYear()} PAPU MOVIE. Desarrollado por ZierowStudio.
          </p>
      </div>
    </footer>
  );
}
