'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function addMovieToList(listId: string, movieId: string) {
  // Fetch current movie lists
  const { data: movie } = await supabase.from('Movie').select('lists').eq('id', movieId).single();
  if (!movie) return;

  const currentLists = movie.lists ? movie.lists.split(',').map((l: string) => l.trim()).filter(Boolean) : [];
  
  if (!currentLists.includes(listId)) {
    currentLists.push(listId);
    await supabase.from('Movie').update({ lists: currentLists.join(',') }).eq('id', movieId);
  }
  
  revalidatePath('/');
  revalidatePath(`/adminpanel/lists/${listId}`);
}

export async function removeMovieFromList(listId: string, movieId: string) {
  const { data: movie } = await supabase.from('Movie').select('lists').eq('id', movieId).single();
  if (!movie) return;

  const currentLists = movie.lists ? movie.lists.split(',').map((l: string) => l.trim()).filter(Boolean) : [];
  const newLists = currentLists.filter((l: string) => l !== listId);
  
  await supabase.from('Movie').update({ lists: newLists.join(',') }).eq('id', movieId);
    
  revalidatePath('/');
  revalidatePath(`/adminpanel/lists/${listId}`);
}

