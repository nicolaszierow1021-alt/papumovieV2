import { supabase } from '@/lib/supabase';
import AdminDashboardUI from '@/components/admin/AdminDashboardUI';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const { data: moviesData } = await supabase
    .from('Movie')
    .select('*')
    .order('createdAt', { ascending: false });

  const movies = moviesData || [];

  return (
    <AdminDashboardUI initialMovies={movies} />
  );
}
