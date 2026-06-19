import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { deleteMovie } from '@/app/actions/movieActions';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const { data: moviesData } = await supabase
    .from('Movie')
    .select('*')
    .order('createdAt', { ascending: false });
    
  const movies = moviesData || [];


  return (
    <>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Resumen del Catálogo</h1>
        <Link href="/adminpanel/add" className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '1rem' }}>
          + Nueva Película
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Total de Películas</div>
          <div className="stat-value">{movies.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Último Estreno Añadido</div>
          <div className="stat-value" style={{ fontSize: '1.2rem', marginTop: '0.5rem', color: 'var(--accent-primary)' }}>
            {movies[0]?.title || 'Ninguno'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Visitas (Aprox)</div>
          <div className="stat-value">---</div>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Película</th>
              <th>Tipo</th>
              <th>Año</th>
              <th>Calidad</th>
              <th>Fecha de Subida</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movies.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No hay películas registradas.</td>
              </tr>
            ) : (
              movies.map((movie) => {
                const deleteMovieWithId = deleteMovie.bind(null, movie.id);
                return (
                  <tr key={movie.id}>
                    <td>
                      <div className="table-movie-info">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={movie.coverUrl} alt={movie.title} />
                        <span style={{ fontWeight: 600 }}>{movie.title}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem', 
                        fontWeight: 'bold',
                        backgroundColor: movie.type === 'series' ? '#1d4ed8' : '#b91c1c',
                        color: 'white'
                      }}>
                        {movie.type === 'series' ? 'Serie' : 'Película'}
                      </span>
                    </td>
                    <td>{movie.year || 'N/A'}</td>
                    <td>{movie.quality || 'HD'}</td>
                    <td>{new Date(movie.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link 
                          href={`/adminpanel/edit/${movie.id}`} 
                          className="btn-secondary" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: '#3f3f46', border: 'none' }}
                        >
                          Editar
                        </Link>
                        <form action={deleteMovieWithId}>
                          <button type="submit" className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#E50914', border: 'none', cursor: 'pointer' }}>
                            Eliminar
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
