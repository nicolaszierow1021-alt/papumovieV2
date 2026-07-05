import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = 'c71d55c790adcb0fa9ea6ebcbc9a61a7';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/original';

const genreMap: Record<number, string> = {
  28: 'accion', 12: 'accion', 16: 'anime', 35: 'comedia',
  27: 'terror-suspenso', 9648: 'terror-suspenso', 53: 'terror-suspenso',
  10749: 'romance', 878: 'sci-fi', 14: 'sci-fi',
  10759: 'accion', 10765: 'sci-fi',
};

// Parse a TMDB URL or raw ID into { id, isSerie }
function parseTmdbInput(input: string): { id: string; isSerie: boolean } | null {
  const trimmed = input.trim();
  // URL format: https://www.themoviedb.org/movie/123 or /tv/123
  const urlMatch = trimmed.match(/themoviedb\.org\/(movie|tv)\/(\d+)/);
  if (urlMatch) {
    return { id: urlMatch[2], isSerie: urlMatch[1] === 'tv' };
  }
  // Raw numeric ID (assume movie unless specified)
  if (/^\d+$/.test(trimmed)) {
    return { id: trimmed, isSerie: false };
  }
  return null;
}

async function fetchMovieDetails(id: string, isSerie: boolean) {
  const endpoint = isSerie
    ? `${TMDB_BASE}/tv/${id}?api_key=${TMDB_API_KEY}&language=es&append_to_response=credits,videos,images&include_image_language=es,en,null`
    : `${TMDB_BASE}/movie/${id}?api_key=${TMDB_API_KEY}&language=es&append_to_response=credits,videos,images&include_image_language=es,en,null`;

  const res = await fetch(endpoint, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const data = await res.json();
  return formatMovie(data, isSerie);
}

function formatMovie(data: any, isSerie: boolean) {
  const trailer = data.videos?.results?.find(
    (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
  );
  const logos = data.images?.logos || [];
  const esLogo = logos.find((l: any) => l.iso_639_1 === 'es');
  const enLogo = logos.find((l: any) => l.iso_639_1 === 'en');
  const bestLogo = esLogo || enLogo || logos[0];

  const director = isSerie
    ? data.created_by?.[0]?.name || 'Desconocido'
    : data.credits?.crew?.find((m: any) => m.job === 'Director')?.name || 'Desconocido';

  const lists = new Set<string>();
  lists.add(isSerie ? 'series' : 'peliculas');
  if (data.genres) {
    for (const g of data.genres) {
      if (genreMap[g.id]) lists.add(genreMap[g.id]);
    }
  }
  if (data.vote_average >= 7.5) lists.add('populares');
  if (data.popularity > 50) lists.add('tendencias');

  return {
    tmdbId: data.id,
    title: isSerie ? data.name : data.title,
    synopsis: data.overview || '',
    year: isSerie
      ? (data.first_air_date || '').slice(0, 4)
      : (data.release_date || '').slice(0, 4),
    rating: data.vote_average ? data.vote_average.toFixed(1) : '0.0',
    duration: isSerie
      ? data.episode_run_time?.[0] ? `${data.episode_run_time[0]} Min. por Ep.` : ''
      : data.runtime ? `${data.runtime} Min.` : '',
    director,
    coverUrl: data.poster_path ? `${IMG_BASE}${data.poster_path}` : '',
    bannerUrl: data.backdrop_path ? `${IMG_BASE}${data.backdrop_path}` : '',
    logoUrl: bestLogo ? `${IMG_BASE}${bestLogo.file_path}` : '',
    trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '',
    type: isSerie ? 'series' : 'movie',
    genres: (data.genres || []).map((g: any) => g.name).join(', '),
    suggestedLists: Array.from(lists),
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  const tmdbUrl = searchParams.get('tmdbUrl');
  const type = searchParams.get('type') || 'movie';

  try {
    // --- Search by URL or ID ---
    if (tmdbUrl) {
      const parsed = parseTmdbInput(tmdbUrl);
      if (!parsed) {
        return NextResponse.json({ error: 'URL o ID no válido' }, { status: 400 });
      }
      const movie = await fetchMovieDetails(parsed.id, parsed.isSerie);
      if (!movie) return NextResponse.json({ error: 'No encontrado en TMDB' }, { status: 404 });
      return NextResponse.json({ movie });
    }

    // --- Search by name ---
    if (query) {
      const isSerie = type === 'series';
      const endpoint = isSerie
        ? `${TMDB_BASE}/search/tv?api_key=${TMDB_API_KEY}&language=es&query=${encodeURIComponent(query)}&page=1`
        : `${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&language=es&query=${encodeURIComponent(query)}&page=1`;

      const res = await fetch(endpoint, { next: { revalidate: 300 } });
      if (!res.ok) return NextResponse.json({ error: 'Error en TMDB' }, { status: 500 });
      const data = await res.json();

      const results = (data.results || []).slice(0, 10).map((item: any) => ({
        tmdbId: item.id,
        title: isSerie ? item.name : item.title,
        year: isSerie
          ? (item.first_air_date || '').slice(0, 4)
          : (item.release_date || '').slice(0, 4),
        rating: item.vote_average ? item.vote_average.toFixed(1) : '0.0',
        coverUrl: item.poster_path ? `${IMG_BASE}${item.poster_path}` : '',
        bannerUrl: item.backdrop_path ? `${IMG_BASE}${item.backdrop_path}` : '',
        type: isSerie ? 'series' : 'movie',
        synopsis: item.overview || '',
      }));

      return NextResponse.json({ results });
    }

    return NextResponse.json({ error: 'Se requiere query o tmdbUrl' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
