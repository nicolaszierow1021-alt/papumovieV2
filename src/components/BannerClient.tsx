'use client';

import { useState, useEffect } from 'react';

export default function BannerClient({ data }: { data: any }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Restauramos el localStorage
    const textSnippet = (data?.text || '').slice(0, 20).replace(/\s+/g, '');
    const colorSnippet = (data?.bgColor || '').replace('#', '');
    const bannerId = `banner_closed_${textSnippet}_${colorSnippet}`;
    const isClosed = localStorage.getItem(bannerId);

    if (!isClosed) {
      setIsVisible(true);
    }
  }, [data]);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    setIsClosing(true);
    
    // Esperar a que termine la animación antes de desmontar
    setTimeout(() => {
      const textSnippet = (data?.text || '').slice(0, 20).replace(/\s+/g, '');
      const colorSnippet = (data?.bgColor || '').replace('#', '');
      const bannerId = `banner_closed_${textSnippet}_${colorSnippet}`;
      localStorage.setItem(bannerId, 'true');
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'telegram':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
      case 'whatsapp':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
      case 'discord':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h.01"></path><path d="M15 12h.01"></path><path d="M7 19.5c1.4-1.2 3.6-2 5-2s3.6.8 5 2"></path><path d="M19 13v-3a7 7 0 0 0-14 0v3"></path><path d="M22 13a2 2 0 0 0-2-2h-1v5h1a2 2 0 0 0 2-2z"></path><path d="M2 13a2 2 0 0 1 2-2h1v5H4a2 2 0 0 1-2-2z"></path></svg>;
      case 'alert':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
      case 'info':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
      default:
        return null;
    }
  };

  const InnerContent = () => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', width: '100%' }}>
      {/* Icon */}
      <div style={{ 
        flexShrink: 0, 
        marginTop: '2px',
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: '8px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {getIcon(data.icon)}
      </div>

      {/* Text Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ 
          fontSize: '0.95rem', 
          lineHeight: '1.4', 
          fontWeight: 600,
          textShadow: '0 1px 2px rgba(0,0,0,0.2)'
        }}>
          {data.text}
        </span>
        {data.link && (
          <span style={{ 
            fontSize: '0.8rem', 
            opacity: 0.9, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            marginTop: '4px',
            textDecoration: 'underline' 
          }}>
            Haz clic para ver más
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </span>
        )}
      </div>

      {/* Close Button */}
      <button 
        onClick={handleClose}
        style={{
          background: 'rgba(0,0,0,0.1)', 
          border: 'none', 
          color: '#fff', 
          cursor: 'pointer',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '6px', 
          borderRadius: '50%',
          flexShrink: 0,
          transition: 'background 0.2s, transform 0.1s',
          marginLeft: '4px'
        }}
        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.3)' }}
        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.1)' }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.9)' }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        aria-label="Cerrar anuncio"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );

  const containerStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${data.bgColor || '#E50914'}ee, ${data.bgColor || '#E50914'}cc)`,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    color: '#fff',
    padding: '16px 20px',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.15) inset, 0 1px 1px rgba(255,255,255,0.2) inset',
    display: 'flex',
    alignItems: 'center',
    position: 'fixed',
    top: '90px', // Debajo del header
    right: '30px',
    zIndex: 99999,
    width: '360px',
    maxWidth: 'calc(100vw - 40px)',
    textDecoration: 'none',
    transform: isClosing ? 'translateX(120%) scale(0.95)' : 'translateX(0) scale(1)',
    opacity: isClosing ? 0 : 1,
    transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.1)',
    animation: 'slideInTopRight 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.1) forwards',
  };

  const Wrapper = data.link ? 'a' : 'div';
  const wrapperProps = data.link ? { 
    href: data.link, 
    target: '_blank', 
    rel: 'noopener noreferrer',
    className: 'global-banner-toast'
  } : {
    className: 'global-banner-toast'
  };

  return (
    <>
      <style>{`
        @keyframes slideInTopRight {
          0% { transform: translateX(120%) scale(0.9); opacity: 0; }
          70% { transform: translateX(-10px) scale(1.02); opacity: 1; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        .global-banner-toast {
          transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.1), opacity 0.4s, box-shadow 0.4s;
        }
        a.global-banner-toast:hover {
          transform: translateY(-5px) scale(1.02) !important;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.25) inset, 0 1px 1px rgba(255,255,255,0.3) inset !important;
        }
      `}</style>
      {/* @ts-ignore */}
      <Wrapper {...wrapperProps} style={containerStyle}>
        <InnerContent />
      </Wrapper>
    </>
  );
}
