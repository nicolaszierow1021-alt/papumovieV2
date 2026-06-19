'use client';

import { useState } from 'react';
import { saveBanner } from '@/app/actions/bannerActions';

export default function BannerFormClient({ 
  initialData, 
  initialIsActive 
}: { 
  initialData: any, 
  initialIsActive: boolean 
}) {
  const [text, setText] = useState(initialData.text || '');
  const [icon, setIcon] = useState(initialData.icon || 'alert');
  const [link, setLink] = useState(initialData.link || '');
  const [bgColor, setBgColor] = useState(initialData.bgColor || '#E50914');
  const [isActive, setIsActive] = useState(initialIsActive);

  const presets = [
    {
      label: '📱 Telegram',
      data: { 
        text: '¡Únete a nuestro canal de Telegram para pedir películas y enterarte de estrenos!', 
        icon: 'telegram', 
        link: 'https://t.me/tu_canal', 
        bgColor: '#0088cc' 
      }
    },
    {
      label: '💬 WhatsApp',
      data: { 
        text: '¡Tenemos grupo de WhatsApp! Únete para debatir sobre películas.', 
        icon: 'whatsapp', 
        link: 'https://chat.whatsapp.com/...', 
        bgColor: '#25D366' 
      }
    },
    {
      label: '🎬 Bienvenida',
      data: { 
        text: '¡Bienvenidos a PAPU MOVIE, tu nueva web favorita de películas y series!', 
        icon: 'info', 
        link: '', 
        bgColor: '#E50914' 
      }
    },
    {
      label: '🛠️ Mantenimiento',
      data: { 
        text: 'Estamos en mantenimiento programado. Algunas funciones podrían fallar.', 
        icon: 'alert', 
        link: '', 
        bgColor: '#d97706' 
      }
    }
  ];

  const applyPreset = (data: any) => {
    setText(data.text);
    setIcon(data.icon);
    setLink(data.link);
    setBgColor(data.bgColor);
  };

  const payload = JSON.stringify({ text, icon, link, bgColor });

  return (
    <form action={saveBanner}>
      <input type="hidden" name="message" value={payload} />
      <input type="hidden" name="isActive" value={isActive.toString()} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Presets */}
        <div style={{ backgroundColor: '#0f0f0f', padding: '1.5rem', borderRadius: '12px', border: '1px solid #1f1f1f' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Anuncios Predeterminados
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset.data)}
                style={{
                  backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#fff',
                  padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#2a2a2a' }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a' }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Formulario Custom */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ccc', textTransform: 'uppercase' }}>
              Texto del Anuncio
            </label>
            <textarea 
              rows={2}
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ej: ¡Nuevo servidor de Telegram! Únete aquí..."
              style={{
                backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', color: '#fff',
                padding: '1rem', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit',
                resize: 'vertical', outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ccc', textTransform: 'uppercase' }}>
                Icono
              </label>
              <select 
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                style={{
                  backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', color: '#fff',
                  padding: '1rem', borderRadius: '8px', fontSize: '1rem', outline: 'none', cursor: 'pointer'
                }}
              >
                <option value="none">Ninguno</option>
                <option value="telegram">Telegram</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="discord">Discord</option>
                <option value="alert">Alerta (Triángulo)</option>
                <option value="info">Información (Estrella/Info)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ccc', textTransform: 'uppercase' }}>
                Color de Fondo
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input 
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{
                    width: '50px', height: '50px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent'
                  }}
                />
                <input 
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{
                    backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', color: '#fff', flex: 1,
                    padding: '0.85rem', borderRadius: '8px', fontSize: '1rem', outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ccc', textTransform: 'uppercase' }}>
              Enlace (Opcional)
            </label>
            <input 
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://t.me/..."
              style={{
                backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', color: '#fff',
                padding: '1rem', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit', outline: 'none'
              }}
            />
            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '-4px' }}>Si pones un enlace, todo el anuncio será clickeable.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ccc', textTransform: 'uppercase' }}>
              Estado del Anuncio
            </label>
            <select 
              value={isActive.toString()}
              onChange={(e) => setIsActive(e.target.value === 'true')}
              style={{
                backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', color: '#fff',
                padding: '1rem', borderRadius: '8px', fontSize: '1rem', outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="true">🟢 Activo (Mostrar en la web)</option>
              <option value="false">🔴 Inactivo (Ocultar)</option>
            </select>
          </div>

          {/* Vista Previa */}
          <div style={{ marginTop: '1rem', backgroundColor: '#0f0f0f', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #1f1f1f', fontSize: '0.85rem', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>
              Vista Previa (Así se verá en la web)
            </div>
            <div style={{ padding: '2rem 1rem', display: 'flex', justifyContent: 'center', backgroundColor: '#000' }}>
              {text ? (
                <div style={{
                  backgroundColor: bgColor,
                  color: '#fff',
                  padding: '0.6rem 1rem',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  maxWidth: '100%',
                }}>
                  {icon === 'telegram' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  )}
                  {icon === 'whatsapp' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  )}
                  {icon === 'discord' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h.01"></path><path d="M15 12h.01"></path><path d="M7 19.5c1.4-1.2 3.6-2 5-2s3.6.8 5 2"></path><path d="M19 13v-3a7 7 0 0 0-14 0v3"></path><path d="M22 13a2 2 0 0 0-2-2h-1v5h1a2 2 0 0 0 2-2z"></path><path d="M2 13a2 2 0 0 1 2-2h1v5H4a2 2 0 0 1-2-2z"></path></svg>
                  )}
                  {icon === 'alert' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  )}
                  {icon === 'info' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  )}
                  <span style={{ maxWidth: '800px', padding: '0 0.5rem', lineHeight: 1.3 }}>
                    {text}
                  </span>
                  {link && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6"></polyline></svg>
                  )}
                </div>
              ) : (
                <div style={{ color: '#555', fontSize: '0.9rem', fontStyle: 'italic' }}>Escribe un mensaje para ver la vista previa</div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit"
            style={{
              marginTop: '1rem', backgroundColor: '#E50914', color: '#fff',
              border: 'none', padding: '1rem', borderRadius: '8px',
              fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.opacity = '0.9' }}
            onMouseOut={(e) => { e.currentTarget.style.opacity = '1' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Guardar Configuración
          </button>
        </div>
      </div>
    </form>
  );
}
