'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cleanTitle } from '../utils/cleanTitle';

interface Movie {
  id: string;
  title: string;
  synopsis: string | null;
  coverUrl: string;
  bannerUrl?: string | null;
  logoUrl?: string | null;
  rating?: string;
  year?: string;
  type?: string;
  duration?: string;
  genres?: string;
}

export default function HeroCarousel({ movies }: { movies: Movie[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!movies || movies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [movies?.length]);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  return (
    <section className="hero-wrapper">
      {/* Backdrops con Crossfade */}
      {movies.map((movie, index) => (
        <div 
          key={movie.id} 
          className="hero-backdrop-layer" 
          style={{ 
            opacity: index === currentIndex ? 1 : 0,
            pointerEvents: index === currentIndex ? 'auto' : 'none'
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={movie.bannerUrl || movie.coverUrl} 
            alt={movie.title} 
            className="hero-backdrop" 
          />
          <div className="hero-shade"></div>
        </div>
      ))}

      {/* Flechas de Navegación */}
      <button className="hero-arrow hero-arrow-prev" onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <button className="hero-arrow hero-arrow-next" onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>

      {/* Información de la Película Actual */}
      <div className="hero-info">
        {currentMovie.logoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={currentMovie.logoUrl} alt={cleanTitle(currentMovie.title)} className="hero-logo-img" />
        ) : (
          <h1 className="hero-title">{cleanTitle(currentMovie.title)}</h1>
        )}

        <div className="hero-meta">
          <span className="hero-rating-circle">{currentMovie.rating || '7.5'}</span>
          <span className="hero-dot">·</span>
          <span className="hero-genres-text">{currentMovie.year || '2024'}</span>
          <span className="hero-dot">·</span>
          <span className="hero-genres-text">{currentMovie.duration || (currentMovie.type === 'series' ? 'Serie' : '1h 30m')}</span>
          <span className="hero-dot">·</span>
          <span className="hero-genres-text">{currentMovie.genres || 'Acción, Aventura'}</span>
        </div>
        
        <Link href={`/movie/${currentMovie.id}`} className="hero-watch-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5v14l11-7z"/>
          </svg>
          VER AHORA
        </Link>
      </div>

      {/* Miniaturas */}
      <div className="hero-thumbs">
        {movies.map((movie, index) => (
          <button 
            key={movie.id} 
            className={`hero-thumb-btn ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={movie.coverUrl} alt={movie.title} />
          </button>
        ))}
      </div>
    </section>
  );
}
