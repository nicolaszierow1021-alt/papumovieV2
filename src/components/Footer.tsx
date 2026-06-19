'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/adminpanel')) {
    return null;
  }

  return (
    <footer className="footer-wrapper">
      {/* Telegram Banner */}
      <div className="telegram-banner">
        <div className="telegram-content">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="telegram-icon">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          <div className="telegram-text">
            <h3>¡Únete a nuestra Comunidad!</h3>
            <p>No te pierdas ningún estreno. Únete al canal oficial de Telegram.</p>
          </div>
        </div>
        <a href="https://t.me/+3IdHSZT-qDIyYmRh" target="_blank" rel="noopener noreferrer" className="btn-telegram">
          UNIRME AHORA
        </a>
      </div>

      {/* Main Footer */}
      <div className="main-footer">
        <div className="footer-brand">
          <h2 className="heading-ELPAPUCINEFILO">ELPAPUCINEFIL<span>O</span></h2>
          <p>© {new Date().getFullYear()} Todos los derechos reservados.</p>
        </div>
        
        <div className="footer-links">
          <Link href="/">Inicio</Link>
          <Link href="/?filter=movie">Películas</Link>
          <Link href="/?filter=series">Series</Link>
        </div>
        
        <div className="footer-disclaimer">
          <p>
            Ningún archivo se almacena en nuestros servidores. 
            Todo el contenido es proporcionado por terceros no afiliados.
          </p>
        </div>
      </div>
    </footer>
  );
}
