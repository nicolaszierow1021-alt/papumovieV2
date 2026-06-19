import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/adminpanel', '/login'],
      },
    ],
    sitemap: 'https://papumoviemkv.store/sitemap.xml',
    host: 'https://papumoviemkv.store',
  };
}
