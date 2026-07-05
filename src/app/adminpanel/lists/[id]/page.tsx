import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { addMovieToList, removeMovieFromList } from '@/app/actions/listActions';
import { PREDEFINED_LISTS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ListDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const isGeneralAdmin = cookieStore.get('papu_admin_auth')?.value === 'true';

  if (!isGeneralAdmin) {
    redirect('/adminpanel/banner');
  }
  const resolvedParams = await params;
  const listId = resolvedParams.id;

  const listData = PREDEFINED_LISTS.find(l => l.id === listId);
  
  if (!listData) {
    return <div style={{ color: '#fff', padding: '2rem' }}>Lista no encontrada.</div>;
  }

  // Fetch all movies to check their lists column
  const { data: allMovies, error } = await supabase
    .from('Movie')
    .select('*');

  if (error) {
    console.error('Error fetching movies:', error);
  }

  const movies = allMovies || [];

  // Filter movies that are in this list
  const listMovies = movies.filter(m => {
    if (!m.lists) return false;
    const listsArray = m.lists.split(',').map((l: string) => l.trim());
    return listsArray.includes(listId);
  });

  // Filter movies that are NOT in this list
  const availableMovies = movies.filter(m => {
    if (!m.lists) return true;
    const listsArray = m.lists.split(',').map((l: string) => l.trim());
    return !listsArray.includes(listId);
  });

  return (
    <div style={{ color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/adminpanel/lists" style={{ color: '#888', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </Link>
        <h1 className="heading-ELPAPUCINEFILO" style={{ fontSize: '2rem', margin: 0 }}>Lista: {listData.title}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        
        {/* Películas en la lista */}
        <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '12px', border: '1px solid #222' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 600 }}>Películas en esta lista ({listMovies.length})</h2>
          
          {listMovies.length === 0 ? (
            <div style={{ color: '#666', textAlign: 'center', padding: '2rem 0' }}>
              No hay películas en esta lista.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {listMovies.map((movie) => {
                const removeAction = removeMovieFromList.bind(null, listId, movie.id);
                return (
                  <div key={movie.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1a1a1a' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={movie.coverUrl} alt={movie.title} style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{movie.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>{movie.year}</div>
                    </div>
                    <form action={removeAction}>
                      <button type="submit" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Añadir película */}
        <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '12px', border: '1px solid #222', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 600 }}>Añadir a la lista</h2>
          
          <form action={async (formData) => {
            'use server';
            const movieId = formData.get('movie_id') as string;
            if (!movieId) return;
            await addMovieToList(listId, movieId);
          }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <select name="movie_id" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#000', color: '#fff' }}>
              <option value="">Selecciona una película...</option>
              {availableMovies.map(m => (
                <option key={m.id} value={m.id}>{m.title} ({m.year || '?'})</option>
              ))}
            </select>
            
            <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: '#E50914', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              Añadir
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
