'use client';

import { useState } from 'react';

interface TrailerPlayerProps {
  movie: {
    title: string;
    bannerUrl?: string;
    coverUrl?: string;
    trailerUrl?: string;
    year?: string;
    rating?: string;
    genres?: string;
  };
}

export default function TrailerPlayer({ movie }: TrailerPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extraer el ID de YouTube
  let youtubeId = '';
  if (movie.trailerUrl) {
    const match = movie.trailerUrl.match(/[?&]v=([^&]+)/);
    if (match) {
      youtubeId = match[1];
    } else {
      // Intentar extraer de urls cortas como youtu.be/ID
      const shortMatch = movie.trailerUrl.match(/youtu\.be\/([^?]+)/);
      if (shortMatch) youtubeId = shortMatch[1];
    }
  }

  const bgImage = movie.bannerUrl || movie.coverUrl;

  return (
    <div className="movie-player-container">
      <div className="movie-player-bg">
        {isPlaying && youtubeId ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          ></iframe>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={bgImage} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>
      
      {!isPlaying && (
        <div className="movie-player-overlay">
          {/* Metadata Bottom Left */}
          <div className="movie-player-meta">
            <span className="server-badge">TRÁILER</span>
            <h2 className="movie-player-title">{movie.title}</h2>
            <div className="movie-player-info">
              <span>{movie.year || '2024'}</span>
              <span className="dot">·</span>
              <span className="imdb-rating">IMDb: {movie.rating || '8.0'}</span>
              <span className="dot">·</span>
              <span>{movie.genres || 'Drama, Suspenso'}</span>
            </div>
          </div>

          {/* Play Button Bottom Right */}
          {youtubeId ? (
            <button 
              onClick={() => setIsPlaying(true)} 
              className="big-play-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          ) : (
            <a href="#enlaces-descarga" className="big-play-btn">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
