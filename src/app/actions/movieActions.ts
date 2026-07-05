'use server'

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createMovie(formData: FormData) {
  const title = formData.get('title') as string;
  let coverUrl = formData.get('coverUrl') as string;
  
  if (coverUrl && coverUrl.includes('image.tmdb.org')) {
    coverUrl = coverUrl.replace(/\/w\d+\//, '/original/');
  }

  const bannerUrl = formData.get('bannerUrl') as string;
  const logoUrl = formData.get('logoUrl') as string;
  const downloadUrl = formData.get('downloadUrl') as string;
  
  const synopsis = formData.get('synopsis') as string;
  const year = formData.get('year') as string;
  const quality = formData.get('quality') as string;
  const format = formData.get('format') as string;
  const resolution = formData.get('resolution') as string;
  const audio = formData.get('audio') as string;
  const subtitles = formData.get('subtitles') as string;
  const size = formData.get('size') as string;
  const password = formData.get('password') as string;
  const rating = formData.get('rating') as string;
  const director = formData.get('director') as string;
  const type = formData.get('type') as string;
  const duration = formData.get('duration') as string;
  const trailerUrl = formData.get('trailerUrl') as string;
  const lists = formData.get('lists') as string;

  if (!title || !coverUrl || !downloadUrl) {
    throw new Error('Title, Cover URL and Download URL are required');
  }

  const id = crypto.randomUUID();

  await supabase.from('Movie').insert({
    id,
    title,
    coverUrl,
    bannerUrl,
    logoUrl,
    downloadUrl,
    synopsis,
    year,
    quality,
    format,
    resolution,
    audio,
    subtitles,
    size,
    password: password || 'el_papu_cinefilo',
    rating: rating || '8.0',
    director: director || 'Desconocido',
    duration: duration || '',
    trailerUrl: trailerUrl || '',
    type: type || 'movie',
    lists: lists || '',
  });

  revalidatePath('/');
  revalidatePath('/adminpanel');
  redirect('/adminpanel');
}

// ── Acción sin redirect para usar desde componentes cliente ──
export async function addMovieFromAdmin(data: {
  title: string; coverUrl: string; bannerUrl: string; logoUrl: string;
  synopsis: string; year: string; rating: string; director: string;
  duration: string; trailerUrl: string; type: string; downloadUrl: string;
  lists: string;
}): Promise<{ success: true; movie: any } | { success: false; error: string }> {
  try {
    if (!data.title || !data.coverUrl || !data.downloadUrl) {
      return { success: false, error: 'Título, póster y enlace de descarga son obligatorios.' };
    }

    // Verificar duplicado por título (ignorando mayúsculas)
    const { data: existing } = await supabase
      .from('Movie')
      .select('id, title')
      .ilike('title', data.title.trim())
      .limit(1);

    if (existing && existing.length > 0) {
      return { success: false, error: `Ya existe "${existing[0].title}" en el catálogo.` };
    }

    const id = crypto.randomUUID();
    let coverUrl = data.coverUrl;
    if (coverUrl.includes('image.tmdb.org')) {
      coverUrl = coverUrl.replace(/\/w\d+\//, '/original/');
    }

    const movie = {
      id,
      title: data.title,
      coverUrl,
      bannerUrl: data.bannerUrl || '',
      logoUrl: data.logoUrl || '',
      downloadUrl: data.downloadUrl,
      synopsis: data.synopsis || '',
      year: data.year || '',
      rating: data.rating || '0.0',
      director: data.director || 'Desconocido',
      duration: data.duration || '',
      trailerUrl: data.trailerUrl || '',
      type: data.type || 'movie',
      lists: data.lists || '',
      quality: 'HD',
      password: 'el_papu_cinefilo',
    };

    const { error } = await supabase.from('Movie').insert(movie);
    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/adminpanel');
    return { success: true, movie };
  } catch (e: any) {
    return { success: false, error: e.message || 'Error desconocido' };
  }
}

export async function editMovieFromAdmin(id: string, formData: FormData): Promise<{ success: true; movie: any } | { success: false; error: string }> {
  try {
    const title = formData.get('title') as string;
    let coverUrl = formData.get('coverUrl') as string;
    
    if (coverUrl && coverUrl.includes('image.tmdb.org')) {
      coverUrl = coverUrl.replace(/\/w\d+\//, '/original/');
    }

    const bannerUrl = formData.get('bannerUrl') as string;
    const logoUrl = formData.get('logoUrl') as string;
    const downloadUrl = formData.get('downloadUrl') as string;
    const synopsis = formData.get('synopsis') as string;
    const year = formData.get('year') as string;
    const quality = formData.get('quality') as string;
    const format = formData.get('format') as string;
    const resolution = formData.get('resolution') as string;
    const audio = formData.get('audio') as string;
    const subtitles = formData.get('subtitles') as string;
    const size = formData.get('size') as string;
    const password = formData.get('password') as string;
    const rating = formData.get('rating') as string;
    const director = formData.get('director') as string;
    const type = formData.get('type') as string;
    const duration = formData.get('duration') as string;
    const trailerUrl = formData.get('trailerUrl') as string;
    const lists = formData.get('lists') as string;

    if (!title || !coverUrl || !downloadUrl) {
      return { success: false, error: 'Título, póster y enlace de descarga son obligatorios' };
    }

    const updates = {
      title,
      coverUrl,
      bannerUrl,
      logoUrl,
      downloadUrl,
      synopsis,
      year,
      quality,
      format,
      resolution,
      audio,
      subtitles,
      size,
      password: password || 'el_papu_cinefilo',
      rating: rating || '8.0',
      director: director || 'Desconocido',
      duration: duration || '',
      trailerUrl: trailerUrl || '',
      type: type || 'movie',
      lists: lists || '',
    };

    const { error } = await supabase.from('Movie').update(updates).eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/adminpanel');
    revalidatePath(`/movie/${id}`);
    
    return { success: true, movie: { id, ...updates } };
  } catch (e: any) {
    return { success: false, error: e.message || 'Error desconocido' };
  }
}

export async function editMovie(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  let coverUrl = formData.get('coverUrl') as string;
  
  if (coverUrl && coverUrl.includes('image.tmdb.org')) {
    coverUrl = coverUrl.replace(/\/w\d+\//, '/original/');
  }

  const bannerUrl = formData.get('bannerUrl') as string;
  const logoUrl = formData.get('logoUrl') as string;
  const downloadUrl = formData.get('downloadUrl') as string;
  const synopsis = formData.get('synopsis') as string;
  const year = formData.get('year') as string;
  const quality = formData.get('quality') as string;
  const format = formData.get('format') as string;
  const resolution = formData.get('resolution') as string;
  const audio = formData.get('audio') as string;
  const subtitles = formData.get('subtitles') as string;
  const size = formData.get('size') as string;
  const password = formData.get('password') as string;
  const rating = formData.get('rating') as string;
  const director = formData.get('director') as string;
  const type = formData.get('type') as string;
  const duration = formData.get('duration') as string;
  const trailerUrl = formData.get('trailerUrl') as string;
  const lists = formData.get('lists') as string;

  if (!title || !coverUrl || !downloadUrl) {
    throw new Error('Title, Cover URL and Download URL are required');
  }

  await supabase.from('Movie').update({
    title,
    coverUrl,
    bannerUrl,
    logoUrl,
    downloadUrl,
    synopsis,
    year,
    quality,
    format,
    resolution,
    audio,
    subtitles,
    size,
    password: password || 'el_papu_cinefilo',
    rating: rating || '8.0',
    director: director || 'Desconocido',
    duration: duration || '',
    trailerUrl: trailerUrl || '',
    type: type || 'movie',
    lists: lists || '',
  }).eq('id', id);

  revalidatePath('/');
  revalidatePath('/adminpanel');
  revalidatePath(`/movie/${id}`);
  redirect('/adminpanel');
}

export async function deleteMovie(id: string) {
  await supabase.from('Movie').delete().eq('id', id);

  revalidatePath('/');
  revalidatePath('/adminpanel');
}
