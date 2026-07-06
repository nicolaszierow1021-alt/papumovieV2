'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Props {
  active: boolean;
  message: string;
}

export default function MaintenanceBlocker({ active, message }: Props) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (active) {
      const checkAdmin = async () => {
        try {
          // Primero intentamos con la sesión local (más rápido)
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.id === 'd382a3cc-4ff0-4bb2-bf47-4bfd6c69f099') {
            setIsAdmin(true);
          } else {
            // Si no hay sesión o no es admin, verificamos con getUser por seguridad
            const { data } = await supabase.auth.getUser();
            if (data?.user?.id === 'd382a3cc-4ff0-4bb2-bf47-4bfd6c69f099') {
              setIsAdmin(true);
            }
          }
        } catch (error) {
          console.error("Error verificando sesión de admin:", error);
        } finally {
          setIsChecking(false);
        }
      };

      checkAdmin();

      // Suscribirse a cambios de estado de autenticación (login, logout, refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user?.id === 'd382a3cc-4ff0-4bb2-bf47-4bfd6c69f099') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsChecking(false);
    }
  }, [active]);

  useEffect(() => {
    // Si el mantenimiento está activo, no es adminnico, y no es admin verificado (y ya terminó de verificar)
    if (active && pathname && !pathname.startsWith('/adminnico') && !isAdmin && !isChecking) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [active, pathname, isAdmin, isChecking]);

  // Si está apagado, o estamos en la ruta secreta, o el usuario es el Admin (ID verificado)
  if (!active || (pathname && pathname.startsWith('/adminnico')) || isAdmin) {
    return null;
  }

  // Mientras verifica si es admin o no, mostramos un fondo negro para no revelar la web
  if (isChecking) {
    return <div style={{ position: 'fixed', inset: 0, zIndex: 999999, background: '#0a0a0a' }} />;
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999999,
      background: 'linear-gradient(-45deg, #0a0a0a, #1a0505, #161618, #000000)',
      backgroundSize: '400% 400%',
      animation: 'gradientBG 10s ease infinite',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: '#fff', textAlign: 'center', padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseLogo {
          0% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(229, 9, 20, 0.3)); }
          50% { transform: scale(1.05); filter: drop-shadow(0 0 40px rgba(229, 9, 20, 0.6)); }
          100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(229, 9, 20, 0.3)); }
        }
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
      
      {/* Fondo de estrellas/puntos animados simples usando CSS puro para mayor rendimiento */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '50px 50px', animation: 'floating 20s linear infinite' }} />

      <div style={{ position: 'relative', zIndex: 10, animation: 'pulseLogo 4s ease-in-out infinite', marginBottom: '3rem' }}>
        <h1 className="heading-ELPAPUCINEFILO" style={{ fontSize: 'clamp(3rem, 5vw, 6rem)', margin: 0, letterSpacing: '2px', color: '#E50914' }}>
          PAPU MOVIE
        </h1>
      </div>

      <div style={{ 
        position: 'relative', zIndex: 10, maxWidth: '800px', width: '100%',
        backgroundColor: 'rgba(20, 20, 22, 0.7)', padding: '4rem 2rem', 
        borderRadius: '24px', backdropFilter: 'blur(20px)', 
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'inline-block', padding: '1rem', backgroundColor: 'rgba(229, 9, 20, 0.1)', borderRadius: '50%', marginBottom: '1.5rem' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ESTAMOS MEJORANDO LA WEB
        </h2>
        <p style={{ fontSize: '1.4rem', lineHeight: '1.6', color: '#a1a1aa', margin: '0 auto', maxWidth: '600px' }}>
          {message}
        </p>
      </div>
    </div>
  );
}
