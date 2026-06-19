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
  const totalPeliculas = movies.filter((m) => m.type !== 'series').length;
  const totalSeries = movies.filter((m) => m.type === 'series').length;

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            Dashboard
          </h1>
          <p style={{ color: '#555', fontSize: '0.9rem' }}>
            Gestiona tu catálogo de películas y series
          </p>
        </div>
        <Link
          href="/adminpanel/add"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: '#E50914', color: '#fff',
            padding: '0.7rem 1.5rem', borderRadius: '8px',
            fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
            transition: 'opacity 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nueva Película
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Títulos', value: movies.length, color: '#E50914' },
          { label: 'Películas', value: totalPeliculas, color: '#f59e0b' },
          { label: 'Series', value: totalSeries, color: '#3b82f6' },
          { label: 'Último Añadido', value: movies[0]?.title?.split(' ')[0] || '—', color: '#10b981', small: true },
        ].map((stat, i) => (
          <div key={i} style={{
            backgroundColor: '#141414',
            border: '1px solid #1f1f1f',
            borderRadius: '12px',
            padding: '1.25rem',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '3px', height: '100%',
              backgroundColor: stat.color, borderRadius: '12px 0 0 12px',
            }} />
            <div style={{ color: '#666', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
              {stat.label}
            </div>
            <div style={{ color: '#fff', fontSize: stat.small ? '1.1rem' : '2rem', fontWeight: 800, lineHeight: 1 }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Table title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
          Catálogo Completo
          <span style={{ marginLeft: '0.75rem', backgroundColor: '#1f1f1f', color: '#666', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
            {movies.length}
          </span>
        </h2>
      </div>

      {/* Cards grid (mobile) / Table (desktop) */}
      {movies.length === 0 ? (
        <div style={{
          backgroundColor: '#141414', border: '1px solid #1f1f1f', borderRadius: '12px',
          padding: '4rem 2rem', textAlign: 'center', color: '#555',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</div>
          <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem', color: '#777' }}>
            No hay películas registradas
          </div>
          <Link href="/adminpanel/add" style={{ color: '#E50914', textDecoration: 'none', fontWeight: 600 }}>
            Añade la primera
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="admin-table-wrapper" style={{
            backgroundColor: '#141414', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f0f0f' }}>
                  {['Película', 'Tipo', 'Año', 'Calidad', 'Subido', 'Acciones'].map((h) => (
                    <th key={h} style={{
                      padding: '0.9rem 1rem', textAlign: 'left',
                      color: '#555', fontSize: '0.75rem', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                      borderBottom: '1px solid #1f1f1f',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {movies.map((movie, idx) => {
                  const deleteMovieWithId = deleteMovie.bind(null, movie.id);
                  return (
                    <tr key={movie.id} style={{
                      borderBottom: idx < movies.length - 1 ? '1px solid #1a1a1a' : 'none',
                      transition: 'background 0.15s',
                    }}
                      className="admin-table-row"
                    >
                      {/* Movie info */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={movie.coverUrl}
                            alt={movie.title}
                            style={{ width: '36px', height: '54px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: '#e5e5e5', fontSize: '0.9rem', lineHeight: 1.3 }}>
                              {movie.title}
                            </div>
                            {movie.director && (
                              <div style={{ color: '#555', fontSize: '0.75rem', marginTop: '2px' }}>
                                {movie.director}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.6rem', borderRadius: '999px',
                          fontSize: '0.72rem', fontWeight: 700,
                          backgroundColor: movie.type === 'series' ? 'rgba(59,130,246,0.15)' : 'rgba(229,9,20,0.15)',
                          color: movie.type === 'series' ? '#60a5fa' : '#f87171',
                          border: `1px solid ${movie.type === 'series' ? 'rgba(59,130,246,0.3)' : 'rgba(229,9,20,0.3)'}`,
                        }}>
                          {movie.type === 'series' ? 'Serie' : 'Película'}
                        </span>
                      </td>

                      {/* Year */}
                      <td style={{ padding: '0.85rem 1rem', color: '#888', fontSize: '0.85rem' }}>
                        {movie.year || '—'}
                      </td>

                      {/* Quality */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '0.2rem 0.5rem', borderRadius: '4px',
                          fontSize: '0.72rem', fontWeight: 700,
                          backgroundColor: '#1f1f1f', color: '#a3a3a3',
                        }}>
                          {movie.quality || 'HD'}
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '0.85rem 1rem', color: '#555', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {new Date(movie.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          {/* Ver película */}
                          <Link
                            href={`/movie/${movie.id}`}
                            target="_blank"
                            title="Ver película"
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              width: '32px', height: '32px', borderRadius: '6px',
                              backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                              color: '#10b981', transition: 'all 0.2s', textDecoration: 'none',
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                          </Link>

                          {/* Editar */}
                          <Link
                            href={`/adminpanel/edit/${movie.id}`}
                            title="Editar"
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              width: '32px', height: '32px', borderRadius: '6px',
                              backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
                              color: '#f59e0b', transition: 'all 0.2s', textDecoration: 'none',
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </Link>

                          {/* Eliminar */}
                          <form action={deleteMovieWithId}>
                            <button
                              type="submit"
                              title="Eliminar"
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '32px', height: '32px', borderRadius: '6px',
                                backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                                color: '#ef4444', transition: 'all 0.2s', cursor: 'pointer',
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6"/><path d="M14 11v6"/>
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                              </svg>
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="admin-cards-mobile">
            {movies.map((movie) => {
              const deleteMovieWithId = deleteMovie.bind(null, movie.id);
              return (
                <div key={movie.id} style={{
                  backgroundColor: '#141414', border: '1px solid #1f1f1f',
                  borderRadius: '12px', padding: '1rem', display: 'flex', gap: '1rem',
                  alignItems: 'flex-start',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={movie.coverUrl}
                    alt={movie.title}
                    style={{ width: '50px', height: '75px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: '#e5e5e5', fontSize: '0.95rem', marginBottom: '0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {movie.title}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700,
                        backgroundColor: movie.type === 'series' ? 'rgba(59,130,246,0.15)' : 'rgba(229,9,20,0.15)',
                        color: movie.type === 'series' ? '#60a5fa' : '#f87171',
                      }}>
                        {movie.type === 'series' ? 'Serie' : 'Película'}
                      </span>
                      {movie.year && <span style={{ color: '#666', fontSize: '0.75rem' }}>{movie.year}</span>}
                      {movie.quality && <span style={{ color: '#666', fontSize: '0.75rem' }}>{movie.quality}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Link href={`/movie/${movie.id}`} target="_blank" style={{
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.35rem 0.7rem', borderRadius: '6px',
                        backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                        color: '#10b981', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none',
                      }}>
                        Ver
                      </Link>
                      <Link href={`/adminpanel/edit/${movie.id}`} style={{
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.35rem 0.7rem', borderRadius: '6px',
                        backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
                        color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none',
                      }}>
                        Editar
                      </Link>
                      <form action={deleteMovieWithId}>
                        <button type="submit" style={{
                          display: 'flex', alignItems: 'center', gap: '0.3rem',
                          padding: '0.35rem 0.7rem', borderRadius: '6px',
                          backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                          color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                        }}>
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <style>{`
        .admin-table-wrapper { display: block; }
        .admin-cards-mobile { display: none; flex-direction: column; gap: 0.75rem; }
        .admin-table-row:hover { background-color: rgba(255,255,255,0.02) !important; }

        @media (max-width: 768px) {
          .admin-table-wrapper { display: none !important; }
          .admin-cards-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
