'use client';

import { useState, useEffect } from 'react';

export default function BannerClient({ data }: { data: any }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Generar un identificador simple basado en el texto y color para saber si es un anuncio "nuevo"
    const bannerId = `banner_closed_${data.text.slice(0, 20).replace(/\s+/g, '')}_${data.bgColor.replace('#', '')}`;
    const isClosed = localStorage.getItem(bannerId);

    if (!isClosed) {
      setIsVisible(true);
    }
  }, [data]);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault(); // Evitar que el clic en la X abra el enlace
    e.stopPropagation();
    const bannerId = `banner_closed_${data.text.slice(0, 20).replace(/\s+/g, '')}_${data.bgColor.replace('#', '')}`;
    localStorage.setItem(bannerId, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'telegram':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        );
      case 'whatsapp':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        );
      case 'discord':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12h.01"></path><path d="M15 12h.01"></path><path d="M7 19.5c1.4-1.2 3.6-2 5-2s3.6.8 5 2"></path><path d="M19 13v-3a7 7 0 0 0-14 0v3"></path><path d="M22 13a2 2 0 0 0-2-2h-1v5h1a2 2 0 0 0 2-2z"></path><path d="M2 13a2 2 0 0 1 2-2h1v5H4a2 2 0 0 1-2-2z"></path>
          </svg>
        );
      case 'alert':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case 'info':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
      default:
        return null;
    }
  };

  const InnerContent = () => (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', flex: 1 }}>
        {getIcon(data.icon)}
        <span style={{ maxWidth: '800px', padding: '0 0.5rem', lineHeight: 1.3 }}>
          {data.text}
        </span>
        {data.link && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        )}
      </div>

      <button 
        onClick={handleClose}
        style={{
          background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '4px', marginLeft: '0.5rem', borderRadius: '4px',
          opacity: 0.7, transition: 'opacity 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
        aria-label="Cerrar anuncio"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </>
  );

  const containerStyle: React.CSSProperties = {
    backgroundColor: data.bgColor,
    color: '#fff',
    padding: '0.6rem 1rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Para empujar la X a la derecha
    position: 'relative',
    zIndex: 50,
    textDecoration: 'none',
  };

  if (data.link) {
    return (
      <a 
        href={data.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={containerStyle}
        className="global-banner-link"
      >
        <InnerContent />
        <style>{`
          .global-banner-link { transition: opacity 0.2s; }
          .global-banner-link:hover { opacity: 0.95; }
        `}</style>
      </a>
    );
  }

  return (
    <div style={containerStyle}>
      <InnerContent />
    </div>
  );
}
