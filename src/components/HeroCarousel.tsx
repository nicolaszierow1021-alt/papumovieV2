'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Movie {
  id: string;
  title: string;
  synopsis: string | null;
  coverUrl: string;
  bannerUrl: string | null;
}

export default function HeroCarousel({ movies }: { movies: Movie[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (movies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 6000); // 6 seconds

    return () => clearInterval(interval);
  }, [movies.length]);

  if (!movies || movies.length === 0) return null;

  return (
    <section className="hero-banner carousel-container">
      {movies.map((movie, index) => {
        const isActive = index === currentIndex;
        return (
          <div 
            key={movie.id} 
            className={`carousel-slide ${isActive ? 'active' : ''}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={movie.bannerUrl || movie.coverUrl} 
              alt={movie.title} 
              className="hero-bg" 
            />
            <div className="hero-vignette"></div>

            <div className="hero-content">
              <h1 className="heading-ELPAPUCINEFILO hero-title">{movie.title}</h1>
              <p className="hero-synopsis">
                {movie.synopsis || "Narra la vida de los protagonistas más allá de sus mayores éxitos, recorriendo su trayectoria desde el descubrimiento de su extraordinario talento hasta convertirse en leyendas."}
              </p>
              <Link href={`/movie/${movie.id}`} className="btn-pill-white" style={{ pointerEvents: isActive ? 'auto' : 'none' }}>
                <span className="btn-accent-line"></span> VER AHORA
              </Link>
            </div>
          </div>
        );
      })}

      {/* Navigation Dots */}
      {movies.length > 1 && (
        <div className="carousel-dots">
          {movies.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
