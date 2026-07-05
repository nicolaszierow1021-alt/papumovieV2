import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', request.url));
  
  // Eliminar cookies de auth
  response.cookies.delete('papu_admin_auth');
  response.cookies.delete('papu_banner_auth');
  
  return response;
}
