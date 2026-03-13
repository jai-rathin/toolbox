import { AnimatedBackground } from "@/components/animated-background"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TOOLS } from "@/components/tools/registry"
import { CategoryToolsGrid } from "@/components/category-tools-grid"
import Link from "next/link"
import { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const matchingTools = Object.values(TOOLS).filter(t => t.category.slug === resolvedParams.slug)
  
  if (matchingTools.length === 0) {
    return {
      title: "Category Not Found | ToolBox"
    }
  }

  const categoryName = matchingTools[0].category.name
  return {
    title: `${categoryName} – Free Online Utilities | ToolBox`,
    description: `A collection of free online ${categoryName.toLowerCase()} including various practical utilities for everyday use.`,
    alternates: {
      canonical: `https://toolbox.com/categories/${resolvedParams.slug}`
    }
  }
}

export default async function CategorySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  // Find all tools belonging to this category slug
  const matchingTools = Object.values(TOOLS).filter(t => t.category.slug === resolvedParams.slug)
  
  if (matchingTools.length === 0) {
    notFound()
  }

  const categoryName = matchingTools[0].category.name

  return (
    <div className="min-h-screen flex flex-col relative text-white">
      <AnimatedBackground />
      <Header />
      
      <main className="flex-1 pt-32 pb-20 px-6 container mx-auto">
        <div className="mb-8">
          <Link href="/categories" className="inline-flex items-center text-gray-400 hover:text-white mb-6 uppercase tracking-wider text-xs font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-4">{categoryName}</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Browse our collection of {matchingTools.length} hand-picked free tools in the {categoryName} category.
          </p>
        </div>

        <CategoryToolsGrid tools={matchingTools} />
      </main>
      
      <Footer />
    </div>
  )
}
