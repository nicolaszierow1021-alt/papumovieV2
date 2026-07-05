import { getMaintenanceStatus, toggleMaintenanceMode } from '@/app/actions/maintenanceActions';

export const dynamic = 'force-dynamic';

export default async function AdminNicoPage() {
  const status = await getMaintenanceStatus();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '500px', backgroundColor: '#111', padding: '2rem', borderRadius: '16px', border: '1px solid #333', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        
        <h1 className="heading-ELPAPUCINEFILO" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: status.active ? '#ef4444' : '#E50914' }}>
          ADMINISTRADOR DE EMERGENCIA
        </h1>
        
        <p style={{ color: '#888', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Desde aquí puedes bloquear completamente el acceso a la web.
        </p>

        <div style={{ padding: '1rem', backgroundColor: status.active ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', border: `1px solid ${status.active ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`, borderRadius: '12px', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: status.active ? '#ef4444' : '#22c55e', margin: 0 }}>
            Estado actual: {status.active ? 'MANTENIMIENTO ACTIVADO' : 'SISTEMA ONLINE'}
          </h2>
        </div>

        <form action={async (formData) => {
          'use server'
          const action = formData.get('action');
          if (action === 'activate') {
            const message = formData.get('message') as string;
            await toggleMaintenanceMode(true, message || 'Esta web está en mantenimiento hasta el día 5 de julio a las 11am');
          } else {
            await toggleMaintenanceMode(false);
          }
        }}>
          {status.active ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="hidden" name="action" value="deactivate" />
              <button type="submit" style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', fontWeight: 'bold', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                DESACTIVAR MANTENIMIENTO (ABRIR WEB)
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="hidden" name="action" value="activate" />
              <textarea 
                name="message" 
                placeholder="Mensaje de mantenimiento..." 
                defaultValue="Esta web está en mantenimiento hasta el día 5 de julio a las 11am"
                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#000', color: '#fff', minHeight: '100px', resize: 'vertical', fontSize: '1rem' }}
                required
              />
              <button type="submit" style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', fontWeight: 'bold', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                CERRAR WEB (ACTIVAR MANTENIMIENTO)
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
