import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const TMDB_API_KEY = 'c71d55c790adcb0fa9ea6ebcbc9a61a7';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log("Starting bulk update...");

  // 1. Fetch movies where logoUrl is empty or null
  const { data: movies, error } = await supabase
    .from('Movie')
    .select('id, title, type, logoUrl')
    .or('logoUrl.is.null,logoUrl.eq.');

  if (error) {
    console.error("Error fetching movies:", error);
    process.exit(1);
  }

  if (!movies || movies.length === 0) {
    console.log("No movies found that need a logo update. Everything is up to date!");
    return;
  }

  console.log(`Found ${movies.length} movies to update. Processing...`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    const isSerie = movie.type === 'series';
    const tmdbSearchUrl = isSerie
      ? `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&language=es&query=${encodeURIComponent(movie.title)}`
      : `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=es&query=${encodeURIComponent(movie.title)}`;

    try {
      // Step 2: Search by title
      const searchRes = await fetch(tmdbSearchUrl);
      const searchData = await searchRes.json();

      if (!searchData.results || searchData.results.length === 0) {
        console.log(`[${i + 1}/${movies.length}] ❌ TMDB ID not found for: ${movie.title}`);
        failCount++;
        await sleep(400); // Rate limit
        continue;
      }

      const tmdbId = searchData.results[0].id;

      // Step 3: Fetch images
      const imgUrl = isSerie
        ? `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=images&include_image_language=es,en,null`
        : `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=images&include_image_language=es,en,null`;

      const imgRes = await fetch(imgUrl);
      const imgData = await imgRes.json();
      
      const logos = imgData.images?.logos;
      if (logos && logos.length > 0) {
        const esLogo = logos.find((l) => l.iso_639_1 === 'es');
        const enLogo = logos.find((l) => l.iso_639_1 === 'en');
        const fallbackLogo = logos[0];
        const bestLogo = esLogo || enLogo || fallbackLogo;
        const logoUrl = `https://image.tmdb.org/t/p/original${bestLogo.file_path}`;

        // Step 4: Update Supabase
        const { error: updateError } = await supabase
          .from('Movie')
          .update({ logoUrl })
          .eq('id', movie.id);

        if (updateError) {
          console.log(`[${i + 1}/${movies.length}] ❌ Error updating DB for: ${movie.title} - ${updateError.message}`);
          failCount++;
        } else {
          console.log(`[${i + 1}/${movies.length}] ✅ Successfully updated logo for: ${movie.title}`);
          successCount++;
        }
      } else {
        console.log(`[${i + 1}/${movies.length}] ⚠️ No logos found on TMDB for: ${movie.title}`);
        failCount++;
      }
    } catch (err) {
      console.error(`[${i + 1}/${movies.length}] ❌ API Error for ${movie.title}:`, err.message);
      failCount++;
    }

    // Rate limiting for TMDB (max 40-50 requests per second typically, but let's be safe)
    await sleep(400);
  }

  console.log("========================================");
  console.log(`Update complete! Success: ${successCount}, Failed/Not Found: ${failCount}`);
}

main();
