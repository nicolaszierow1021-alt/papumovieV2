import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">PapuAdmin</div>
        <nav className="sidebar-nav">
          <Link href="/adminpanel" className="sidebar-link">
            <span>Resumen General</span>
          </Link>
          <Link href="/adminpanel" className="sidebar-link">
            <span>Catálogo</span>
          </Link>
          <Link href="/adminpanel/add" className="sidebar-link">
            <span>Añadir Película</span>
          </Link>
          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <Link href="/" className="sidebar-link">
              <span>Volver a la Web</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
