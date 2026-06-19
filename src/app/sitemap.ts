import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://papumoviemkv.store';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/?filter=movie`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/?filter=series`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Películas dinámicas desde Supabase
  const { data: movies } = await supabase
    .from('Movie')
    .select('id, title, createdAt, coverUrl')
    .order('createdAt', { ascending: false });

  const moviePages: MetadataRoute.Sitemap = (movies || []).map((movie) => ({
    url: `${BASE_URL}/movie/${movie.id}`,
    lastModified: movie.createdAt ? new Date(movie.createdAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    images: movie.coverUrl ? [movie.coverUrl] : undefined,
  }));

  return [...staticPages, ...moviePages];
}
