import Link from 'next/link';
import { PREDEFINED_LISTS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function ListsAdminPage() {
  return (
    <div style={{ color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-ELPAPUCINEFILO" style={{ fontSize: '2rem' }}>Gestión de Listas (Categorías)</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {PREDEFINED_LISTS.map((list) => {
          return (
            <div key={list.id} style={{ 
              display: 'flex', flexDirection: 'column',
              backgroundColor: '#111', padding: '1.5rem', borderRadius: '12px', border: '1px solid #222'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(135deg, #FF1515, #ff6b6b)' }}></div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', margin: '0 0 0.2rem 0' }}>{list.title}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>ID Interno: {list.id}</div>
                </div>
              </div>
              
              <Link 
                href={`/adminpanel/lists/${list.id}`}
                style={{ 
                  padding: '0.75rem', borderRadius: '8px', textDecoration: 'none', textAlign: 'center',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)',
                  fontSize: '0.95rem', fontWeight: 600, display: 'block'
                }}
              >
                Añadir / Quitar Películas
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
