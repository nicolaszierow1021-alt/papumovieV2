import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://idlqwktqsiikbebexnow.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkbHF3a3Rxc2lpa2JlYmV4bm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NTMxMTMsImV4cCI6MjA5NzIyOTExM30.k0TlDoqfAU6w-dMbWZ0oRT8pi-yVuOAbmPZF2b-ec8Y';
const TMDB_API_KEY = 'c71d55c790adcb0fa9ea6ebcbc9a61a7';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const genreMap = {
  // Movies
  28: 'accion',
  12: 'accion',
  16: 'anime',
  35: 'comedia',
  27: 'terror-suspenso',
  9648: 'terror-suspenso',
  53: 'terror-suspenso',
  10749: 'romance',
  878: 'sci-fi',
  14: 'sci-fi',
  // TV
  10759: 'accion',
  10765: 'sci-fi',
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('Obteniendo todas las películas de Supabase...');
  const { data: movies, error } = await supabase.from('Movie').select('id, title, type');
  
  if (error) {
    console.error('Error fetching movies:', error);
    return;
  }

  console.log(`Se encontraron ${movies.length} películas. Iniciando asignación...`);

  let count = 0;

  for (const movie of movies) {
    console.log(`Procesando [${count + 1}/${movies.length}]: ${movie.title}`);
    const isSerie = movie.type === 'series';
    
    // Buscar en TMDB
    const endpoint = isSerie
      ? `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&language=es&query=${encodeURIComponent(movie.title)}`
      : `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=es&query=${encodeURIComponent(movie.title)}`;

    try {
      const res = await fetch(endpoint);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const tmdbMovie = data.results[0]; // Tomar el mejor resultado
        
        let lists = new Set();
        
        // Tipo básico
        lists.add(isSerie ? 'series' : 'peliculas');

        // Mapear géneros
        if (tmdbMovie.genre_ids) {
          for (const genreId of tmdbMovie.genre_ids) {
            if (genreMap[genreId]) {
              lists.add(genreMap[genreId]);
            }
          }
        }

        // Popularidad / Tendencias
        if (tmdbMovie.vote_average >= 7.5) {
          lists.add('populares');
        }
        if (tmdbMovie.popularity > 50) {
          lists.add('tendencias');
        }

        const listsString = Array.from(lists).join(',');

        // Actualizar en base de datos
        const { error: updateError } = await supabase
          .from('Movie')
          .update({ lists: listsString })
          .eq('id', movie.id);

        if (updateError) {
          console.error(`  - Error actualizando ${movie.title}:`, updateError.message);
        } else {
          console.log(`  + Actualizado -> Categorías: ${listsString}`);
        }

      } else {
        console.log(`  - No se encontró en TMDB. Asignando categoría básica.`);
        const { error: updateError } = await supabase
          .from('Movie')
          .update({ lists: isSerie ? 'series' : 'peliculas' })
          .eq('id', movie.id);
      }
    } catch (e) {
      console.error(`  - Error conectando con TMDB para ${movie.title}:`, e.message);
    }

    count++;
    // Pausa pequeña para no saturar la API
    await sleep(200);
  }

  console.log('✅ Proceso completado.');
}

main();
