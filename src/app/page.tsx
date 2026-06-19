import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ filter?: string, search?: string }> }) {
  const resolvedParams = await searchParams;
  const filter = resolvedParams.filter;
  const search = resolvedParams.search;
  
  let query = supabase.from('Movie').select('*').order('createdAt', { ascending: false });
  
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

  const featuredMovies = movies.slice(0, 5);
  const recentMovies = movies.slice(0, 10);
  const trendingMovies = movies.slice(5, 15);

  return (
    <>
      <HeroCarousel movies={featuredMovies} />

      {/* Movie Rows */}
      <div style={{ marginTop: '-4vw', paddingBottom: '4rem' }}>

        <section className="row-container">
          <h2 className="heading-ELPAPUCINEFILO row-title">TENDENCIAS AHORA</h2>
          <div className="movie-row">
            {recentMovies.map(movie => (
              <Link href={`/movie/${movie.id}`} key={movie.id} className="movie-poster">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={movie.coverUrl} alt={movie.title} title={movie.title} />
                <div className="movie-badge">
                  <div className="star">★ {movie.rating || '8.0'}</div>
                  <div>{movie.year || '2024'}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="row-container" style={{ marginTop: '3rem' }}>
          <h2 className="heading-ELPAPUCINEFILO row-title">RECOMENDADOS PARA TI</h2>
          <div className="movie-row">
            {trendingMovies.map(movie => (
              <Link href={`/movie/${movie.id}`} key={movie.id} className="movie-poster">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={movie.coverUrl} alt={movie.title} title={movie.title} />
                <div className="movie-badge">
                  <div className="star">★ {movie.rating || '8.5'}</div>
                  <div>{movie.year || '2024'}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
