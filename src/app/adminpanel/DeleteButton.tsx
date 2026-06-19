'use client';
import { useFormStatus } from 'react-dom';

export default function DeleteButton({ variant = 'icon' }: { variant?: 'icon' | 'text' }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      title="Eliminar"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta película? Esta acción no se puede deshacer.')) {
          e.preventDefault();
        }
      }}
      style={
        variant === 'icon' ? {
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '32px', height: '32px', borderRadius: '6px',
          backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
          color: '#ef4444', transition: 'all 0.2s', cursor: pending ? 'not-allowed' : 'pointer',
          opacity: pending ? 0.5 : 1
        } : {
          display: 'flex', alignItems: 'center', gap: '0.3rem',
          padding: '0.35rem 0.7rem', borderRadius: '6px',
          backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
          color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: pending ? 'not-allowed' : 'pointer',
          opacity: pending ? 0.5 : 1
        }
      }
    >
      {variant === 'icon' ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/>
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
      ) : (
        pending ? 'Eliminando...' : 'Eliminar'
      )}
    </button>
  );
}
