import { supabase } from '@/lib/supabase';
import HeroCarousel from '@/components/HeroCarousel';
import MovieRow from '@/components/MovieRow';
import Link from 'next/link';
import { PREDEFINED_LISTS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ filter?: string, search?: string }> }) {
  const resolvedParams = await searchParams;
  const filter = resolvedParams.filter;
  const search = resolvedParams.search;
  
  let query = supabase.from('Movie').select('*');
  
  if (filter) {
    query = query.eq('type', filter);
  }
  
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data: moviesData, error } = await query;
  const movies = moviesData || [];


  if (filter || search) {
    const isTodoActive = !filter && !search;
    const isPeliculasActive = filter === 'movie';
    const isSeriesActive = filter === 'series';

    return (
      <div className="search-layout">
        <div className="search-pills">
          <Link href="/" className={`search-pill ${isTodoActive ? 'active' : ''}`}>TODO</Link>
          <Link href="/?filter=movie" className={`search-pill ${isPeliculasActive ? 'active' : ''}`}>PELÍCULAS</Link>
          <Link href="/?filter=series" className={`search-pill ${isSeriesActive ? 'active' : ''}`}>SERIES</Link>
          <Link href="/?filter=accion" className="search-pill">ACCIÓN</Link>
          <Link href="/?filter=terror" className="search-pill">TERROR</Link>
          <Link href="/?filter=comedia" className="search-pill">COMEDIA</Link>
        </div>

        <div className="search-stats">
          {movies.length} RESULTADO{movies.length !== 1 ? 'S' : ''}
        </div>

        <div className="search-section-title">
          {filter ? filter.toUpperCase() : (search ? `BÚSQUEDA: ${search}` : 'TODO')}
        </div>

        <div className="search-grid">
          {movies.map(movie => (
            <Link href={`/movie/${movie.id}`} key={movie.id} className="search-card">
              <div className="search-card-poster">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={movie.coverUrl} alt={movie.title} title={movie.title} />
                <div className="movie-badge">
                  <div className="star">★ {movie.rating || '8.0'}</div>
                  <div>{movie.year || '2024'}</div>
                </div>
              </div>
              <div className="search-card-title">{movie.title}</div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Destacar películas para el carrusel
  const featuredMovies = movies.filter(m => m.bannerUrl && m.bannerUrl.trim() !== '').slice(0, 5);
  
  if (featuredMovies.length === 0 && movies.length > 0) {
    featuredMovies.push(...movies.slice(0, 5));
  }

  return (
    <>
      <HeroCarousel movies={featuredMovies} />

      {/* Movie Rows */}
      <div style={{ marginTop: '-4vw', paddingBottom: '4rem' }}>
        
        {/* "Recién añadidas" siempre primero */}
        <div style={{ marginTop: '0' }}>
          <MovieRow title="RECIÉN AÑADIDAS" movies={movies.slice(0, 15)} />
        </div>

        {PREDEFINED_LISTS.map((list, index) => {
          // Filtrar las películas que pertenecen a esta lista
          const listMovies = movies.filter(m => {
            if (!m.lists) return false;
            const listsArray = m.lists.split(',').map((l: string) => l.trim());
            return listsArray.includes(list.id);
          });

          // Si la lista no tiene películas, no la mostramos
          if (listMovies.length === 0) return null;

          return (
            <div key={list.id} style={{ marginTop: '3rem' }}>
              <MovieRow title={list.title.toUpperCase()} movies={listMovies} />
            </div>
          );
        })}
      </div>
    </>
  );
}
