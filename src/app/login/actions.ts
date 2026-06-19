'use server';

import { cookies } from 'next/headers';

export async function loginAction(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'LOTENGOGRANDE';
  const bannerPassword = process.env.BANNER_PASSWORD || 'nicebott';
  
  const cookieStore = await cookies();
  
  if (password === adminPassword) {
    cookieStore.set('papu_admin_auth', 'true', { 
      path: '/', 
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    return { success: true, redirectUrl: '/adminpanel' };
  }
  
  if (password === bannerPassword) {
    cookieStore.set('papu_banner_auth', 'true', { 
      path: '/', 
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    return { success: true, redirectUrl: '/adminpanel/banner' };
  }
  
  return { success: false, error: 'Clave incorrecta' };
}
