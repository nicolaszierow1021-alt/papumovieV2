'use client';
import { useFormStatus } from 'react-dom';

export default function DeleteListButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta lista? (No se borrarán las películas, solo la lista)')) {
          e.preventDefault();
        }
      }}
      style={{
        padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: 600, cursor: pending ? 'not-allowed' : 'pointer',
        fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: pending ? 0.5 : 1
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>
      {pending ? '...' : 'Eliminar'}
    </button>
  );
}
