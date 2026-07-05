'use client';
import { useState } from 'react';

export default function TmdbAutoFill() {
  const [tmdbId, setTmdbId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = 'c71d55c790adcb0fa9ea6ebcbc9a61a7';

  const fillInputs = (id: string, value: string) => {
    const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    if (el) {
      el.value = value;
    }
  };

  const handleAutoFill = async () => {
    if (!tmdbId) {
      alert("Por favor ingresa un ID de TMDB");
      return;
    }

    setIsLoading(true);
    try {
      const typeEl = document.getElementById('type') as HTMLSelectElement;
      const isSerie = typeEl?.value === 'series';

      const url = isSerie 
        ? `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${apiKey}&language=es&append_to_response=credits,videos,images&include_image_language=es,en,null`
        : `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&language=es&append_to_response=credits,videos,images&include_image_language=es,en,null`;

      const response = await fetch(url);
      
      if (response.status === 200) {
        const data = await response.json();
        
        if (isSerie) {
          fillInputs('title', data.name || '');
          fillInputs('synopsis', data.overview || 'Sinopsis no disponible en español.');
          fillInputs('year', (data.first_air_date || '').slice(0, 4));
          fillInputs('duration', data.episode_run_time?.[0] ? `${data.episode_run_time[0]} Min. por Ep.` : '');
          
          const creator = data.created_by?.[0]?.name;
          fillInputs('director', creator || 'Desconocido');
        } else {
          fillInputs('title', data.title || '');
          fillInputs('synopsis', data.overview || 'Sinopsis no disponible en español.');
          fillInputs('year', (data.release_date || '').slice(0, 4));
          fillInputs('duration', data.runtime ? `${data.runtime} Min.` : '');

          const director = data.credits?.crew?.find((member: { job?: string; name?: string }) => member.job === 'Director')?.name;
          fillInputs('director', director || 'Desconocido');
        }

        const trailer = data.videos?.results?.find((vid: { type?: string; site?: string; key?: string }) => vid.type === 'Trailer' && vid.site === 'YouTube');
        fillInputs('trailerUrl', trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '');

        fillInputs('rating', data.vote_average ? data.vote_average.toFixed(1) : '');
        fillInputs('coverUrl', data.poster_path ? `https://image.tmdb.org/t/p/original${data.poster_path}` : '');
        fillInputs('bannerUrl', data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : ''); 

        const logos = data.images?.logos;
        if (logos && logos.length > 0) {
          const esLogo = logos.find((l: any) => l.iso_639_1 === 'es');
          const enLogo = logos.find((l: any) => l.iso_639_1 === 'en');
          const fallbackLogo = logos[0];
          const bestLogo = esLogo || enLogo || fallbackLogo;
          fillInputs('logoUrl', `https://image.tmdb.org/t/p/original${bestLogo.file_path}`);
        } else {
          fillInputs('logoUrl', '');
        }

      } else if (response.status === 404) {
        alert('No existe en TMDB. Revisa el ID o si seleccionaste Película/Serie correctamente.');
      } else {
        alert('Error conectando con TMDB.');
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al cargar los datos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tmdb-autofill-container">
      <label htmlFor="tmdbId" className="tmdb-autofill-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
        Auto-Completar con TMDB
      </label>
      <div className="tmdb-autofill-flex">
        <input 
          type="text" 
          id="tmdbId" 
          value={tmdbId}
          onChange={(e) => setTmdbId(e.target.value)}
          className="tmdb-autofill-input" 
          placeholder="ID de TMDB (Ej: 460465)" 
        />
        <button 
          type="button" 
          onClick={handleAutoFill} 
          disabled={isLoading}
          className="tmdb-autofill-btn"
        >
          {isLoading ? 'Cargando...' : 'Autocompletar'}
        </button>
      </div>
      <p className="tmdb-autofill-hint">
        Selecciona primero si es Película o Serie, luego pega el ID numérico de themoviedb.org
      </p>

      <style>{`
        .tmdb-autofill-container {
          background-color: rgba(29, 78, 216, 0.08);
          padding: 1.25rem;
          border-radius: 12px;
          border: 1px dashed rgba(59, 130, 246, 0.4);
          margin-bottom: 2rem;
        }
        .tmdb-autofill-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #60a5fa;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 0.75rem;
        }
        .tmdb-autofill-flex {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .tmdb-autofill-input {
          flex: 1;
          background-color: #0f0f0f;
          border: 1px solid #1e3a8a;
          color: #e5e5e5;
          padding: 0.65rem 0.9rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-family: inherit;
          min-width: 0; /* Prevents input from overflowing flex container */
          transition: border-color 0.2s;
        }
        .tmdb-autofill-input:focus {
          border-color: #3b82f6;
          outline: none;
        }
        .tmdb-autofill-btn {
          background-color: #1d4ed8;
          color: #fff;
          border: none;
          padding: 0.7rem 1.5rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          transition: background-color 0.2s;
        }
        .tmdb-autofill-btn:hover:not(:disabled) {
          background-color: #2563eb;
        }
        .tmdb-autofill-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .tmdb-autofill-hint {
          font-size: 0.75rem;
          color: #888;
          margin-top: 0.75rem;
          line-height: 1.4;
        }

        /* Mobile Responsive */
        @media (max-width: 600px) {
          .tmdb-autofill-flex {
            flex-direction: column;
            align-items: stretch;
          }
          .tmdb-autofill-btn {
            width: 100%;
            padding: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
