import { editMovie } from '@/app/actions/movieActions';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import TmdbAutoFill from '@/components/TmdbAutoFill';

export const dynamic = 'force-dynamic';

export default async function EditMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: movie } = await supabase
    .from('Movie')
    .select('*')
    .eq('id', id)
    .single();

  if (!movie) {
    notFound();
  }

  // Bind the ID to the edit action so it works with the form
  const updateMovieWithId = editMovie.bind(null, id);

  return (
    <>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Editar: {movie.title}</h1>
      </div>

      <TmdbAutoFill />

      <form action={updateMovieWithId}>
        <div className="form-section">
          <h2 className="form-section-title">Información Principal</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="type" className="form-label">Tipo de Contenido</label>
              <select id="type" name="type" className="form-input" defaultValue={movie.type || 'movie'}>
                <option value="movie">Película</option>
                <option value="series">Serie</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="title" className="form-label">Título</label>
              <input type="text" id="title" name="title" required className="form-input" defaultValue={movie.title} />
            </div>
            <div className="form-group full">
              <label htmlFor="synopsis" className="form-label">Sinopsis</label>
              <textarea id="synopsis" name="synopsis" className="form-input" rows={4} defaultValue={movie.synopsis || ''}></textarea>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Datos Técnicos</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="director" className="form-label">Director</label>
              <input type="text" id="director" name="director" className="form-input" defaultValue={movie.director || ''} />
            </div>
            <div className="form-group">
              <label htmlFor="rating" className="form-label">Calificación Estrellas</label>
              <input type="text" id="rating" name="rating" className="form-input" defaultValue={movie.rating || ''} />
            </div>
            <div className="form-group">
              <label htmlFor="year" className="form-label">Año</label>
              <input type="text" id="year" name="year" className="form-input" defaultValue={movie.year || ''} />
            </div>
            <div className="form-group">
              <label htmlFor="duration" className="form-label">Duración</label>
              <input type="text" id="duration" name="duration" className="form-input" defaultValue={movie.duration || ''} />
            </div>
            <div className="form-group">
              <label htmlFor="quality" className="form-label">Calidad</label>
              <input type="text" id="quality" name="quality" className="form-input" defaultValue={movie.quality || ''} />
            </div>
            <div className="form-group">
              <label htmlFor="format" className="form-label">Formato</label>
              <input type="text" id="format" name="format" className="form-input" defaultValue={movie.format || ''} />
            </div>
            <div className="form-group">
              <label htmlFor="resolution" className="form-label">Resolución</label>
              <input type="text" id="resolution" name="resolution" className="form-input" defaultValue={movie.resolution || ''} />
            </div>
            <div className="form-group">
              <label htmlFor="audio" className="form-label">Audio</label>
              <input type="text" id="audio" name="audio" className="form-input" defaultValue={movie.audio || ''} />
            </div>
            <div className="form-group">
              <label htmlFor="subtitles" className="form-label">Subtítulos</label>
              <input type="text" id="subtitles" name="subtitles" className="form-input" defaultValue={movie.subtitles || ''} />
            </div>
            <div className="form-group">
              <label htmlFor="size" className="form-label">Tamaño</label>
              <input type="text" id="size" name="size" className="form-input" defaultValue={movie.size || ''} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Multimedia y Enlaces</h2>
          <div className="form-grid">
            <div className="form-group full">
              <label htmlFor="coverUrl" className="form-label">Enlace de la Portada Vertical (Póster)</label>
              <input type="url" id="coverUrl" name="coverUrl" className="form-input" required defaultValue={movie.coverUrl} />
            </div>
            <div className="form-group full">
              <label htmlFor="bannerUrl" className="form-label">Enlace del Fondo Ancho (Banner)</label>
              <input type="url" id="bannerUrl" name="bannerUrl" className="form-input" defaultValue={movie.bannerUrl || ''} />
            </div>
            <div className="form-group full">
              <label htmlFor="trailerUrl" className="form-label">Enlace del Tráiler (YouTube)</label>
              <input type="url" id="trailerUrl" name="trailerUrl" className="form-input" defaultValue={movie.trailerUrl || ''} />
            </div>
            <div className="form-group full">
              <label htmlFor="downloadUrl" className="form-label">Enlace de Descarga</label>
              <input type="url" id="downloadUrl" name="downloadUrl" className="form-input" required defaultValue={movie.downloadUrl} />
            </div>
            <div className="form-group full">
              <label htmlFor="password" className="form-label">Contraseña del archivo</label>
              <input type="text" id="password" name="password" className="form-input" defaultValue={movie.password || ''} />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.2rem', backgroundColor: '#1d4ed8' }}>
          Guardar Cambios
        </button>
      </form>
    </>
  );
}
