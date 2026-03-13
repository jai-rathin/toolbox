"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, TrendingUp, Sparkles, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

import { TOOLS } from "@/components/tools/registry"

const trendingToolSlugs = [
  "remove-duplicate-lines",
  "text-diff-checker",
  "video-to-gif",
  "image-compressor",
  "json-formatter",
  "pdf-merger",
]

// Convert slugs to minimal definition for carousel
const trendingTools = trendingToolSlugs.map((slug) => {
  const t = TOOLS[slug]
  // Extract base colors for glow
  const grad = t?.category.label === "Developer Tools" ? "from-sky-500 to-teal-500" :
               t?.category.label === "Video Tools" ? "from-purple-500 to-pink-500" :
               t?.category.label === "Document Tools" ? "from-teal-500 to-emerald-500" :
               t?.category.label === "Image Tools" ? "from-pink-500 to-rose-600" : 
               "from-teal-500 to-cyan-500"
               
  return {
    name: t?.title || "Tool",
    description: t?.description || "",
    gradient: grad,
    glowColor: "rgba(20, 184, 166, 0.3)",
    badge: t?.category.label || "Utility",
    href: `/tools/${slug}`
  }
})

export function TrendingCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Drag to scroll logic
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 400
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown.current = true
    if (carouselRef.current) {
       carouselRef.current.style.cursor = 'grabbing'
       startX.current = e.pageX - carouselRef.current.offsetLeft
       scrollLeft.current = carouselRef.current.scrollLeft
    }
  }

  const handleMouseLeave = () => {
    isDown.current = false
    if (carouselRef.current) {
       carouselRef.current.style.cursor = 'grab'
    }
  }

  const handleMouseUp = () => {
    isDown.current = false
    if (carouselRef.current) {
       carouselRef.current.style.cursor = 'grab'
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !carouselRef.current) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX.current) * 2
    carouselRef.current.scrollLeft = scrollLeft.current - walk
  }

  return (
    <section ref={sectionRef} id="trending" className="py-20 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-cyan-500" />
              <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">
                Trending Now
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Hot Tools This Week <Sparkles className="inline w-8 h-8 text-yellow-400 ml-2" />
            </h2>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500 text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500 text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div 
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {trendingTools.map((tool, index) => (
            <div
              key={tool.name}
              className={`flex-shrink-0 w-[350px] snap-start ${
                isVisible ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="group relative h-full">
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at center, ${tool.glowColor} 0%, transparent 70%)` }}
                />
                
                {/* Card */}
                <div className="relative glass rounded-3xl p-6 h-full border border-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-300 group-hover:-translate-y-2">
                  {/* Badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${tool.gradient} text-white text-xs font-medium mb-4 shadow-lg`}>
                    <Zap className="w-3 h-3" />
                    {tool.badge}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:gradient-text transition-all">
                    {tool.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                    {tool.description}
                  </p>

                  {/* Footer */}
                  <div className="flex justify-end">
                    <a
                      href={tool.href}
                      className={`inline-flex items-center justify-center bg-gradient-to-r ${tool.gradient} text-white border-0 rounded-full px-5 py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity shadow-lg`}
                    >
                      Try Now
                    </a>
                  </div>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {trendingTools.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-gradient-to-r from-teal-500 to-cyan-500' 
                  : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
