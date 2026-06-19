import { cookies } from 'next/headers';
import ClientLayout from './ClientLayout';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isGeneralAdmin = cookieStore.get('papu_admin_auth')?.value === 'true';
  const isBannerAdmin = !isGeneralAdmin && cookieStore.get('papu_banner_auth')?.value === 'true';

  return (
    <ClientLayout isBannerAdmin={isBannerAdmin} isGeneralAdmin={isGeneralAdmin}>
      {children}
    </ClientLayout>
  );
}
