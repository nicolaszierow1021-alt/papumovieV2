export function cleanTitle(title: string): string {
  if (!title) return '';
  // Eliminar contenido entre corchetes [] y paréntesis ()
  let cleaned = title.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '');
  
  // Limpiar tags comunes por si no estaban entre corchetes
  const tags = ['WEB-DL', 'HDR10', 'UHD', '4K', 'BluRay', 'REMUX', 'DV', 'HEVC', 'x264', 'x265', 'AAC', 'DTS', '1080p', '720p', '2160p'];
  const regex = new RegExp(`\\b(${tags.join('|')})\\b`, 'gi');
  cleaned = cleaned.replace(regex, '');
  
  // Eliminar caracteres especiales que quedan sueltos y espacios múltiples
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Limpiar guiones o puntos huérfanos al final del string si quedaron (opcional, pero útil)
  cleaned = cleaned.replace(/^[-\s]+|[-\s]+$/g, '');
  
  return cleaned;
}
