"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AnimatedBackground } from "@/components/animated-background"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ToolCard } from "@/components/tool-card"
import { TOOLS } from "@/components/tools/registry"
import {
  Type,
  Image as ImageIcon,
  Code,
  Wrench,
  Search,
  Home,
  ArrowLeft,
  LayoutGrid
} from "lucide-react"
import Link from "next/link"

const categoryMap: Record<string, string> = {
  "Text Tools": "text",
  "Developer Tools": "dev",
  "Image Tools": "image",
  "Utility Tools": "utility",
}

const getCategoryColor = (label: string) => {
  if (label === "Text Tools") return "from-purple-500 to-violet-600"
  if (label === "Image Tools") return "from-pink-500 to-rose-600"
  if (label === "Developer Tools") return "from-green-500 to-emerald-600"
  return "from-blue-500 to-cyan-600" // Utility Tools
}

const getCategoryIcon = (label: string) => {
  if (label === "Text Tools") return Type
  if (label === "Image Tools") return ImageIcon
  if (label === "Developer Tools") return Code
  return Wrench // Utility Tools
}

// Dynamically generate all tools from registry (48 tools)
const allTools = Object.values(TOOLS).map(tool => ({
  name: tool.title,
  description: tool.description,
  icon: getCategoryIcon(tool.category.label),
  color: getCategoryColor(tool.category.label),
  href: `/tools/${tool.slug}`,
  category: categoryMap[tool.category.label] || "utility",
  isTrending: false,
  isNew: false
}))

const categories = [
  { id: "all", label: "All Tools", icon: LayoutGrid },
  { id: "text", label: "Text", icon: Type },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "dev", label: "Developer", icon: Code },
  { id: "utility", label: "Utility", icon: Wrench },
]

function ToolsContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "all"
  const initialQuery = searchParams.get("q") || ""
  
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    return () => clearTimeout(handler)
  }, [searchQuery])

  // Sync with URL changes
  useEffect(() => {
    setActiveCategory(searchParams.get("category") || "all")
    setSearchQuery(searchParams.get("q") || "")
  }, [searchParams])

  const filteredTools = allTools.filter((tool) => {
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory
    const q = debouncedQuery.toLowerCase()
    const matchesSearch =
      tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Header />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <span>/</span>
            <span className="text-purple-400">All Tools</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {activeCategory !== "all" ? (
                 <span className="capitalize">{activeCategory} Tools</span>
              ) : (
                 <>All <span className="gradient-text">Free Tools</span></>
              )}
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Browse our complete collection of {allTools.length} free online tools. Find exactly what you
              need in seconds.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Results count */}
          <p className="text-gray-400 text-sm mb-6">Showing {filteredTools.length} tools {activeCategory !== "all" && `in ${activeCategory}`}</p>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool, index) => (
              <div
                key={tool.name}
                className="animate-slide-up"
                style={{ animationDelay: `${(index % 12) * 0.03}s` }}
              >
                <ToolCard
                  name={tool.name}
                  description={tool.description}
                  icon={tool.icon}
                  color={tool.color}
                  href={tool.href}
                  isNew={tool.isNew}
                  isTrending={tool.isTrending}
                />
              </div>
            ))}
          </div>

          {/* No results */}
          {filteredTools.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No tools found matching your search.</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("all")
                }}
                className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Back link */}
          <div className="mt-12">
            <Link
               href="/"
               className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
             >
               <ArrowLeft className="w-4 h-4" />
               Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function AllToolsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white">Loading Tools...</div>}>
      <ToolsContent />
    </Suspense>
  )
}
