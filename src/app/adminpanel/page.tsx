import { supabase } from '@/lib/supabase';
import AdminDashboardUI from '@/components/admin/AdminDashboardUI';

export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const isGeneralAdmin = cookieStore.get('papu_admin_auth')?.value === 'true';

  if (!isGeneralAdmin) {
    redirect('/adminpanel/banner');
  }
  const { data: moviesData } = await supabase
    .from('Movie')
    .select('*')
    .order('createdAt', { ascending: false });

  const movies = moviesData || [];

  return (
    <AdminDashboardUI initialMovies={movies} />
  );
}
