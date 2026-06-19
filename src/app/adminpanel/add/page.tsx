import { createMovie } from '@/app/actions/movieActions';
import TmdbAutoFill from '@/components/TmdbAutoFill';

export default function AddMoviePage() {
  return (
    <>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Añadir Nueva Película</h1>
      </div>

      <TmdbAutoFill />

      <form action={createMovie}>
        <div className="form-section">
          <h2 className="form-section-title">Información Principal</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="type" className="form-label">Tipo de Contenido</label>
              <select id="type" name="type" className="form-input">
                <option value="movie">Película</option>
                <option value="series">Serie</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="title" className="form-label">Título</label>
              <input type="text" id="title" name="title" required className="form-input" placeholder="Ej: Matrix" />
            </div>
            <div className="form-group full">
              <label htmlFor="synopsis" className="form-label">Sinopsis</label>
              <textarea id="synopsis" name="synopsis" className="form-input" rows={4} placeholder="Escribe la descripción aquí..."></textarea>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Datos Técnicos</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="director" className="form-label">Director</label>
              <input type="text" id="director" name="director" className="form-input" placeholder="Ej: Christopher Nolan" />
            </div>
            <div className="form-group">
              <label htmlFor="rating" className="form-label">Calificación Estrellas</label>
              <input type="text" id="rating" name="rating" className="form-input" placeholder="Ej: 8.5" />
            </div>
            <div className="form-group">
              <label htmlFor="year" className="form-label">Año</label>
              <input type="text" id="year" name="year" className="form-input" placeholder="Ej: 2023" />
            </div>
            <div className="form-group">
              <label htmlFor="duration" className="form-label">Duración</label>
              <input type="text" id="duration" name="duration" className="form-input" placeholder="Ej: 124 Min." />
            </div>
            <div className="form-group">
              <label htmlFor="quality" className="form-label">Calidad</label>
              <input type="text" id="quality" name="quality" className="form-input" defaultValue="1080p HD" />
            </div>
            <div className="form-group">
              <label htmlFor="format" className="form-label">Formato</label>
              <input type="text" id="format" name="format" className="form-input" defaultValue="Mkv" />
            </div>
            <div className="form-group">
              <label htmlFor="resolution" className="form-label">Resolución</label>
              <input type="text" id="resolution" name="resolution" className="form-input" defaultValue="1920x1080" />
            </div>
            <div className="form-group">
              <label htmlFor="audio" className="form-label">Audio</label>
              <input type="text" id="audio" name="audio" className="form-input" defaultValue="Latino 5.1" />
            </div>
            <div className="form-group">
              <label htmlFor="subtitles" className="form-label">Subtítulos</label>
              <input type="text" id="subtitles" name="subtitles" className="form-input" defaultValue="Español" />
            </div>
            <div className="form-group">
              <label htmlFor="size" className="form-label">Tamaño</label>
              <input type="text" id="size" name="size" className="form-input" placeholder="Ej: 4GB" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Multimedia y Enlaces</h2>
          <div className="form-grid">
            <div className="form-group full">
              <label htmlFor="coverUrl" className="form-label">Enlace de la Portada Vertical (Póster)</label>
              <input type="url" id="coverUrl" name="coverUrl" className="form-input" required placeholder="https://..." />
            </div>
            <div className="form-group full">
              <label htmlFor="bannerUrl" className="form-label">Enlace del Fondo Ancho (Banner)</label>
              <input type="url" id="bannerUrl" name="bannerUrl" className="form-input" placeholder="https://..." />
            </div>
            <div className="form-group full">
              <label htmlFor="trailerUrl" className="form-label">Enlace del Tráiler (YouTube)</label>
              <input type="url" id="trailerUrl" name="trailerUrl" className="form-input" placeholder="https://www.youtube.com/watch?v=..." />
            </div>
            <div className="form-group full">
              <label htmlFor="downloadUrl" className="form-label">Enlace de Descarga</label>
              <input type="url" id="downloadUrl" name="downloadUrl" className="form-input" required placeholder="https://mega.nz/..." />
            </div>
            <div className="form-group full">
              <label htmlFor="password" className="form-label">Contraseña del archivo</label>
              <input type="text" id="password" name="password" className="form-input" defaultValue="el_papu_cinefilo" />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.2rem' }}>
          Publicar Película
        </button>
      </form>
    </>
  );
}
