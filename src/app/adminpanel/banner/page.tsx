import { saveBanner } from '@/app/actions/bannerActions';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function BannerManagementPage() {
  const { data: announcements } = await supabase.from('Announcement').select('*').limit(1);
  const currentBanner = announcements && announcements.length > 0 ? announcements[0] : null;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
          Gestión de Anuncios
        </h1>
        <p style={{ color: '#555', fontSize: '0.9rem' }}>
          Configura el banner global que aparece en la parte superior de la web.
        </p>
      </div>

      <div style={{
        backgroundColor: '#141414', border: '1px solid #1f1f1f',
        borderRadius: '12px', padding: '2rem', maxWidth: '800px'
      }}>
        <form action={saveBanner}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Mensaje */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="message" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ccc', textTransform: 'uppercase' }}>
                Mensaje del Anuncio
              </label>
              <textarea 
                id="message" 
                name="message" 
                rows={3}
                required
                defaultValue={currentBanner?.message || ''}
                placeholder="Ej: ¡Nuevo servidor de Telegram! Únete aquí..."
                style={{
                  backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', color: '#fff',
                  padding: '1rem', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit',
                  resize: 'vertical', outline: 'none'
                }}
              />
            </div>

            {/* Estado */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="isActive" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ccc', textTransform: 'uppercase' }}>
                Estado
              </label>
              <select 
                id="isActive" 
                name="isActive" 
                defaultValue={currentBanner?.isActive ? 'true' : 'false'}
                style={{
                  backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', color: '#fff',
                  padding: '1rem', borderRadius: '8px', fontSize: '1rem', outline: 'none', cursor: 'pointer'
                }}
              >
                <option value="true">🟢 Activo (Mostrar en la web)</option>
                <option value="false">🔴 Inactivo (Ocultar)</option>
              </select>
            </div>

            {/* Submit */}
            <button 
              type="submit"
              style={{
                marginTop: '1rem', backgroundColor: '#1d4ed8', color: '#fff',
                border: 'none', padding: '1rem', borderRadius: '8px',
                fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
