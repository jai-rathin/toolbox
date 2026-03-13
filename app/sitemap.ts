import { MetadataRoute } from 'next'
import { TOOLS } from '@/components/tools/registry'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toolbox.com'

  const staticPages = [
    '',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/tools',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const categories = Array.from(new Set(Object.values(TOOLS).map(t => t.category.slug))).map((slug) => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const tools = Object.values(TOOLS).map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...categories, ...tools]
}
