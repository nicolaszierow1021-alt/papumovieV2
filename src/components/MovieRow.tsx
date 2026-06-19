'use client';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';

interface Movie {
  id: string;
  title: string;
  coverUrl: string;
  rating?: string;
  year?: string;
}

export default function MovieRow({ title, movies }: { title: string, movies: Movie[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  return (
    <section 
      className="row-container" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative' }}
    >
      <h2 className="heading-ELPAPUCINEFILO row-title">{title}</h2>
      
      <div 
        className="movie-row-wrapper" 
        style={{ position: 'relative' }}
      >
        {/* Left Arrow */}
        <button
          className={`scroll-button scroll-left ${showLeft && isHovered ? 'visible' : ''}`}
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        {/* Scroll Container */}
        <div 
          className="movie-row" 
          ref={rowRef} 
          onScroll={handleScroll}
        >
          {movies.map(movie => (
            <Link href={`/movie/${movie.id}`} key={movie.id} className="movie-poster">
              <div className="movie-poster-img-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={movie.coverUrl} alt={movie.title} title={movie.title} />
                <div className="movie-badge">
                  <div className="star">★ {movie.rating || '8.0'}</div>
                  <div>{movie.year || '2024'}</div>
                </div>
              </div>
              <div className="movie-poster-title">{movie.title}</div>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className={`scroll-button scroll-right ${showRight && isHovered ? 'visible' : ''}`}
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <style>{`
        .scroll-button {
          position: absolute;
          top: 45%;
          transform: translateY(-50%);
          z-index: 20;
          background-color: rgba(0, 0, 0, 0.75);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.6);
        }
        .scroll-button:hover {
          background-color: #E50914;
          border-color: #E50914;
          transform: translateY(-50%) scale(1.1);
        }
        .scroll-button.visible {
          opacity: 1;
          visibility: visible;
        }
        .scroll-left {
          left: -25px;
        }
        .scroll-right {
          right: -25px;
        }
        
        /* Ocultar botones en móviles porque pueden usar el táctil */
        @media (max-width: 768px) {
          .scroll-button {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
