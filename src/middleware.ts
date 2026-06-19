import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname.startsWith('/adminpanel')) {
    const isAdminBanner = url.pathname === '/adminpanel/banner' || url.pathname.startsWith('/adminpanel/banner/');
    const bannerAuthCookie = req.cookies.get('papu_banner_auth');
    const authCookie = req.cookies.get('papu_admin_auth');

    // Rutas del banner (requiere clave nicebott / banner auth)
    if (isAdminBanner) {
      if (!bannerAuthCookie || bannerAuthCookie.value !== 'true') {
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    // Rutas generales del admin (requiere clave LOTENGOGRANDE / admin auth)
    if (!authCookie || authCookie.value !== 'true') {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/adminpanel/:path*'],
};
