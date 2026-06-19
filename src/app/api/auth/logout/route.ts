import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
  
  // Eliminar cookies de auth
  response.cookies.delete('papu_admin_auth');
  response.cookies.delete('papu_banner_auth');
  
  return response;
}
