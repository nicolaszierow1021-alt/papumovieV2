'use client';

import { useState, useRef, useTransition } from 'react';
import { editMovieFromAdmin } from '@/app/actions/movieActions';
import { PREDEFINED_LISTS } from '@/lib/constants';

interface DownloadLink {
  id: string;
  server: string;
  details: string;
  url: string;
}

interface Movie {
  id: string;
  title: string;
  coverUrl: string;
  bannerUrl?: string | null;
  downloadUrl: string;
  type?: string | null;
  year?: string | null;
  quality?: string | null;
  rating?: string | null;
  lists?: string | null;
  [key: string]: any;
}

export default function EditMovieModal({ movie, onClose }: { movie: Movie, onClose: (updatedMovie?: Movie) => void }) {
  const [activeTab, setActiveTab] = useState('Info Básica');
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const [currentMovie, setCurrentMovie] = useState(movie);
  const [updateKey, setUpdateKey] = useState(0);
  const [isUpdatingTmdb, setIsUpdatingTmdb] = useState(false);

  // Parse existing categories from movie.lists
  const initialCategories = movie.lists ? movie.lists.split(',').map(s => s.trim()) : [];
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);

  // Parse existing download links
  let initialLinks: DownloadLink[] = [];
  try {
    const parsed = JSON.parse(movie.downloadUrl);
    if (Array.isArray(parsed)) {
      initialLinks = parsed;
    } else {
      initialLinks = [{ id: '1', server: 'Default', details: 'Principal', url: movie.downloadUrl }];
    }
  } catch (e) {
    // If it's not JSON, it's a raw URL string
    initialLinks = [{ id: '1', server: 'Servidor 1', details: 'Principal', url: movie.downloadUrl || '' }];
  }
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>(initialLinks);

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const addLink = () => {
    setDownloadLinks(prev => [...prev, { id: Math.random().toString(), server: '', details: '', url: '' }]);
  };

  const updateLink = (id: string, field: keyof DownloadLink, value: string) => {
    setDownloadLinks(prev => prev.map(link => link.id === id ? { ...link, [field]: value } : link));
  };

  const removeLink = (id: string) => {
    setDownloadLinks(prev => prev.filter(link => link.id !== id));
  };

  const handleSave = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const handleUpdateFromTMDB = async () => {
    setIsUpdatingTmdb(true);
    try {
      const typeStr = currentMovie.type === 'series' ? 'tv' : 'movie';
      const res = await fetch(`/api/tmdb?query=${encodeURIComponent(currentMovie.title)}&type=${typeStr}`);
      const data = await res.json();
      
      if (data.results && data.results.length > 0) {
        const tmdbResult = data.results[0];
        const fakeUrl = `https://www.themoviedb.org/${typeStr}/${tmdbResult.tmdbId}`;
        const detailRes = await fetch(`/api/tmdb?tmdbUrl=${encodeURIComponent(fakeUrl)}`);
        const detailData = await detailRes.json();
        
        if (detailData.movie) {
           setCurrentMovie(prev => ({
             ...prev, 
             ...detailData.movie, 
             id: prev.id, // Mantener ID original
             title: prev.title, // Mantener título original
             downloadUrl: prev.downloadUrl,
             type: prev.type
           }));
           if (detailData.movie.suggestedLists && detailData.movie.suggestedLists.length > 0) {
             setSelectedCategories(detailData.movie.suggestedLists);
           }
           setUpdateKey(k => k + 1);
        } else {
           alert("No se pudo obtener detalles de TMDB");
        }
      } else {
        alert("No se encontraron coincidencias en TMDB para este título");
      }
    } catch(e) {
      alert("Error al sincronizar con TMDB");
    } finally {
      setIsUpdatingTmdb(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#0e141d', border: '1px solid #1c2633', borderRadius: '12px',
        width: '100%', maxWidth: '900px', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1c2633', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #243040', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d8be66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Editar Contenido</h2>
            <button
              type="button"
              onClick={handleUpdateFromTMDB}
              disabled={isUpdatingTmdb}
              style={{
                marginLeft: '1rem',
                backgroundColor: 'rgba(29, 78, 216, 0.2)',
                color: '#60a5fa',
                border: '1px solid #1d4ed8',
                borderRadius: '6px',
                padding: '0.4rem 0.8rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                opacity: isUpdatingTmdb ? 0.6 : 1
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              {isUpdatingTmdb ? 'Actualizando...' : 'Auto-completar TMDB'}
            </button>
          </div>
          <button onClick={() => onClose()} style={{ background: '#121a24', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Tabs */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1c2633', display: 'flex', gap: '1rem' }}>
          {['Info Básica', 'Categorías', 'Reproductor', 'Descargas'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.6rem 1.25rem', borderRadius: '20px', border: 'none',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
                backgroundColor: activeTab === tab ? '#d8be66' : '#121a24',
                color: activeTab === tab ? '#fff' : '#888'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <form 
          ref={formRef} 
          action={async (formData) => {
            // Append lists and JSON download URL before submitting
            formData.set('lists', selectedCategories.join(','));
            formData.set('downloadUrl', JSON.stringify(downloadLinks));
            
            startTransition(async () => {
              const res = await editMovieFromAdmin(movie.id, formData);
              if (res.success) {
                onClose(res.movie);
              } else {
                alert(res.error);
              }
            });
          }}
          style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}
        >
          {/* Info Básica Tab */}
          <div key={updateKey} style={{ display: activeTab === 'Info Básica' ? 'flex' : 'none', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Título</label>
                <input type="text" name="title" defaultValue={currentMovie.title} readOnly required style={{ backgroundColor: '#0e141d', border: '1px solid #1c2633', color: '#666', padding: '0.75rem', borderRadius: '8px', outline: 'none', cursor: 'not-allowed' }} title="El título no se puede modificar una vez agregada la película" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Tipo</label>
                <select name="type" defaultValue={currentMovie.type || 'movie'} style={{ backgroundColor: '#0f0f0f', border: '1px solid #1c2633', color: '#fff', padding: '0.75rem', borderRadius: '8px', outline: 'none' }}>
                  <option value="movie">Película</option>
                  <option value="series">Serie</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Sinopsis</label>
                <textarea name="synopsis" defaultValue={currentMovie.synopsis || ''} rows={4} style={{ backgroundColor: '#0f0f0f', border: '1px solid #1c2633', color: '#fff', padding: '0.75rem', borderRadius: '8px', outline: 'none', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Póster URL</label>
                <input type="url" name="coverUrl" defaultValue={currentMovie.coverUrl} required style={{ backgroundColor: '#0f0f0f', border: '1px solid #1c2633', color: '#fff', padding: '0.75rem', borderRadius: '8px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Banner URL</label>
                <input type="url" name="bannerUrl" defaultValue={currentMovie.bannerUrl || ''} style={{ backgroundColor: '#0f0f0f', border: '1px solid #1c2633', color: '#fff', padding: '0.75rem', borderRadius: '8px', outline: 'none' }} />
              </div>
            </div>
          </div>

          {/* Categorías Tab */}
          <div style={{ display: activeTab === 'Categorías' ? 'block' : 'none' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 700 }}>Categorías</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {PREDEFINED_LISTS.map(list => {
                const isSelected = selectedCategories.includes(list.id);
                return (
                  <div 
                    key={list.id} 
                    onClick={() => handleCategoryToggle(list.id)}
                    style={{ 
                      padding: '1rem', borderRadius: '8px', cursor: 'pointer',
                      border: isSelected ? '1px solid #d8be66' : '1px solid #1c2633',
                      backgroundColor: isSelected ? 'rgba(255, 21, 21, 0.1)' : '#0f0f0f',
                      display: 'flex', alignItems: 'center', gap: '0.8rem', transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ 
                      width: '20px', height: '20px', borderRadius: '4px', 
                      backgroundColor: isSelected ? '#d8be66' : 'transparent',
                      border: isSelected ? 'none' : '1px solid #444',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {isSelected && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                    <span style={{ color: isSelected ? '#fff' : '#a0a0a0', fontWeight: isSelected ? 700 : 500, fontSize: '0.9rem' }}>{list.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reproductor Tab */}
          <div key={`rep-${updateKey}`} style={{ display: activeTab === 'Reproductor' ? 'grid' : 'none', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {['director', 'year', 'rating', 'duration', 'quality', 'format', 'audio', 'subtitles', 'size', 'password', 'trailerUrl'].map(field => (
              <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>{field}</label>
                <input type="text" name={field} defaultValue={currentMovie[field] || ''} style={{ backgroundColor: '#0f0f0f', border: '1px solid #1c2633', color: '#fff', padding: '0.75rem', borderRadius: '8px', outline: 'none' }} />
              </div>
            ))}
          </div>

          {/* Descargas Tab */}
          <div style={{ display: activeTab === 'Descargas' ? 'flex' : 'none', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#121a24', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #1c2633' }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 0.3rem 0', fontWeight: 700 }}>Enlaces de Descarga</h3>
                <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>Opciones de descarga externa para la película.</p>
              </div>
              <button type="button" onClick={addLink} style={{ backgroundColor: '#d8be66', color: '#fff', border: 'none', borderRadius: '20px', padding: '0.6rem 1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Agregar Enlace
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {downloadLinks.map((link, index) => (
                <div key={link.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#0a0a0a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #1c2633', position: 'relative' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Servidor</label>
                      <input type="text" value={link.server} onChange={(e) => updateLink(link.id, 'server', e.target.value)} placeholder="Ej: PelixStream" style={{ backgroundColor: '#141414', border: '1px solid #243040', color: '#fff', padding: '0.75rem', borderRadius: '8px', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Detalles</label>
                      <input type="text" value={link.details} onChange={(e) => updateLink(link.id, 'details', e.target.value)} placeholder="Ej: Latino HD" style={{ backgroundColor: '#141414', border: '1px solid #243040', color: '#fff', padding: '0.75rem', borderRadius: '8px', outline: 'none' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Enlace URL</label>
                      <input type="url" value={link.url} onChange={(e) => updateLink(link.id, 'url', e.target.value)} placeholder="https://..." style={{ backgroundColor: '#141414', border: '1px solid #243040', color: '#fff', padding: '0.75rem', borderRadius: '8px', outline: 'none' }} />
                    </div>
                  </div>
                  
                  {downloadLinks.length > 1 && (
                    <button type="button" onClick={() => removeLink(link.id)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#121a24', border: '1px solid #243040', width: '32px', height: '32px', borderRadius: '6px', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid #1c2633', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', backgroundColor: '#0a0a0a' }}>
          <button type="button" onClick={() => onClose()} style={{ background: 'transparent', border: 'none', color: '#888', fontWeight: 700, padding: '0.8rem 1.5rem', cursor: 'pointer' }}>
            Cancelar
          </button>
          <button type="button" onClick={handleSave} disabled={isPending} style={{ backgroundColor: '#d8be66', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.8rem 1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', opacity: isPending ? 0.7 : 1 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            {isPending ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

      </div>
    </div>
  );
}
