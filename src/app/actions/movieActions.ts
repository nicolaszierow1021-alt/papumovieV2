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

  if (!title || !coverUrl || !downloadUrl) {
    throw new Error('Title, Cover URL and Download URL are required');
  }

  const id = crypto.randomUUID();

  await supabase.from('Movie').insert({
    id,
    title,
    coverUrl,
    bannerUrl,
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
  });

  revalidatePath('/');
  revalidatePath('/adminpanel');
  redirect('/adminpanel');
}

export async function editMovie(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  let coverUrl = formData.get('coverUrl') as string;
  
  if (coverUrl && coverUrl.includes('image.tmdb.org')) {
    coverUrl = coverUrl.replace(/\/w\d+\//, '/original/');
  }

  const bannerUrl = formData.get('bannerUrl') as string;
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

  if (!title || !coverUrl || !downloadUrl) {
    throw new Error('Title, Cover URL and Download URL are required');
  }

  await supabase.from('Movie').update({
    title,
    coverUrl,
    bannerUrl,
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
