import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'experimental-edge';

export function proxy(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname.startsWith('/adminpanel')) {
    const isAdminBanner = url.pathname === '/adminpanel/banner' || url.pathname.startsWith('/adminpanel/banner/');
    const bannerAuthCookie = req.cookies.get('papu_banner_auth');
    const authCookie = req.cookies.get('papu_admin_auth');

    if (isAdminBanner) {
      if (!bannerAuthCookie || bannerAuthCookie.value !== 'true') {
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

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
