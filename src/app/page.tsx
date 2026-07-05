import { supabase } from '@/lib/supabase';
import HeroCarousel from '@/components/HeroCarousel';
import MovieRow from '@/components/MovieRow';
import { cleanTitle } from '@/utils/cleanTitle';
import Link from 'next/link';
import { PREDEFINED_LISTS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ filter?: string, search?: string, category?: string }> }) {
  const resolvedParams = await searchParams;
  const filter = resolvedParams.filter;
  const search = resolvedParams.search;
  const category = resolvedParams.category;

  let query = supabase.from('Movie').select('*').order('createdAt', { ascending: false });

  if (filter) {
    query = query.eq('type', filter);
  }

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  if (category) {
    query = query.ilike('lists', `%${category}%`);
  }

  const { data: moviesData } = await query;
  const movies = moviesData || [];

  // ── Search & Category & Filter Results ──
  if (search || category || filter) {
    let titleStr = '';
    if (search) titleStr = `Resultados: ${search}`;
    else if (category) {
      const catObj = PREDEFINED_LISTS.find(l => l.id === category);
      titleStr = catObj ? catObj.title.toUpperCase() : 'CATEGORÍA';
    } else if (filter) {
      titleStr = filter === 'movie' ? 'PELÍCULAS' : 'SERIES';
    }

    return (
      <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
        <h2 className="animated-section-title" style={{ padding: '0 40px' }}>
          {titleStr}
        </h2>
        {movies.length > 0 ? (
          <div className="movie-grid">
            {movies.map(movie => (
              <Link href={`/movie/${movie.id}`} key={movie.id} className="poster-card">
                <picture>
                  <source media="(max-width: 768px)" srcSet={movie.coverUrl} />
                  <img src={movie.bannerUrl || movie.coverUrl} alt={movie.title} />
                </picture>
                <div className="card-overlay">
                  {movie.logoUrl ? (
                    <div className="card-logo-wrapper">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={movie.logoUrl} alt={cleanTitle(movie.title)} className="card-logo-img" />
                    </div>
                  ) : (
                    <div className="card-title-fallback">{cleanTitle(movie.title)}</div>
                  )}
                  <div className="card-meta-hover">
                    <div className="card-meta-row">
                      <span style={{ color: 'var(--rating-green)' }}>★ {movie.rating || 'N/A'}</span>
                      <span className="dot">·</span>
                      <span>{movie.duration || (movie.type === 'series' ? 'Serie' : '1h 30m')}</span>
                      <span className="dot">·</span>
                      <span>{movie.year || '2024'}</span>
                    </div>
                    <div className="card-genres-hover">{movie.genres || 'Drama, Acción'}</div>
                  </div>
                </div>
                <div className="poster-card-play">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                <div className="mobile-card-details">
                  <div className="mobile-card-meta">
                    <span className="mobile-rating">★ {movie.rating || 'N/A'}</span>
                    <span>{movie.year || '2024'}</span>
                  </div>
                  <div className="mobile-card-genres">{movie.genres || 'Drama, Acción'}</div>
                  <div className="mobile-card-play-btn">JUGAR ↗</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No results found.</div>
        )}
      </div>
    );
  }

  // ── Carrusel: las últimas 10 películas añadidas ──
  // Ya están ordenadas por createdAt desc, tomamos las primeras 10 con bannerUrl preferiblemente
  const withBanner = movies.filter(m => m.bannerUrl && m.bannerUrl.trim() !== '');
  const withoutBanner = movies.filter(m => !m.bannerUrl || m.bannerUrl.trim() === '');
  const featuredMovies = [...withBanner, ...withoutBanner].slice(0, 10);

  return (
    <>
      <HeroCarousel movies={featuredMovies} />

      {/* Rows de categorías dinámicas */}
      <div style={{ paddingTop: '50px', paddingBottom: '4rem' }}>
        {(() => {
          // Filtrar listas relevantes (no carrusel) y mostrar solo las que tienen películas
          const renderedLists = PREDEFINED_LISTS.filter(list => list.id !== 'carrusel').map(list => {
            const listMovies = movies.filter(m => {
              if (!m.lists) return false;
              const listsArray = m.lists.split(',').map((l: string) => l.trim());
              return listsArray.includes(list.id);
            });
            return { list, listMovies };
          }).filter(item => item.listMovies.length > 0);

          return renderedLists.map(({ list, listMovies }) => (
            <div key={list.id} id={list.id} style={{ scrollMarginTop: '100px' }}>
              <MovieRow title={list.title.toUpperCase()} movies={listMovies} />
            </div>
          ));
        })()}
      </div>
    </>
  );
}
