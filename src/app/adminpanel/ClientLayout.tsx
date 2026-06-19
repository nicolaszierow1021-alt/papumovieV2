'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function ClientLayout({ 
  children, 
  isBannerAdmin, 
  isGeneralAdmin 
}: { 
  children: React.ReactNode;
  isBannerAdmin: boolean;
  isGeneralAdmin: boolean;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  let navItems = [];

  if (isGeneralAdmin) {
    navItems.push(
      {
        href: '/adminpanel',
        label: 'Dashboard',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        ),
      },
      {
        href: '/adminpanel/add',
        label: 'Añadir Película',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        ),
      }
    );
  }

  if (isBannerAdmin) {
    navItems.push(
      {
        href: '/adminpanel/banner',
        label: 'Anuncios',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        ),
      }
    );
  }

  // Común para todos
  navItems.push(
    {
      href: '/',
      label: 'Ver Sitio Web',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    }
  );


  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0a0a', fontFamily: "'Inter', sans-serif" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 40, display: 'block',
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, height: '100vh',
        width: '260px',
        backgroundColor: '#111111',
        borderRight: '1px solid #1f1f1f',
        display: 'flex', flexDirection: 'column',
        zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        // On desktop always visible via CSS
      }}
        className="admin-sidebar"
      >
        {/* Logo */}
        <div style={{
          padding: '1.5rem 1.5rem 1rem',
          borderBottom: '1px solid #1f1f1f',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: '1.4rem', color: '#fff' }}>
              PAPU <span style={{ color: '#E50914' }}>ADMIN</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '4px' }}
            className="admin-sidebar-close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.7rem 1rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#fff' : '#888',
                  backgroundColor: isActive ? 'rgba(229,9,20,0.12)' : 'transparent',
                  borderLeft: isActive ? '3px solid #E50914' : '3px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ color: isActive ? '#E50914' : '#555', flexShrink: 0 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer with Logout */}
        <div style={{ padding: '1rem', borderTop: '1px solid #1f1f1f', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <a 
            href="/api/auth/logout"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.7rem 1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              transition: 'all 0.2s ease',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Cerrar Sesión
          </a>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Top bar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 30,
          backgroundColor: '#111111',
          borderBottom: '1px solid #1f1f1f',
          padding: '0 1.5rem',
          height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="admin-hamburger"
            style={{
              background: 'none', border: '1px solid #2a2a2a',
              color: '#ccc', cursor: 'pointer',
              padding: '8px', borderRadius: '8px',
              display: 'flex', alignItems: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
            <Link href="/" style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontSize: '0.85rem', color: '#888', textDecoration: 'none',
              padding: '0.4rem 0.8rem', borderRadius: '6px',
              border: '1px solid #2a2a2a', transition: 'all 0.2s',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Ver sitio
            </Link>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              backgroundColor: '#E50914', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: '#fff',
            }}>
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:ital,wght@1,900&display=swap');

        .admin-sidebar {
          transform: translateX(-100%);
        }
        .admin-hamburger {
          display: flex !important;
        }
        .admin-sidebar-close {
          display: flex !important;
        }

        @media (min-width: 1024px) {
          .admin-sidebar {
            transform: translateX(0) !important;
            position: sticky !important;
            height: 100vh !important;
            flex-shrink: 0 !important;
          }
          .admin-main-content {
            margin-left: 0 !important;
          }
          .admin-hamburger {
            display: none !important;
          }
          .admin-sidebar-close {
            display: none !important;
          }
        }

        .admin-sidebar a:hover {
          background-color: rgba(255,255,255,0.05) !important;
          color: #fff !important;
        }
        .admin-topbar-link:hover {
          background-color: rgba(255,255,255,0.05) !important;
          color: #fff !important;
        }
      `}</style>
    </div>
  );
}
