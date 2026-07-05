import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://idlqwktqsiikbebexnow.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkbHF3a3Rxc2lpa2JlYmV4bm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NTMxMTMsImV4cCI6MjA5NzIyOTExM30.k0TlDoqfAU6w-dMbWZ0oRT8pi-yVuOAbmPZF2b-ec8Y';
const TMDB_API_KEY = 'c71d55c790adcb0fa9ea6ebcbc9a61a7';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('Obteniendo películas que no tienen trailer...');
  
  const { data: movies, error } = await supabase
    .from('Movie')
    .select('id, title, type, trailerUrl');
    
  if (error) {
    console.error('Error fetching movies:', error);
    return;
  }

  const moviesWithoutTrailer = movies.filter(m => !m.trailerUrl || m.trailerUrl.trim() === '');
  console.log(`Se encontraron ${moviesWithoutTrailer.length} películas sin trailer. Iniciando asignación...`);

  let count = 0;

  for (const movie of moviesWithoutTrailer) {
    console.log(`Buscando trailer [${count + 1}/${moviesWithoutTrailer.length}]: ${movie.title}`);
    const isSerie = movie.type === 'series';
    
    // Paso 1: Buscar en TMDB por título para obtener el ID
    const searchEndpoint = isSerie
      ? `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&language=es&query=${encodeURIComponent(movie.title)}`
      : `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=es&query=${encodeURIComponent(movie.title)}`;

    try {
      const searchRes = await fetch(searchEndpoint);
      const searchData = await searchRes.json();

      if (searchData.results && searchData.results.length > 0) {
        const tmdbId = searchData.results[0].id;
        
        // Paso 2: Obtener videos de ese ID
        const videosEndpoint = isSerie
          ? `https://api.themoviedb.org/3/tv/${tmdbId}/videos?api_key=${TMDB_API_KEY}&language=es`
          : `https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}&language=es`;
          
        const videosRes = await fetch(videosEndpoint);
        const videosData = await videosRes.json();
        
        let trailerKey = null;
        
        if (videosData.results && videosData.results.length > 0) {
          // Buscar trailer en español
          const esTrailer = videosData.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
          if (esTrailer) trailerKey = esTrailer.key;
        }

        // Si no hay trailer en español, buscar en inglés
        if (!trailerKey) {
          const videosEnEndpoint = isSerie
            ? `https://api.themoviedb.org/3/tv/${tmdbId}/videos?api_key=${TMDB_API_KEY}`
            : `https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}`;
          const videosEnRes = await fetch(videosEnEndpoint);
          const videosEnData = await videosEnRes.json();
          if (videosEnData.results && videosEnData.results.length > 0) {
            const enTrailer = videosEnData.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
            if (enTrailer) trailerKey = enTrailer.key;
          }
        }

        if (trailerKey) {
          const trailerUrl = `https://www.youtube.com/watch?v=${trailerKey}`;
          const { error: updateError } = await supabase
            .from('Movie')
            .update({ trailerUrl })
            .eq('id', movie.id);

          if (updateError) {
            console.error(`  - Error actualizando ${movie.title}:`, updateError.message);
          } else {
            console.log(`  + Guardado: ${trailerUrl}`);
          }
        } else {
          console.log(`  - No se encontró ningún trailer en TMDB para esta película.`);
        }

      } else {
        console.log(`  - No se encontró la película en TMDB.`);
      }
    } catch (e) {
      console.error(`  - Error conectando con TMDB para ${movie.title}:`, e.message);
    }

    count++;
    await sleep(300); // Evitar rate-limit de TMDB
  }

  console.log('✅ Proceso completado.');
}

main();
