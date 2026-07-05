import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ClientLayout from './ClientLayout';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isGeneralAdmin = cookieStore.get('papu_admin_auth')?.value === 'true';
  const isBannerAdmin = !isGeneralAdmin && cookieStore.get('papu_banner_auth')?.value === 'true';

  // Auth check — redirect to login if not authenticated
  if (!isGeneralAdmin && !isBannerAdmin) {
    redirect('/login');
  }

  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}
