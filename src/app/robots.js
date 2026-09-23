import { SITE } from '@/data/resume'

export const dynamic = 'force-static'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep internal / proposal pages out of search results.
        disallow: ['/proposals/', '/_next/'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
