import { supabase } from '@/lib/supabase';
import HeroCarousel from '@/components/HeroCarousel';
import MovieRow from '@/components/MovieRow';
import Link from 'next/link';
import { PREDEFINED_LISTS } from '@/lib/constants';
import AdBanner from '@/components/AdBanner';

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

  // Destacar películas para el carrusel (usando la lista 'carrusel')
  const featuredMovies = movies.filter(m => {
    if (!m.lists) return false;
    return m.lists.split(',').map((l: string) => l.trim()).includes('carrusel');
  }).slice(0, 10); // Permitimos hasta 10 en el carrusel si el admin los añade
  
  if (featuredMovies.length === 0 && movies.length > 0) {
    const fallbackMovies = movies.filter(m => m.bannerUrl && m.bannerUrl.trim() !== '');
    featuredMovies.push(...fallbackMovies.slice(0, 5));
    if (featuredMovies.length === 0) {
      featuredMovies.push(...movies.slice(0, 5));
    }
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

        {(() => {
          const renderedLists = PREDEFINED_LISTS.filter(list => list.id !== 'carrusel').map(list => {
            const listMovies = movies.filter(m => {
              if (list.id === 'accion' && m.type === 'accion') return true;
              if (!m.lists) return false;
              const listsArray = m.lists.split(',').map((l: string) => l.trim());
              return listsArray.includes(list.id);
            });
            return { list, listMovies };
          }).filter(item => item.listMovies.length > 0);

          return renderedLists.map(({ list, listMovies }, index) => (
            <div key={list.id} style={{ marginTop: '3rem' }}>
              {index === 0 && <AdBanner />}
              <MovieRow title={list.title.toUpperCase()} movies={listMovies} />
            </div>
          ));
        })()}
      </div>
    </>
  );
}
