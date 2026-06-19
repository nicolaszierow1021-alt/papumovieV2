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
        ? `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${apiKey}&language=es&append_to_response=credits,videos`
        : `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&language=es&append_to_response=credits,videos`;

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

          const director = data.credits?.crew?.find((member: any) => member.job === 'Director')?.name;
          fillInputs('director', director || 'Desconocido');
        }

        const trailer = data.videos?.results?.find((vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube');
        fillInputs('trailerUrl', trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '');

        fillInputs('rating', data.vote_average ? data.vote_average.toFixed(1) : '');
        fillInputs('coverUrl', data.poster_path ? `https://image.tmdb.org/t/p/original${data.poster_path}` : '');
        fillInputs('bannerUrl', data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : ''); 

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
    <div className="form-group full" style={{ backgroundColor: 'rgba(29, 78, 216, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px dashed #1d4ed8', marginBottom: '2rem' }}>
      <label htmlFor="tmdbId" className="form-label" style={{ color: '#60a5fa' }}>⚡ Auto-Completar con TMDB</label>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <input 
          type="text" 
          id="tmdbId" 
          value={tmdbId}
          onChange={(e) => setTmdbId(e.target.value)}
          className="form-input" 
          placeholder="Pega aquí el ID de TMDB (Ej: 460465)" 
          style={{ flex: 1 }}
        />
        <button 
          type="button" 
          onClick={handleAutoFill} 
          disabled={isLoading}
          className="btn-primary" 
          style={{ backgroundColor: '#1d4ed8', border: 'none', padding: '0 2rem' }}
        >
          {isLoading ? 'Cargando...' : 'Autocompletar'}
        </button>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.5rem' }}>
        Selecciona primero si es Película o Serie abajo, luego pega el ID numérico de la URL de themoviedb.org y presiona el botón.
      </p>
    </div>
  );
}
