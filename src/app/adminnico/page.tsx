'use client';

import { getMaintenanceStatus, toggleMaintenanceMode } from '@/app/actions/maintenanceActions';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminNicoPage() {
  const [status, setStatus] = useState({ active: false, message: '' });
  const [loading, setLoading] = useState(true);
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const ADMIN_ID = 'd382a3cc-4ff0-4bb2-bf47-4bfd6c69f099';

  useEffect(() => {
    // Check initial user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Get maintenance status
    getMaintenanceStatus().then(res => {
      setStatus(res);
      setLoading(false);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setAuthError('Credenciales incorrectas');
    } else {
      setUser(data.user);
    }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleActivate = async (e: any) => {
    e.preventDefault();
    const message = e.target.message.value || 'Esta web está en mantenimiento hasta el día 5 de julio a las 11am';
    await toggleMaintenanceMode(true, message);
    setStatus({ active: true, message });
  };

  const handleDeactivate = async (e: any) => {
    e.preventDefault();
    await toggleMaintenanceMode(false, '');
    setStatus({ active: false, message: '' });
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', color: '#fff' }}>Cargando panel...</div>;
  }

  // --- LOGIN SCREEN ---
  if (!user || user.id !== ADMIN_ID) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#111', padding: '2.5rem', borderRadius: '16px', border: '1px solid #333', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#E50914' }}>
            ACCESO RESTRINGIDO
          </h1>
          <p style={{ color: '#888', marginBottom: '2rem', fontSize: '1rem' }}>
            {user ? 'Tu cuenta no tiene permisos de administrador.' : 'Inicia sesión con tu cuenta de Supabase'}
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#000', color: '#fff' }}
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#000', color: '#fff' }}
            />
            
            {authError && <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>{authError}</div>}
            
            <button type="submit" disabled={isLoggingIn} style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold', backgroundColor: '#E50914', color: '#fff', border: 'none', borderRadius: '8px', cursor: isLoggingIn ? 'not-allowed' : 'pointer', opacity: isLoggingIn ? 0.7 : 1 }}>
              {isLoggingIn ? 'VERIFICANDO...' : 'ENTRAR AL PANEL'}
            </button>
          </form>

          {user && (
            <button onClick={handleLogout} style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: '#888', textDecoration: 'underline', cursor: 'pointer' }}>
              Cerrar sesión actual
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- ADMIN PANEL SCREEN ---
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff', padding: '2rem' }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: '500px', backgroundColor: '#111', padding: '2rem', borderRadius: '16px', border: '1px solid #333', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: status.active ? '#ef4444' : '#E50914' }}>
          ADMINISTRADOR
        </h1>
        
        <p style={{ color: '#888', marginBottom: '2rem', fontSize: '1.1rem' }}>
          ¡Hola! Tu sesión ha sido verificada. Puedes bloquear el acceso público aquí.
        </p>

        <div style={{ padding: '1rem', backgroundColor: status.active ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', border: `1px solid ${status.active ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`, borderRadius: '12px', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: status.active ? '#ef4444' : '#22c55e', margin: 0 }}>
            Estado actual: {status.active ? 'MANTENIMIENTO ACTIVADO' : 'SISTEMA ONLINE'}
          </h2>
        </div>

        {status.active ? (
          <form onSubmit={handleDeactivate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button type="submit" style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', fontWeight: 'bold', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              DESACTIVAR MANTENIMIENTO (ABRIR WEB)
            </button>
          </form>
        ) : (
          <form onSubmit={handleActivate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <textarea 
              name="message" 
              placeholder="Mensaje de mantenimiento..." 
              defaultValue="Esta web está en mantenimiento hasta el día 5 de julio a las 11am"
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#000', color: '#fff', minHeight: '100px', resize: 'vertical', fontSize: '1rem' }}
              required
            />
            <button type="submit" style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', fontWeight: 'bold', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              CERRAR WEB (ACTIVAR MANTENIMIENTO)
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
