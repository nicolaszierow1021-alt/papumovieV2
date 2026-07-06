import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: 'clamp(6rem, 15vw, 10rem)',
        fontWeight: 900,
        margin: 0,
        lineHeight: 1,
        color: 'var(--accent-yellow)',
        textShadow: '0 0 30px rgba(216, 190, 102, 0.4)'
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        fontWeight: 700,
        marginTop: '1rem',
        marginBottom: '1rem'
      }}>
        Página no encontrada
      </h2>
      <p style={{
        fontSize: '1.1rem',
        color: 'var(--text-secondary)',
        maxWidth: '500px',
        marginBottom: '2.5rem',
        lineHeight: 1.6
      }}>
        Parece que te has perdido. La película o página que buscas no existe, puede haber cambiado de enlace o simplemente ha sido eliminada.
      </p>
      
      <Link href="/" className="premium-dl-btn" style={{ maxWidth: '280px', margin: '0 auto' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Volver al Inicio
      </Link>
    </div>
  );
}
