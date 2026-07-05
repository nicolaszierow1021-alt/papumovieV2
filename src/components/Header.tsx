'use client';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import PremiumLoader from '@/components/PremiumLoader';

function HeaderContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [scrolled, setScrolled] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Check initial theme
    if (document.documentElement.classList.contains('light-mode')) {
      setIsLightMode(true);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isLightMode) {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark-mode');
      setIsLightMode(false);
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
      setIsLightMode(true);
    }
  };

  if (pathname.startsWith('/adminpanel')) return null;

  const triggerNavigation = () => {
    setIsNavigating(true);
    setTimeout(() => setIsNavigating(false), 1200);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      triggerNavigation();
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  const isSolid = !!(searchParams.get('filter') || searchParams.get('category') || searchParams.get('search'));
  const showPresents = isSolid || pathname.startsWith('/movie');

  return (
    <>
      {isNavigating && <PremiumLoader />}
      
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-left">
          <button className="menu-toggle" onClick={() => setIsMenuOpen(true)} aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
          <Link href="/" className="home-icon" onClick={triggerNavigation} aria-label="Home">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </Link>
        </div>

        <Link href="/" className="site-logo" onClick={triggerNavigation}>
          <div className="logo-main">PAPUMOVIE</div>
          {showPresents && <div className="logo-sub">PRESENTS</div>}
        </Link>

        <div className="header-right">
          <button className="search-toggle" onClick={() => setIsSearchOpen(true)} aria-label="Search">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Theme" style={{ opacity: 0.8 }}>
            {isLightMode ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Search Overlay */}
      <div className={`search-overlay ${isSearchOpen ? 'active' : ''}`}>
        <button className="search-close" onClick={() => setIsSearchOpen(false)}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies, TV shows..." 
            autoFocus={isSearchOpen}
          />
        </form>
      </div>

      {/* Drawer */}
      <div className={`drawer ${isMenuOpen ? 'active' : ''}`}>
        <button className="drawer-close" onClick={() => setIsMenuOpen(false)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <nav className="drawer-nav">
          <Link href="/" onClick={() => { setIsMenuOpen(false); triggerNavigation(); }}>Inicio</Link>
          <Link href="/?filter=movie" onClick={() => { setIsMenuOpen(false); triggerNavigation(); }}>Películas</Link>
          <Link href="/?filter=series" onClick={() => { setIsMenuOpen(false); triggerNavigation(); }}>Series</Link>
          <Link href="/?category=accion" onClick={() => { setIsMenuOpen(false); triggerNavigation(); }}>Acción</Link>
          <Link href="/?category=terror-suspenso" onClick={() => { setIsMenuOpen(false); triggerNavigation(); }}>Terror</Link>
          <Link href="/?category=comedia" onClick={() => { setIsMenuOpen(false); triggerNavigation(); }}>Comedia</Link>
        </nav>
      </div>
    </>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<header className="site-header"></header>}>
      <HeaderContent />
    </Suspense>
  );
}
