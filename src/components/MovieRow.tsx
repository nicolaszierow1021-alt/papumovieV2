import Link from 'next/link';
import { cleanTitle } from '../utils/cleanTitle';

interface Movie {
  id: string;
  title: string;
  coverUrl: string;
  bannerUrl?: string | null;
  logoUrl?: string | null;
  rating?: string;
  year?: string;
  type?: string;
  duration?: string;
  genres?: string;
}

export default function MovieRow({ title, movies, isOverlapping = false }: { title: string, movies: Movie[], isOverlapping?: boolean }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className={isOverlapping ? "overlap-row" : ""} style={!isOverlapping ? { padding: '0 40px', marginBottom: '56px' } : {}}>
      {!isOverlapping && (
        <h2 className="animated-section-title">
          {title}
        </h2>
      )}
      <div className="overlap-track">
        {movies.map((movie) => (
          <Link href={`/movie/${movie.id}`} key={movie.id} className="poster-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={movie.bannerUrl || movie.coverUrl} alt={movie.title} />
            
            <div className="card-overlay">
              {movie.logoUrl ? (
                <div className="card-logo-wrapper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={movie.logoUrl} alt={cleanTitle(movie.title)} className="card-logo-img" />
                </div>
              ) : (
                <div className="card-title-fallback">
                  {cleanTitle(movie.title)}
                </div>
              )}
              <div className="card-meta-hover">
                <div className="card-meta-row">
                  <span style={{ color: 'var(--rating-green)' }}>★ {movie.rating || 'N/A'}</span>
                  <span className="dot">·</span>
                  <span>{movie.duration || (movie.type === 'series' ? 'Serie' : '1h 30m')}</span>
                  <span className="dot">·</span>
                  <span>{movie.year || '2024'}</span>
                </div>
                <div className="card-genres-hover">
                  {movie.genres || 'Drama, Acción'}
                </div>
              </div>
            </div>

            <div className="poster-card-play">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
