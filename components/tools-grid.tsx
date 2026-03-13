"use client"

import { useState } from "react"
import { ToolCard } from "./tool-card"
import { useScrollReveal, useStaggeredReveal } from "@/hooks/use-scroll-reveal"
import { Sparkles, ArrowRight } from "lucide-react"
import { 
  Type, Code, Sparkles as SparklesIcon,
  Hash, Shuffle, CaseSensitive,
  Braces, Link, KeyRound, Binary, Calculator,
  QrCode, Droplets, Clock, Dice6, Fingerprint,
  Image as ImageIcon, FileText
} from "lucide-react"

import { TOOLS } from "@/components/tools/registry"

const allToolsArray = Object.values(TOOLS).map(tool => ({
  name: tool.title,
  description: tool.description,
  // Approximate icons for categories
  icon: tool.category.name === "Text Tools" ? Type :
        tool.category.name === "Image Tools" ? ImageIcon :
        tool.category.name === "Developer Tools" ? Code :
        tool.category.name === "PDF Tools" ? FileText :
        tool.category.name === "Media Tools" ? Hash : SparklesIcon,
  color: tool.category.name === "Developer Tools" ? "from-sky-500 to-teal-500" :
         tool.category.name === "Media Tools" ? "from-purple-500 to-pink-500" :
         tool.category.name === "PDF Tools" ? "from-teal-500 to-emerald-500" :
         tool.category.name === "Image Tools" ? "from-pink-500 to-rose-600" : 
         tool.category.name === "Text Tools" ? "from-teal-500 to-cyan-500" : "from-teal-400 to-cyan-400",
  href: `/tools/${tool.slug}`,
  category: tool.category.slug.includes("text") ? "text" :
            tool.category.slug.includes("dev") || tool.category.slug.includes("security") ? "dev" :
            tool.category.slug.includes("image") || tool.category.slug.includes("design") ? "image" :
            tool.category.slug.includes("media") ? "media" :
            tool.category.slug.includes("pdf") ? "pdf" :
            tool.category.slug.includes("calculator") ? "calculator" : "utility",
  isTrending: false,
  isNew: false
}))

const tools = allToolsArray.slice(0, 15) // Show top 15 tools on grid

const categories = [
  { id: "all", label: "All Tools", icon: Sparkles },
  { id: "text", label: "Text", icon: Type },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "dev", label: "Developer", icon: Code },
  { id: "calculator", label: "Calculators", icon: Calculator },
  { id: "utility", label: "Utility", icon: SparklesIcon },
]

export function ToolsGrid() {
  const [sectionRef, isVisible] = useScrollReveal<HTMLElement>({ threshold: 0.05 })
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredTools = activeCategory === "all" 
    ? tools 
    : tools.filter(tool => tool.category === activeCategory)
  
  const delays = useStaggeredReveal(isVisible, filteredTools.length, 0.1, 0.05)

  return (
    <section ref={sectionRef} id="tools" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4">
            Our Tools
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Popular <span className="text-gradient-animate">Free Tools</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover our most-used tools. Each one is designed to be fast, 
            intuitive, and completely free to use.
          </p>
        </div>

        {/* Category Filter with animation */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {categories.map((category, i) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 hover-scale ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/25 scale-105"
                    : "glass text-gray-400 hover:text-white hover:border-cyan-500/50"
                }`}
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <Icon className={`w-4 h-4 ${activeCategory === category.id ? 'animate-bounce-subtle' : ''}`} />
                {category.label}
              </button>
            )
          })}
        </div>

        {/* Tools Grid with staggered reveal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool, index) => (
            <div
              key={tool.name}
              className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${delays[index]}s` }}
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

        {/* View All Button with hover effect */}
        <div className={`text-center mt-12 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a
            href="/tools"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium 
              hover:from-teal-600 hover:to-cyan-600 transition-all hover-lift btn-glow shadow-lg shadow-cyan-500/25"
          >
            <span>View All 100+ Tools</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}
