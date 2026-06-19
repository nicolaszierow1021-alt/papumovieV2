import { createMovie } from '@/app/actions/movieActions';
import TmdbAutoFill from '@/components/TmdbAutoFill';

export default function AddMoviePage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
          Añadir Película
        </h1>
        <p style={{ color: '#555', fontSize: '0.9rem' }}>
          Completa los datos o usa el autocompletado de TMDB
        </p>
      </div>

      <TmdbAutoFill />

      <form action={createMovie}>
        {/* Información Principal */}
        <section className="admin-form-section">
          <div className="admin-form-section-title">
            <span className="admin-form-dot" />
            Información Principal
          </div>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="type" className="admin-form-label">Tipo de Contenido</label>
              <select id="type" name="type" className="admin-form-input">
                <option value="movie">Película</option>
                <option value="series">Serie</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label htmlFor="title" className="admin-form-label">Título *</label>
              <input type="text" id="title" name="title" required className="admin-form-input" placeholder="Ej: Avengers: Endgame" />
            </div>
            <div className="admin-form-group admin-form-full">
              <label htmlFor="synopsis" className="admin-form-label">Sinopsis</label>
              <textarea id="synopsis" name="synopsis" className="admin-form-input admin-form-textarea" rows={4} placeholder="Escribe la descripción aquí..." />
            </div>
          </div>
        </section>

        {/* Datos Técnicos */}
        <section className="admin-form-section">
          <div className="admin-form-section-title">
            <span className="admin-form-dot" />
            Datos Técnicos
          </div>
          <div className="admin-form-grid">
            {[
              { id: 'director', label: 'Director', placeholder: 'Ej: Christopher Nolan' },
              { id: 'rating', label: 'Calificación', placeholder: 'Ej: 8.5' },
              { id: 'year', label: 'Año', placeholder: 'Ej: 2024' },
              { id: 'duration', label: 'Duración', placeholder: 'Ej: 124 Min.' },
              { id: 'quality', label: 'Calidad', defaultValue: '1080p HD' },
              { id: 'format', label: 'Formato', defaultValue: 'MKV' },
              { id: 'resolution', label: 'Resolución', defaultValue: '1920x1080' },
              { id: 'audio', label: 'Audio', defaultValue: 'Latino 5.1' },
              { id: 'subtitles', label: 'Subtítulos', defaultValue: 'Español' },
              { id: 'size', label: 'Tamaño del archivo', placeholder: 'Ej: 4 GB' },
            ].map((f) => (
              <div key={f.id} className="admin-form-group">
                <label htmlFor={f.id} className="admin-form-label">{f.label}</label>
                <input type="text" id={f.id} name={f.id} className="admin-form-input"
                  placeholder={f.placeholder} defaultValue={f.defaultValue} />
              </div>
            ))}
          </div>
        </section>

        {/* Multimedia y Enlaces */}
        <section className="admin-form-section">
          <div className="admin-form-section-title">
            <span className="admin-form-dot" />
            Multimedia y Enlaces
          </div>
          <div className="admin-form-grid-single">
            {[
              { id: 'coverUrl', label: 'Portada Vertical (Póster) *', placeholder: 'https://...', required: true, type: 'url' },
              { id: 'bannerUrl', label: 'Fondo Ancho (Banner)', placeholder: 'https://...', type: 'url' },
              { id: 'trailerUrl', label: 'Tráiler (YouTube)', placeholder: 'https://www.youtube.com/watch?v=...', type: 'url' },
              { id: 'downloadUrl', label: 'Enlace de Descarga *', placeholder: 'https://mega.nz/...', required: true, type: 'url' },
              { id: 'password', label: 'Contraseña del archivo', placeholder: 'Contraseña', defaultValue: 'el_papu_cinefilo', type: 'text' },
            ].map((f) => (
              <div key={f.id} className="admin-form-group">
                <label htmlFor={f.id} className="admin-form-label">{f.label}</label>
                <input type={f.type} id={f.id} name={f.id} className="admin-form-input"
                  placeholder={f.placeholder} required={f.required} defaultValue={f.defaultValue} />
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className="admin-form-submit">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Publicar Película
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
          border-color: #E50914;
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
        .admin-form-submit:hover {
          opacity: 0.9;
        }

        /* Mobile responsive */
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
