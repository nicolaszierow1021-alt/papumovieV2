'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DownloadLink {
  id: string;
  server: string;
  details: string;
  url: string;
}

interface DownloadModalProps {
  movieTitle: string;
  downloadLinks: DownloadLink[];
}

export default function DownloadModal({ movieTitle, downloadLinks }: DownloadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modalContent = isOpen ? (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999999,
      backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        backgroundColor: '#11151c', // Using the web's dark theme colors 
        border: '1px solid #1c2633', 
        borderRadius: '16px',
        width: '100%', maxWidth: '650px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex', flexDirection: 'column'
      }}>
        
        {/* Modal Header */}
        <div style={{ 
          padding: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid #1c2633'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '48px', height: '48px', 
              borderRadius: '12px', 
              backgroundColor: 'rgba(216, 190, 102, 0.1)', // Web's accent yellow
              border: '1px solid rgba(216, 190, 102, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#d8be66'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </div>
            <div>
              <div style={{ color: '#888', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Descargar
              </div>
              <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                {movieTitle}
              </h2>
            </div>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)} 
            style={{ 
              background: '#1a2332', 
              border: 'none', 
              width: '36px', height: '36px', 
              borderRadius: '50%', 
              color: '#888', 
              cursor: 'pointer', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s, color 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#243040'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#1a2332'; e.currentTarget.style.color = '#888'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Links List */}
        <div style={{ padding: '2rem 1.5rem', backgroundColor: '#0b0f14' }}>
          <div style={{ 
            backgroundColor: '#11151c', 
            border: '1px solid #1c2633',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {downloadLinks.map((link) => (
              <div key={link.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                padding: '0.75rem 0',
                borderBottom: '1px solid #1a2332'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 auto', minWidth: 0 }}>
                  <span style={{ 
                    backgroundColor: '#1a2332', 
                    border: '1px solid #243040',
                    color: '#999',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    flexShrink: 0
                  }}>
                    {link.details || 'LINK'}
                  </span>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {link.server || 'Servidor'}
                  </span>
                </div>
                
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0,
                    backgroundColor: 'rgba(216, 190, 102, 0.05)',
                    border: '1px solid rgba(216, 190, 102, 0.3)',
                    color: '#d8be66',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(216, 190, 102, 0.15)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(216, 190, 102, 0.05)'; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Descargar
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '1rem', 
          borderTop: '1px solid #1c2633', 
          backgroundColor: '#11151c',
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          color: '#666',
          fontSize: '0.85rem'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          Los enlaces se abren en una pestaña nueva.
        </div>

      </div>
    </div>
  ) : null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="premium-dl-btn" 
        style={downloadLinks.length === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        disabled={downloadLinks.length === 0}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        {downloadLinks.length > 0 ? 'DESCARGAR AHORA' : 'NO DISPONIBLE'}
      </button>

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
