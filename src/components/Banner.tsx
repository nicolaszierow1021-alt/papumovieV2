import { supabase } from '@/lib/supabase';

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

  return (
    <div style={{
      backgroundColor: '#E50914',
      color: '#fff',
      padding: '0.6rem 1rem',
      textAlign: 'center',
      fontSize: '0.9rem',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      position: 'relative',
      zIndex: 50,
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      {activeBanner.message}
    </div>
  );
}
