import { AnimatedBackground } from "@/components/animated-background"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TOOLS } from "@/components/tools/registry"
import { CategoryToolsGrid } from "@/components/category-tools-grid"
import Link from "next/link"
import { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

const BASE_URL = "https://toolbox.com"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const matchingTools = Object.values(TOOLS).filter(t => t.category.slug === resolvedParams.slug)
  
  if (matchingTools.length === 0) {
    return {
      title: "Category Not Found | ToolBox"
    }
  }

  const categoryName = matchingTools[0].category.name
  const title = `${categoryName} – Free Online Utilities | ToolBox`
  const description = `Browse ${matchingTools.length} free online ${categoryName.toLowerCase()} on ToolBox. Fast, secure, browser-based utilities. No signup required.`
  const url = `${BASE_URL}/categories/${resolvedParams.slug}`

  return {
    title,
    description,
    keywords: `${categoryName.toLowerCase()}, free ${categoryName.toLowerCase()}, online tools, toolbox`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "ToolBox",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function CategorySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const matchingTools = Object.values(TOOLS).filter(t => t.category.slug === resolvedParams.slug)
  
  if (matchingTools.length === 0) {
    notFound()
  }

  const categoryName = matchingTools[0].category.name

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Categories", item: `${BASE_URL}/categories` },
      { "@type": "ListItem", position: 3, name: categoryName, item: `${BASE_URL}/categories/${resolvedParams.slug}` },
    ],
  }

  return (
    <div className="min-h-screen flex flex-col relative text-white">
      <AnimatedBackground />
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <main className="flex-1 pt-32 pb-20 px-6 container mx-auto">
        <div className="mb-8">
          <Link href="/categories" className="inline-flex items-center text-gray-400 hover:text-white mb-6 uppercase tracking-wider text-xs font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-4">{categoryName}</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Browse our collection of {matchingTools.length} hand-picked free tools in the {categoryName} category. All tools work entirely in your browser — fast, secure, and private.
          </p>
        </div>

        <CategoryToolsGrid tools={matchingTools} />

        {/* SEO content for category */}
        <div className="mt-16 pt-12 border-t border-white/10 text-gray-300 space-y-8 max-w-3xl">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">About {categoryName}</h2>
            <p className="leading-relaxed">
              Our {categoryName.toLowerCase()} collection includes {matchingTools.length} free online utilities designed to help you accomplish tasks quickly and securely. 
              Every tool runs entirely in your browser — your data never leaves your device. No signup, no downloads, no hidden fees.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Popular {categoryName}</h2>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              {matchingTools.slice(0, 6).map((t) => (
                <li key={t.slug}>
                  <Link href={`/tools/${t.slug}`} className="text-cyan-400 hover:text-cyan-300 font-medium">
                    {t.title}
                  </Link>
                  {" — "}{t.description}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
