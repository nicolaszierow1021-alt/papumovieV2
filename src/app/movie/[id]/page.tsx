import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

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
  let cast: any[] = [];
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

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh', paddingBottom: '4rem', overflowX: 'hidden' }}>
      {/* Dark Blurred Backdrop */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0, opacity: 0.3 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={movie.bannerUrl || movie.coverUrl}
          alt="Backdrop"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(30px) brightness(0.4)', transform: 'scale(1.2)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(11,11,11,1) 0%, rgba(11,11,11,0.6) 40%, transparent 100%)' }}></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          .details-flex {
            flex-direction: column !important;
            align-items: center !important;
            gap: 2rem !important;
          }
          .details-poster {
            flex: 0 0 auto !important;
            width: 100% !important;
            max-width: 350px !important;
            margin: 0 auto !important;
          }
          .details-info {
            padding-top: 0 !important;
          }
        }
      `}} />

      <div className="container details-container" style={{ position: 'relative', zIndex: 10, paddingTop: '85px', paddingLeft: '4%', paddingRight: '4%' }}>

        <Link href="/" className="details-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>

        <div className="details-flex" style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start' }}>

          {/* Main Poster */}
          <div className="details-poster" style={{ flex: '0 0 350px', width: '350px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={movie.coverUrl}
              alt={movie.title}
              style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}
            />
          </div>

          {/* Movie Details */}
          <div className="details-info" style={{ flex: '1', paddingTop: '1rem', maxWidth: '800px', width: '100%' }}>

            <div className="gold-label">
              ★ NOMINADA A PREMIOS DE LA ACADEMIA
            </div>

            <h1 className="heading-ELPAPUCINEFILO" style={{ fontSize: '4.5rem', letterSpacing: '-1px', marginBottom: '1rem', lineHeight: 1 }}>
              {movie.title}
            </h1>

            <div className="details-subinfo">
              <span className="details-year">{movie.year || '2024'}</span>
              <span className="details-rating">★ {movie.rating || '8.0'}</span>
              {movie.duration && (
                <span className="details-duration" style={{ color: 'var(--text-muted)' }}>• {movie.duration}</span>
              )}
              <span className="details-director">Director: {movie.director || 'Desconocido'}</span>
            </div>

            <div style={{ marginBottom: '2.5rem', marginTop: '1.5rem' }}>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#A3A3A3' }}>
                {movie.synopsis || "Los campeones favoritos de los fans se enfrentan entre sí en la batalla definitiva, sangrienta y sin reglas, para derrotar el oscuro dominio que amenaza con destruir el Reino de la Tierra y a sus defensores."}
              </p>
            </div>

            {/* Action Buttons Row */}
            <div className="action-row">
              <a href={movie.downloadUrl} target="_blank" rel="noopener noreferrer" className="btn-pill-red">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z" />
                </svg>
                {movie.type === 'series' ? 'DESCARGAR SERIE' : 'DESCARGAR PELICULA'}
              </a>

              {movie.trailerUrl && (
                <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="btn-pill-outline">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                  </svg>
                  VER TRAILER
                </a>
              )}

              <div className="icon-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div className="icon-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </div>
              <div className="icon-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </div>
              <div className="icon-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              </div>
            </div>

            {/* Technical Specifications Grid (Kept for functionality) */}
            <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="details-tech-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Formato</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{movie.format || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Resolución</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{movie.resolution || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Audio</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{movie.audio || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Subtítulos</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{movie.subtitles || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Contraseña</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-primary)' }}>{movie.password || 'el_papu_cinefilo'}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* REPARTO PRINCIPAL */}
        {cast.length > 0 && (
          <div style={{ marginTop: '5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
            <h2 className="heading-ELPAPUCINEFILO row-title" style={{ fontSize: '1.2rem', color: '#A3A3A3', letterSpacing: '2px' }}>
              REPARTO PRINCIPAL
            </h2>
            <div className="cast-list">
              {cast.map(actor => (
                <div key={actor.id} className="cast-item">
                  <div className="cast-img-wrapper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/150x150/1a1a1a/ffffff?text=No+Photo'} 
                      alt={actor.name} 
                      className="cast-img"
                    />
                  </div>
                  <div className="cast-name">{actor.name}</div>
                  <div className="cast-character">{actor.character}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAMBIÉN TE PUEDE GUSTAR */}
        <div style={{ marginTop: '5rem', marginBottom: '2rem' }}>
          <h2 className="heading-ELPAPUCINEFILO row-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ display: 'inline-block', width: '4px', height: '24px', backgroundColor: 'var(--accent-primary)', borderRadius: '2px' }}></span>
            TAMBIÉN TE PUEDE GUSTAR
          </h2>
          <div className="movie-row">
            {relatedMovies.map(related => (
              <Link href={`/movie/${related.id}`} key={related.id} className="movie-poster">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={related.coverUrl} alt={related.title} title={related.title} />
                <div className="movie-badge">
                  <div className="star">★ {related.rating || '8.0'}</div>
                  <div>{related.year || '2024'}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
