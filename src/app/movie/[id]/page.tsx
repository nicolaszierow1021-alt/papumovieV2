import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { cleanTitle } from '../../../utils/cleanTitle';
import TrailerPlayer from '@/components/movie/TrailerPlayer';
import DownloadModal from '@/components/movie/DownloadModal';

const BASE_URL = 'https://papumoviemkv.store';

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const { data: movie } = await supabase
    .from('Movie')
    .select('title, synopsis, coverUrl, year, director')
    .eq('id', id)
    .single();

  if (!movie) {
    return { title: 'Película no encontrada' };
  }

  const title = `${movie.title} (${movie.year || '2024'}) - Descargar MKV HD`;
  const description =
    movie.synopsis
      ? movie.synopsis.slice(0, 160)
      : `Descarga ${movie.title} en HD gratis. Dirigida por ${movie.director || 'Desconocido'}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/movie/${id}`,
      siteName: 'PAPU MOVIE',
      images: movie.coverUrl
        ? [{ url: movie.coverUrl, width: 500, height: 750, alt: movie.title }]
        : [],
      type: 'video.movie',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: movie.coverUrl ? [movie.coverUrl] : [],
    },
    alternates: {
      canonical: `${BASE_URL}/movie/${id}`,
    },
  };
}

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: movie } = await supabase
    .from('Movie')
    .select('*')
    .eq('id', id)
    .single();

  if (!movie) {
    notFound();
  }

  const { data: relatedMoviesData } = await supabase
    .from('Movie')
    .select('*')
    .eq('type', movie.type)
    .neq('id', id)
    .order('createdAt', { ascending: false })
    .limit(15);
    
  const relatedMovies = relatedMoviesData || [];

  // Fetch Cast on-the-fly using TMDB Search
  let cast: { id: number; name: string; character: string; profile_path: string | null }[] = [];
  try {
    const apiKey = 'c71d55c790adcb0fa9ea6ebcbc9a61a7';
    const isSerie = movie.type === 'series';
    const searchUrl = isSerie 
      ? `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(movie.title)}&api_key=${apiKey}&language=es`
      : `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie.title)}&api_key=${apiKey}&language=es`;
      
    const searchRes = await fetch(searchUrl);
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const tmdbId = searchData.results[0]?.id;
      
      if (tmdbId) {
        const creditsUrl = isSerie
          ? `https://api.themoviedb.org/3/tv/${tmdbId}/credits?api_key=${apiKey}&language=es`
          : `https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${apiKey}&language=es`;
          
        const creditsRes = await fetch(creditsUrl);
        if (creditsRes.ok) {
          const creditsData = await creditsRes.json();
          cast = creditsData.cast || [];
        }
      }
    }
  } catch (error) {
    console.error("Error fetching cast", error);
  }

  let downloadLinks: { id: string; server: string; details: string; url: string }[] = [];
  if (movie.downloadUrl) {
    try {
      const parsed = JSON.parse(movie.downloadUrl);
      if (Array.isArray(parsed)) {
        downloadLinks = parsed;
      } else {
        downloadLinks = [{ id: '1', server: 'Descarga', details: 'Principal', url: movie.downloadUrl }];
      }
    } catch (e) {
      downloadLinks = [{ id: '1', server: 'Descarga', details: 'Principal', url: movie.downloadUrl }];
    }
  }

  return (
    <div className="movie-detail-page">
      
      {/* Top Logo Section */}
      <div className="movie-detail-header-logo">
        {movie.logoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={movie.logoUrl} alt={movie.title} className="detail-logo-img" />
        ) : (
          <h1 className="detail-logo-text">{movie.title}</h1>
        )}
      </div>

      {/* Cinematic Player Container */}
      <div className="movie-player-wrapper">
        <TrailerPlayer movie={{
          title: movie.title,
          bannerUrl: movie.bannerUrl,
          coverUrl: movie.coverUrl,
          trailerUrl: movie.trailerUrl,
          year: movie.year,
          rating: movie.rating,
          genres: movie.lists // Usamos las categorías como género visual
        }} />
      </div>

      {/* Content Section (Links, Cast, Related) */}
      <div className="movie-detail-content" id="enlaces-descarga">
        
        <div className="movie-content-grid">
          {/* Columna Izquierda: Sinopsis y Reparto */}
          <div className="movie-content-left">
            <div className="info-section">
              <h3>Sinopsis</h3>
              <p>{movie.synopsis || "Sinopsis no disponible en español para este título."}</p>
              {movie.director && (
                <div className="director-info">
                  <span>Director:</span> {movie.director}
                </div>
              )}
            </div>

            {cast.length > 0 && (
              <div className="info-section">
                <h3>Reparto Principal</h3>
                <div className="cast-list">
                  {cast.slice(0, 8).map(actor => (
                    <div key={actor.id} className="cast-avatar">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/150x150/1a1a1a/ffffff?text=No+Photo'} 
                        alt={actor.name} 
                      />
                      <div className="cast-names">
                        <span className="cast-real-name">{actor.name}</span>
                        <span className="cast-character-name">{actor.character}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Columna Derecha: Tarjeta de Descarga Premium */}
          <div className="movie-content-right">
            <div className="premium-download-card">
              <h3>Opciones de Descarga</h3>
              
              <div className="tech-specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Resolución</span>
                  <span className="spec-value">{movie.resolution || '1080p HD'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Formato</span>
                  <span className="spec-value">{movie.format || 'MKV'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Audio</span>
                  <span className="spec-value">{movie.audio || 'Español Latino'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Contraseña</span>
                  <span className="spec-value highlight">{movie.password || 'el_papu_cinefilo'}</span>
                </div>
              </div>

              <DownloadModal movieTitle={movie.title} downloadLinks={downloadLinks} />

              {movie.trailerUrl && (
                <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="premium-trailer-btn">
                  Ver Tráiler Oficial
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Películas Relacionadas */}
        {relatedMovies.length > 0 && (
          <div className="related-movies-section">
            <h2 className="animated-section-title">También te puede gustar</h2>
            <div className="movie-grid">
              {relatedMovies.map(related => (
                <Link href={`/movie/${related.id}`} key={related.id} className="poster-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={related.bannerUrl || related.coverUrl} alt={related.title} />
                  
                  <div className="card-overlay">
                    {related.logoUrl ? (
                      <div className="card-logo-wrapper">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={related.logoUrl} alt={cleanTitle(related.title)} className="card-logo-img" />
                      </div>
                    ) : (
                      <div className="card-title-fallback">
                        {cleanTitle(related.title)}
                      </div>
                    )}
                    <div className="card-meta-hover">
                      <div className="card-meta-row">
                        <span style={{ color: 'var(--rating-green)' }}>★ {related.rating || 'N/A'}</span>
                        <span className="dot">·</span>
                        <span>{related.duration || (related.type === 'series' ? 'Serie' : '1h 30m')}</span>
                        <span className="dot">·</span>
                        <span>{related.year || '2024'}</span>
                      </div>
                      <div className="card-genres-hover">
                        {related.genres || 'Drama, Acción'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
