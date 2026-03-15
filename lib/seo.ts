/**
 * Reusable SEO metadata generator for tool pages.
 * Automatically generates Next.js Metadata from tool definitions + SEO data.
 */

import type { Metadata } from "next"
import { getToolSEO } from "@/lib/seo-data"

const BASE_URL = "https://toolbox.com"

interface ToolMeta {
  slug: string
  title: string
  description: string
  categoryName: string
}

/**
 * Generate complete SEO metadata for a tool page.
 * Usage: return generateToolSEO({ slug, title, description, categoryName }) from generateMetadata()
 */
export function generateToolSEO(tool: ToolMeta): Metadata {
  const seo = getToolSEO(tool.slug, tool.title, tool.categoryName)
  const title = `${tool.title} – Free Online Tool | ToolBox`
  const description = seo.metaDescription
  const url = `${BASE_URL}/tools/${tool.slug}`

  return {
    title,
    description,
    keywords: seo.keywords.join(", "),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "ToolBox",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

/**
 * Generate JSON-LD structured data for a tool page.
 * Returns an array of schema objects: SoftwareApplication, BreadcrumbList, FAQPage
 */
export function generateToolSchemas(tool: ToolMeta) {
  const seo = getToolSEO(tool.slug, tool.title, tool.categoryName)
  const url = `${BASE_URL}/tools/${tool.slug}`

  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    description: seo.metaDescription,
    url,
    applicationCategory: tool.categoryName,
    operatingSystem: "Web",
    author: {
      "@type": "Organization",
      name: "ToolBox",
      url: BASE_URL,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tool.categoryName,
        item: `${BASE_URL}/categories/${tool.categoryName.toLowerCase().replace(/\s+/g, "-")}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.title,
        item: url,
      },
    ],
  }

  const faqSchema =
    seo.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: seo.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null

  return { softwareApp, breadcrumb, faqSchema }
}
