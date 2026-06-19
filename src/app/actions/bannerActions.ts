'use server'

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginBanner(formData: FormData) {
  const password = formData.get('password') as string;
  
  if (password === 'nicebott') {
    (await cookies()).set('papu_banner_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: '/',
    });
    redirect('/adminpanel/banner');
  } else {
    throw new Error('Contraseña incorrecta');
  }
}

export async function saveBanner(formData: FormData) {
  const message = formData.get('message') as string;
  const isActive = formData.get('isActive') === 'true';

  if (!message) {
    throw new Error('El mensaje es obligatorio');
  }

  // Verifica si ya existe un anuncio
  const { data: existing } = await supabase.from('Announcement').select('*').limit(1);

  if (existing && existing.length > 0) {
    // Actualiza
    await supabase.from('Announcement').update({
      message,
      isActive
    }).eq('id', existing[0].id);
  } else {
    // Crea nuevo
    await supabase.from('Announcement').insert({
      message,
      isActive
    });
  }

  revalidatePath('/', 'layout');
  redirect('/adminpanel/banner');
}
