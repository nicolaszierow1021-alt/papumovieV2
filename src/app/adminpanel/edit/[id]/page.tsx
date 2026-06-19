import { editMovie } from '@/app/actions/movieActions';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import TmdbAutoFill from '@/components/TmdbAutoFill';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EditMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: movie } = await supabase
    .from('Movie')
    .select('*')
    .eq('id', id)
    .single();

  if (!movie) notFound();

  const updateMovieWithId = editMovie.bind(null, id);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <Link href="/adminpanel" style={{ color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </Link>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
              Editar Película
            </h1>
          </div>
          <p style={{ color: '#555', fontSize: '0.9rem' }}>
            {movie.title}
          </p>
        </div>
        <Link
          href={`/movie/${id}`}
          target="_blank"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.6rem 1.2rem', borderRadius: '8px',
            backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            color: '#10b981', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Ver en el sitio
        </Link>
      </div>

      <TmdbAutoFill />

      <form action={updateMovieWithId}>
        <section className="admin-form-section">
          <div className="admin-form-section-title">
            <span className="admin-form-dot edit-dot" />
            Información Principal
          </div>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="type" className="admin-form-label">Tipo de Contenido</label>
              <select id="type" name="type" className="admin-form-input" defaultValue={movie.type || 'movie'}>
                <option value="movie">Película</option>
                <option value="series">Serie</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label htmlFor="title" className="admin-form-label">Título *</label>
              <input type="text" id="title" name="title" required className="admin-form-input" defaultValue={movie.title} />
            </div>
            <div className="admin-form-group admin-form-full">
              <label htmlFor="synopsis" className="admin-form-label">Sinopsis</label>
              <textarea id="synopsis" name="synopsis" className="admin-form-input admin-form-textarea" rows={4} defaultValue={movie.synopsis || ''} />
            </div>
          </div>
        </section>

        <section className="admin-form-section">
          <div className="admin-form-section-title">
            <span className="admin-form-dot edit-dot" />
            Datos Técnicos
          </div>
          <div className="admin-form-grid">
            {[
              { id: 'director', label: 'Director', val: movie.director },
              { id: 'rating', label: 'Calificación', val: movie.rating },
              { id: 'year', label: 'Año', val: movie.year },
              { id: 'duration', label: 'Duración', val: movie.duration },
              { id: 'quality', label: 'Calidad', val: movie.quality },
              { id: 'format', label: 'Formato', val: movie.format },
              { id: 'resolution', label: 'Resolución', val: movie.resolution },
              { id: 'audio', label: 'Audio', val: movie.audio },
              { id: 'subtitles', label: 'Subtítulos', val: movie.subtitles },
              { id: 'size', label: 'Tamaño del archivo', val: movie.size },
            ].map((f) => (
              <div key={f.id} className="admin-form-group">
                <label htmlFor={f.id} className="admin-form-label">{f.label}</label>
                <input type="text" id={f.id} name={f.id} className="admin-form-input" defaultValue={f.val || ''} />
              </div>
            ))}
          </div>
        </section>

        <section className="admin-form-section">
          <div className="admin-form-section-title">
            <span className="admin-form-dot edit-dot" />
            Multimedia y Enlaces
          </div>
          <div className="admin-form-grid-single">
            {[
              { id: 'coverUrl', label: 'Portada Vertical (Póster) *', val: movie.coverUrl, required: true, type: 'url' },
              { id: 'bannerUrl', label: 'Fondo Ancho (Banner)', val: movie.bannerUrl, type: 'url' },
              { id: 'trailerUrl', label: 'Tráiler (YouTube)', val: movie.trailerUrl, type: 'url' },
              { id: 'downloadUrl', label: 'Enlace de Descarga *', val: movie.downloadUrl, required: true, type: 'url' },
              { id: 'password', label: 'Contraseña del archivo', val: movie.password, type: 'text' },
            ].map((f) => (
              <div key={f.id} className="admin-form-group">
                <label htmlFor={f.id} className="admin-form-label">{f.label}</label>
                <input type={f.type} id={f.id} name={f.id} className="admin-form-input"
                  required={f.required} defaultValue={f.val || ''} />
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className="admin-form-submit edit-submit">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Guardar Cambios
        </button>
      </form>

      <style>{`
        .admin-form-section {
          background-color: #141414;
          border: 1px solid #1f1f1f;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .admin-form-section-title {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 1rem;
          font-weight: 700;
          color: #ccc;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #1f1f1f;
        }
        .admin-form-dot {
          display: inline-block;
          width: 4px;
          height: 16px;
          background-color: #E50914;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .edit-dot {
          background-color: #1d4ed8;
        }
        .admin-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .admin-form-grid-single {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .admin-form-full {
          grid-column: 1 / -1;
        }
        .admin-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .admin-form-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .admin-form-input {
          background-color: #0f0f0f;
          border: 1px solid #2a2a2a;
          color: #e5e5e5;
          padding: 0.65rem 0.9rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-family: inherit;
          width: 100%;
          transition: border-color 0.2s;
        }
        .admin-form-input:focus {
          border-color: #1d4ed8;
          outline: none;
        }
        .admin-form-textarea {
          resize: vertical;
          min-height: 100px;
        }
        .admin-form-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.9rem;
          background-color: #E50914;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.2s;
        }
        .edit-submit {
          background-color: #1d4ed8;
        }
        .admin-form-submit:hover {
          opacity: 0.9;
        }

        @media (max-width: 600px) {
          .admin-form-section {
            padding: 1rem;
          }
          .admin-form-grid {
            grid-template-columns: 1fr;
          }
          .admin-form-full {
            grid-column: 1;
          }
        }
      `}</style>
    </div>
  );
}
