'use client';

import { useState, useTransition } from 'react';
import EditMovieModal from './EditMovieModal';
import { createMovie, deleteMovie, addMovieFromAdmin } from '@/app/actions/movieActions';
import { PREDEFINED_LISTS } from '@/lib/constants';

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

interface TmdbResult {
  tmdbId: number;
  title: string;
  year: string;
  rating: string;
  coverUrl: string;
  bannerUrl: string;
  type: string;
  synopsis: string;
  logoUrl?: string;
  trailerUrl?: string;
  director?: string;
  duration?: string;
  genres?: string;
  suggestedLists?: string[];
}

export default function AdminDashboardUI({ initialMovies }: { initialMovies: Movie[] }) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [searchTerm, setSearchTerm] = useState('');

  // Left panel tabs
  const [addMode, setAddMode] = useState<'name' | 'url'>('name');
  const [mediaType, setMediaType] = useState<'movie' | 'series'>('movie');

  // Search by name
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState<TmdbResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // URL/ID mode
  const [directUrl, setDirectUrl] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  // Add movie modal (from TMDB result)
  const [addingMovie, setAddingMovie] = useState<TmdbResult | null>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSaving, startSaving] = useTransition();

  // Edit modal
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  // Hovered card
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredMovies = movies.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- TMDB Search by name ---
  const handleSearchByName = async () => {
    if (!searchName.trim()) return;
    setIsSearching(true);
    setSearchResults([]);
    try {
      const res = await fetch(`/api/tmdb?query=${encodeURIComponent(searchName)}&type=${mediaType}`);
      const data = await res.json();
      if (data.results) setSearchResults(data.results);
      else alert(data.error || 'Error buscando en TMDB');
    } catch {
      alert('Error de conexión con TMDB');
    } finally {
      setIsSearching(false);
    }
  };

  // --- TMDB Fetch by URL/ID ---
  const handleAddByUrl = async () => {
    if (!directUrl.trim()) return;
    setIsLoadingUrl(true);
    try {
      const res = await fetch(`/api/tmdb?tmdbUrl=${encodeURIComponent(directUrl)}`);
      const data = await res.json();
      if (data.movie) {
        openAddModal(data.movie);
        setDirectUrl('');
      } else {
        alert(data.error || 'No se encontró en TMDB');
      }
    } catch {
      alert('Error de conexión con TMDB');
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const handleSelectSearchResult = async (result: TmdbResult) => {
    setIsSearching(true);
    try {
      const typeStr = result.type === 'series' ? 'tv' : 'movie';
      const fakeUrl = `https://www.themoviedb.org/${typeStr}/${result.tmdbId}`;
      const res = await fetch(`/api/tmdb?tmdbUrl=${encodeURIComponent(fakeUrl)}`);
      const data = await res.json();
      if (data.movie) {
        openAddModal(data.movie);
      } else {
        alert(data.error || 'Error obteniendo detalles de la película');
      }
    } catch {
      alert('Error de conexión con TMDB');
    } finally {
      setIsSearching(false);
    }
  };

  const openAddModal = (result: TmdbResult) => {
    setAddingMovie(result);
    setDownloadUrl('');
    // Si viene con categorias recomendadas desde TMDB (solo al obtener detalles), asignarlas automáticamente
    if (result.suggestedLists && result.suggestedLists.length > 0) {
      setSelectedCategories(result.suggestedLists);
    } else {
      setSelectedCategories([]);
    }
  };

  const closeAddModal = () => {
    setAddingMovie(null);
    setDownloadUrl('');
    setSelectedCategories([]);
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSaveMovie = async () => {
    if (!addingMovie) return;
    if (!downloadUrl.trim()) { alert('Agrega al menos un enlace de descarga'); return; }

    startSaving(async () => {
      const result = await addMovieFromAdmin({
        title: addingMovie.title,
        coverUrl: addingMovie.coverUrl,
        bannerUrl: addingMovie.bannerUrl || '',
        logoUrl: addingMovie.logoUrl || '',
        synopsis: addingMovie.synopsis || '',
        year: addingMovie.year || '',
        rating: addingMovie.rating || '',
        director: addingMovie.director || 'Desconocido',
        duration: addingMovie.duration || '',
        trailerUrl: addingMovie.trailerUrl || '',
        type: addingMovie.type || 'movie',
        downloadUrl: downloadUrl.trim(),
        lists: selectedCategories.join(','),
      });

      if (!result.success) {
        alert(result.error);
        return;
      }

      // Add movie to local state so grid updates immediately
      setMovies(prev => [result.movie, ...prev]);
      setSearchResults([]);
      setSearchName('');
      closeAddModal();
    });
  };

  const inputStyle = {
    backgroundColor: '#060b13', border: '1px solid #1c2633', color: '#fff',
    padding: '0.75rem', borderRadius: '8px', outline: 'none', width: '100%', fontSize: '0.9rem'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', height: '100%' }}>

      {/* ── Left Sidebar ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Tab toggle */}
        <div style={{ display: 'flex', backgroundColor: '#0e141d', borderRadius: '12px', padding: '0.2rem', border: '1px solid #1c2633' }}>
          {(['name', 'url'] as const).map(mode => (
            <button key={mode} onClick={() => { setAddMode(mode); setSearchResults([]); }}
              style={{
                flex: 1, padding: '0.6rem', borderRadius: '10px', fontSize: '0.8rem',
                fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                backgroundColor: addMode === mode ? '#d8be66' : 'transparent',
                color: addMode === mode ? '#fff' : '#888',
              }}
            >
              {mode === 'name' ? 'Buscar Nombre' : 'URL / ID'}
            </button>
          ))}
        </div>

        {/* Form area */}
        <div style={{ backgroundColor: '#0e141d', borderRadius: '12px', padding: '1.5rem', border: '1px solid #1c2633' }}>
          {addMode === 'name' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Type selector */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['movie', 'series'] as const).map(t => (
                  <button key={t} onClick={() => setMediaType(t)}
                    style={{
                      flex: 1, padding: '0.5rem', borderRadius: '8px', fontSize: '0.8rem',
                      fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                      backgroundColor: mediaType === t ? '#d8be66' : '#060b13',
                      color: mediaType === t ? '#fff' : '#666',
                    }}
                  >
                    {t === 'movie' ? 'Películas' : 'Series'}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#060b13', borderRadius: '8px', border: '1px solid #243040', padding: '0.5rem 0.8rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchByName()}
                  placeholder="Ej. Avengers, Euphoria..."
                  style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', outline: 'none', paddingLeft: '0.5rem', width: '100%' }}
                />
              </div>

              <button
                onClick={handleSearchByName}
                disabled={isSearching}
                style={{ backgroundColor: '#d8be66', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', opacity: isSearching ? 0.7 : 1 }}
              >
                {isSearching ? 'Buscando...' : 'Buscar en TMDB'}
              </button>

              {/* Search results */}
              {searchResults.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                  <p style={{ color: '#666', fontSize: '0.75rem', margin: 0 }}>{searchResults.length} resultados — toca para agregar</p>
                  {searchResults.map(result => (
                    <div
                      key={result.tmdbId}
                      onClick={() => handleSelectSearchResult(result)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        backgroundColor: '#060b13', borderRadius: '8px', padding: '0.6rem',
                        border: '1px solid #1c2633', cursor: 'pointer', transition: 'border-color 0.2s'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.borderColor = '#d8be66')}
                      onMouseOut={(e) => (e.currentTarget.style.borderColor = '#1c2633')}
                    >
                      {result.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={result.coverUrl} alt={result.title} style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: '40px', height: '60px', borderRadius: '4px', backgroundColor: '#1c2633', flexShrink: 0 }} />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{result.title}</div>
                        <div style={{ color: '#888', fontSize: '0.75rem' }}>{result.year} · ★ {result.rating}</div>
                      </div>
                      <div style={{ color: '#d8be66', fontSize: '1.2rem', fontWeight: 700, flexShrink: 0 }}>+</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ color: '#888', fontSize: '0.8rem', margin: 0 }}>Pega la URL de themoviedb.org o el ID numérico.</p>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#060b13', borderRadius: '8px', border: '1px solid #243040', padding: '0.5rem 0.8rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <input
                  type="text"
                  value={directUrl}
                  onChange={(e) => setDirectUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddByUrl()}
                  placeholder="https://www.themoviedb.org/movie/550..."
                  style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', outline: 'none', paddingLeft: '0.5rem', width: '100%' }}
                />
              </div>
              <button
                onClick={handleAddByUrl}
                disabled={isLoadingUrl}
                style={{ backgroundColor: '#d8be66', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', opacity: isLoadingUrl ? 0.7 : 1 }}
              >
                {isLoadingUrl ? 'Cargando...' : 'Agregar por URL/ID'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Right Content Grid ── */}
      <div style={{ backgroundColor: '#0e141d', borderRadius: '12px', border: '1px solid #1c2633', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            Contenido Agregado
            <span style={{ backgroundColor: '#1c2633', color: '#ccc', fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
              {movies.length}
            </span>
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#060b13', borderRadius: '8px', border: '1px solid #243040', padding: '0.4rem 0.8rem', width: '250px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por título..."
              style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '0.8rem', outline: 'none', paddingLeft: '0.5rem', width: '100%' }}
            />
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gridAutoRows: '240px',
          gap: '1.25rem',
          overflowY: 'auto',
          paddingRight: '0.5rem',
          maxHeight: 'calc(100vh - 200px)'
        }}>
          {filteredMovies.map(movie => (
            <div
              key={movie.id}
              style={{
                position: 'relative', borderRadius: '8px', overflow: 'hidden',
                border: '1px solid #1c2633', transition: 'transform 0.2s', backgroundColor: '#111', height: '240px'
              }}
              onMouseEnter={() => setHoveredId(movie.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={movie.coverUrl} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

              {/* Title gradient */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)', padding: '2rem 0.5rem 0.5rem' }}>
                <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>
                  {movie.title}
                </div>
              </div>

              {/* Hover overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.75)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                opacity: hoveredId === movie.id ? 1 : 0,
                transition: 'opacity 0.2s',
                pointerEvents: hoveredId === movie.id ? 'auto' : 'none',
              }}>
                <a
                  href={`/movie/${movie.id}`}
                  target="_blank"
                  style={{
                    width: '80%', padding: '0.65rem', borderRadius: '8px', border: 'none',
                    backgroundColor: '#1d4ed8', color: '#fff', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Ver
                </a>
                <button
                  onClick={() => setEditingMovie(movie)}
                  style={{
                    width: '80%', padding: '0.65rem', borderRadius: '8px', border: 'none',
                    backgroundColor: '#d8be66', color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Editar
                </button>
                <button
                  onClick={async () => {
                    if (!confirm(`¿Eliminar "${movie.title}"?`)) return;
                    setDeletingId(movie.id);
                    await deleteMovie(movie.id);
                    setMovies(prev => prev.filter(m => m.id !== movie.id));
                    setDeletingId(null);
                  }}
                  disabled={deletingId === movie.id}
                  style={{
                    width: '80%', padding: '0.65rem', borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.08)',
                    color: '#ccc', fontWeight: 700, fontSize: '0.85rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                    opacity: deletingId === movie.id ? 0.5 : 1
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                    <path d="M10 11v6"></path><path d="M14 11v6"></path>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                  </svg>
                  {deletingId === movie.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
          {filteredMovies.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#555', padding: '3rem' }}>
              No se encontraron resultados
            </div>
          )}
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editingMovie && (
        <EditMovieModal 
          movie={editingMovie} 
          onClose={(updatedMovie?: Movie) => {
            if (updatedMovie) {
              setMovies(prev => prev.map(m => m.id === updatedMovie.id ? updatedMovie : m));
            }
            setEditingMovie(null);
          }} 
        />
      )}

      {/* ── Add Movie Modal (from TMDB) ── */}
      {addingMovie && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ backgroundColor: '#111', border: '1px solid #1c2633', borderRadius: '12px', width: '100%', maxWidth: '700px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #1c2633', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              {addingMovie.coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={addingMovie.coverUrl} alt={addingMovie.title} style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1 }}>
                <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.3rem 0' }}>{addingMovie.title}</h2>
                <p style={{ color: '#888', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>{addingMovie.year} · ★ {addingMovie.rating} · {addingMovie.type === 'series' ? 'Serie' : 'Película'}</p>
                <p style={{ color: '#666', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>{addingMovie.synopsis?.slice(0, 150)}{(addingMovie.synopsis?.length || 0) > 150 ? '...' : ''}</p>
              </div>
              <button onClick={closeAddModal} style={{ background: '#121a24', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Download URL */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Enlace de Descarga *</label>
                <input
                  type="text"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  placeholder="https://mega.nz/... o URL de descarga"
                  style={inputStyle}
                />
              </div>

              {/* Categories */}
              <div>
                <label style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>Categorías</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  {PREDEFINED_LISTS.map(list => {
                    const isSelected = selectedCategories.includes(list.id);
                    return (
                      <div
                        key={list.id}
                        onClick={() => toggleCategory(list.id)}
                        style={{
                          padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer',
                          border: isSelected ? '1px solid #d8be66' : '1px solid #1c2633',
                          backgroundColor: isSelected ? 'rgba(255,21,21,0.1)' : '#060b13',
                          display: 'flex', alignItems: 'center', gap: '0.6rem', transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: isSelected ? '#d8be66' : 'transparent', border: isSelected ? 'none' : '1px solid #444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {isSelected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </div>
                        <span style={{ color: isSelected ? '#fff' : '#a0a0a0', fontWeight: isSelected ? 700 : 500, fontSize: '0.85rem' }}>{list.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid #1c2633', display: 'flex', gap: '1rem', justifyContent: 'flex-end', backgroundColor: '#0a0a0a' }}>
              <button onClick={closeAddModal} style={{ background: 'transparent', border: 'none', color: '#888', fontWeight: 700, padding: '0.8rem 1.5rem', cursor: 'pointer' }}>Cancelar</button>
              <button
                onClick={handleSaveMovie}
                disabled={isSaving}
                style={{ backgroundColor: '#d8be66', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.8rem 2rem', fontWeight: 700, cursor: 'pointer', opacity: isSaving ? 0.7 : 1 }}
              >
                {isSaving ? 'Guardando...' : 'Agregar al Catálogo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
