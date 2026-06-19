import { supabase } from '@/lib/supabase';
import BannerClient from './BannerClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Banner() {
  const { data: announcements, error } = await supabase
    .from('Announcement')
    .select('*')
    .eq('isActive', true)
    .limit(1);

  if (error || !announcements || announcements.length === 0) {
    return null;
  }

  const activeBanner = announcements[0];
  
  let data = { text: '', icon: 'none', link: '', bgColor: '#E50914' };
  try {
    data = JSON.parse(activeBanner.message);
  } catch (e) {
    data.text = activeBanner.message;
  }

  return <BannerClient data={data} />;
}
