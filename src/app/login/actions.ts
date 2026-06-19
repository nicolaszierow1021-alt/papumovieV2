'use server';

import { cookies } from 'next/headers';

export async function loginAction(password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD || 'LOTENGOGRANDE';
  
  if (password === expectedPassword) {
    const cookieStore = await cookies();
    cookieStore.set('papu_admin_auth', 'true', { 
      path: '/', 
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    return { success: true };
  }
  
  return { success: false, error: 'Clave incorrecta' };
}
