import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/trainer/dashboard/', '/gym/dashboard/', '/enterprise/dashboard/', '/admin/'],
      },
    ],
    sitemap: 'https://www.anywherept.com.au/sitemap.xml',
  };
}
