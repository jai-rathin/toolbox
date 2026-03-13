"use client"

import { useRef, useEffect } from "react"
import { Type, Image, Calculator, Code, FileText, Palette, Lock, Music, ArrowUpRight } from "lucide-react"
import { useScrollReveal, useStaggeredReveal } from "@/hooks/use-scroll-reveal"
import { TOOLS } from "@/components/tools/registry"

const categories = [
  {
    icon: Type,
    name: "Text Tools",
    description: "Word counter, case converter, text formatter",
    color: "from-teal-500 to-cyan-500",
    glowColor: "rgba(20, 184, 166, 0.4)",
    tools: Object.values(TOOLS).filter(t => t.category.slug === "text-tools").length,
    href: "/categories/text-tools"
  },
  {
    icon: Code,
    name: "Developer Tools",
    description: "JSON, Regex, URL formatters, Encoders",
    color: "from-sky-500 to-teal-500",
    glowColor: "rgba(14, 165, 233, 0.4)",
    tools: Object.values(TOOLS).filter(t => t.category.slug === "developer-tools").length,
    href: "/categories/developer-tools"
  },
  {
    icon: Image,
    name: "Image Tools",
    description: "Resize, compress, convert, and edit images",
    color: "from-cyan-500 to-blue-500",
    glowColor: "rgba(34, 211, 238, 0.4)",
    tools: Object.values(TOOLS).filter(t => t.category.slug === "image-tools").length,
    href: "/categories/image-tools"
  },
  {
    icon: Calculator,
    name: "Calculator Tools",
    description: "Math, finance, health, and unit calculators",
    color: "from-blue-500 to-sky-500",
    glowColor: "rgba(59, 130, 246, 0.4)",
    tools: Object.values(TOOLS).filter(t => t.category.slug === "calculator-tools").length,
    href: "/categories/calculator-tools"
  },
  {
    icon: FileText,
    name: "PDF Tools",
    description: "Merge, split, compress, and edit PDF documents",
    color: "from-teal-500 to-emerald-500",
    glowColor: "rgba(20, 184, 166, 0.4)",
    tools: Object.values(TOOLS).filter(t => t.category.slug === "pdf-tools").length,
    href: "/categories/pdf-tools"
  },
  {
    icon: Music,
    name: "Media Tools",
    description: "Audio converter, video trimmers, media compressors",
    color: "from-sky-400 to-blue-500",
    glowColor: "rgba(14, 165, 233, 0.4)",
    tools: Object.values(TOOLS).filter(t => t.category.slug === "media-tools").length,
    href: "/categories/media-tools"
  },
  {
    icon: Palette,
    name: "Design Tools",
    description: "Color picker, gradient generator, css utilities",
    color: "from-cyan-400 to-teal-400",
    glowColor: "rgba(34, 211, 238, 0.4)",
    tools: Object.values(TOOLS).filter(t => t.category.slug === "design-tools").length,
    href: "/categories/design-tools"
  },
  {
    icon: Lock,
    name: "Security Tools",
    description: "Password generator, hashes, base64 operations",
    color: "from-blue-400 to-cyan-400",
    glowColor: "rgba(59, 130, 246, 0.4)",
    tools: Object.values(TOOLS).filter(t => t.category.slug === "security-tools").length,
    href: "/categories/security-tools"
  },
  {
    icon: ArrowUpRight,
    name: "Utility Tools",
    description: "Dice rollers, lorem ipsum, generic utilities",
    color: "from-teal-400 to-sky-400",
    glowColor: "rgba(20, 184, 166, 0.4)",
    tools: Object.values(TOOLS).filter(t => t.category.slug === "utility-tools").length,
    href: "/categories/utility-tools"
  }
]

export function CategorySection() {
  const [sectionRef, isVisible] = useScrollReveal<HTMLElement>({ threshold: 0.1 })
  const delays = useStaggeredReveal(isVisible, categories.length, 0, 0.08)
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])

  // Spotlight effect for cards
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cardRefs.current.forEach((card) => {
        if (card) {
          const rect = card.getBoundingClientRect()
          const x = ((e.clientX - rect.left) / rect.width) * 100
          const y = ((e.clientY - rect.top) / rect.height) * 100
          card.style.setProperty('--mouse-x', `${x}%`)
          card.style.setProperty('--mouse-y', `${y}%`)
        }
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section ref={sectionRef} id="categories" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4 animate-blur-in">
            Explore Categories
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Everything You Need,{" "}
            <span className="text-gradient-animate">One Place</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse through our comprehensive collection of tools organized by category. 
            Find exactly what you need in seconds.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <a
                key={category.name}
                href={category.href}
                ref={(el) => { cardRefs.current[index] = el }}
                className={`group relative p-6 rounded-3xl glass spotlight card-border-glow cursor-pointer overflow-hidden
                  transition-all duration-500 hover:-translate-y-2
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}
                `}
                style={{ 
                  transitionDelay: `${delays[index]}s`,
                  transitionProperty: 'opacity, transform'
                }}
              >
                {/* Gradient glow on hover */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl"
                  style={{ background: `radial-gradient(circle at center, ${category.glowColor} 0%, transparent 70%)` }}
                />
                
                {/* Icon with 3D effect */}
                <div className="relative mb-4">
                  <div 
                    className={`relative w-14 h-14 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center 
                      transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg
                      group-hover:shadow-xl`} 
                    style={{ boxShadow: `0 10px 40px ${category.glowColor}` }}
                  >
                    <Icon className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  {/* Floating ring */}
                  <div className="absolute inset-0 w-14 h-14 rounded-2xl border-2 border-cyan-500/0 group-hover:border-cyan-500/30 group-hover:scale-125 transition-all duration-500" />
                  {/* Ping effect */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="absolute inset-0 bg-cyan-400 rounded-full animate-ping" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gradient-animate transition-all flex items-center gap-2">
                  {category.name}
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 group-hover:text-gray-300 transition-colors">
                  {category.description}
                </p>

                {/* Footer with animated counter */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cyan-400 group-hover:text-teal-400 transition-colors font-medium">
                    {category.tools} tools
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </span>
                </div>

                {/* Shine sweep effect */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
