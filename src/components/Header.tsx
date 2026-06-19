'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  if (pathname.startsWith('/adminpanel')) {
    return null;
  }

  return (
    <header className="navbar">
      {isMobileSearchOpen ? (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 1rem' }}>
          <form action="/" method="GET" style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '15px' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              name="search" 
              autoFocus 
              placeholder="Buscar película o serie..." 
              defaultValue={typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('search') || '' : ''}
              style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '30px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
            />
          </form>
          <button onClick={() => setIsMobileSearchOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', padding: '0.5rem' }}>
            ✕
          </button>
        </div>
      ) : (
        <>
          <div className="nav-left">
            <nav className="nav-links">
              <Link href="/" className="nav-link">Inicio</Link>
              <Link href="/?filter=movie" className="nav-link">Películas</Link>
              <Link href="/?filter=series" className="nav-link">Series</Link>
            </nav>
          </div>

          <Link href="/" className="nav-brand">
            ELPAPUCINEFIL<span>O</span>
          </Link>

          <div className="nav-right">
            <form action="/" method="GET" className="search-bar desktop-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" name="search" placeholder="Buscar película o serie..." defaultValue={typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('search') || '' : ''} />
            </form>
            
            <button className="mobile-search-btn" onClick={() => setIsMobileSearchOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </>
      )}
    </header>
  );
}
