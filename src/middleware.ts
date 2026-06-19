import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Si intentamos entrar al admin panel
  if (url.pathname.startsWith('/adminpanel')) {
    // Verificar si existe la cookie de autorización
    const authCookie = req.cookies.get('papu_admin_auth');

    if (!authCookie || authCookie.value !== 'true') {
      // Si no existe, redirigir a la página de login
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/adminpanel/:path*'],
};
