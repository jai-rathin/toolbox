"use client"

import { useEffect, useState, useRef } from "react"
import { Search, Sparkles, ArrowRight, Star, Zap, MousePointer2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMouseParallax } from "@/hooks/use-scroll-reveal"
import { TOOLS } from "@/components/tools/registry"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const mousePosition = useMouseParallax(0.02)
  const searchRef = useRef<HTMLDivElement>(null)
  
  const words = ["Students", "Creators", "Developers", "Everyone"]
  const currentWord = words[currentWordIndex]
  
  // Typewriter effect
  useEffect(() => {
    if (isTyping) {
      if (typedText.length < currentWord.length) {
        const timeout = setTimeout(() => {
          setTypedText(currentWord.slice(0, typedText.length + 1))
        }, 100)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      if (typedText.length > 0) {
        const timeout = setTimeout(() => {
          setTypedText(typedText.slice(0, -1))
        }, 50)
        return () => clearTimeout(timeout)
      } else {
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
        setIsTyping(true)
      }
    }
  }, [typedText, isTyping, currentWord, words.length])

  // Spotlight effect for search bar
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (searchRef.current) {
        const rect = searchRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        searchRef.current.style.setProperty('--mouse-x', `${x}%`)
        searchRef.current.style.setProperty('--mouse-y', `${y}%`)
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10 overflow-hidden">
      {/* Floating geometric shapes with parallax */}
      <div 
        className="absolute top-32 left-10 w-20 h-20 border border-cyan-500/30 rounded-2xl rotate-12 animate-float hover-glow"
        style={{ transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px) rotate(12deg)` }}
      />
      <div 
        className="absolute top-40 right-20 w-16 h-16 border border-teal-500/30 rounded-full animate-morph"
        style={{ transform: `translate(${-mousePosition.x * 1.5}px, ${mousePosition.y * 1.5}px)` }}
      />
      <div 
        className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-lg rotate-45 animate-float-delay-2"
        style={{ transform: `translate(${mousePosition.x}px, ${-mousePosition.y}px) rotate(45deg)` }}
      />
      <div 
        className="absolute bottom-32 right-32 w-24 h-24 border border-blue-500/20 rounded-3xl -rotate-12 animate-card-tilt"
        style={{ transform: `translate(${-mousePosition.x * 2}px, ${-mousePosition.y * 2}px) rotate(-12deg)` }}
      />
      <div className="absolute top-1/3 right-1/4 w-8 h-8 border border-sky-500/25 rounded-full animate-bounce-subtle" />
      <div className="absolute bottom-1/3 left-1/3 w-14 h-14 border border-teal-500/20 rounded-xl rotate-[30deg] animate-wiggle" />
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-neon-flicker shadow-lg shadow-cyan-400/50" />
      <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-teal-400 rounded-full animate-pulse shadow-lg shadow-teal-400/50" />
      <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-neon-flicker shadow-lg shadow-blue-400/50" style={{ animationDelay: '0.5s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge with hover effect */}
          <div className="inline-flex items-center gap-2 glass-glow rounded-full px-4 py-2 mb-8 animate-slide-up-fade hover-lift cursor-default group">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 group-hover:animate-wiggle" />
            <span className="text-sm text-gray-300">Trusted by 50,000+ students worldwide</span>
            <Sparkles className="w-4 h-4 text-cyan-400 group-hover:animate-spin" />
          </div>
          
          {/* Main Headline with Kinetic Typography */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="block text-white animate-slide-up-fade overflow-hidden">
              <span className="inline-block animate-blur-in">All-in-One Free</span>
            </span>
            <span className="block text-gradient-animate animate-slide-up-fade stagger-1">
              Online Tools
            </span>
            <span className="block text-white animate-slide-up-fade stagger-2">
              for{" "}
              <span className="relative inline-block min-w-[200px] sm:min-w-[280px]">
                <span className="gradient-text">
                  {typedText}
                </span>
                <span className="inline-block w-[3px] h-[0.9em] bg-cyan-400 ml-1 animate-pulse" />
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-full scale-x-0 animate-[scale-in_0.5s_ease-out_forwards]" style={{ animationDelay: '1s' }} />
              </span>
            </span>
          </h1>
          
          {/* Subtitle with stagger */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up-fade stagger-3">
            100+ powerful tools at your fingertips. Convert, calculate, create, and code - 
            all free, instant, and beautifully designed for the modern student.
          </p>
          
          {/* Search Bar with Glow & Spotlight */}
          <div 
            ref={searchRef}
            className="relative max-w-2xl mx-auto mb-10 animate-slide-up-fade stagger-4 spotlight"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-30 animate-pulse-glow" />
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                if (searchQuery.trim()) {
                  window.location.href = `/tools?q=${encodeURIComponent(searchQuery.trim())}`
                }
              }}
              className="relative glass-glow rounded-2xl p-2 hover-lift transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-cyan-400 ml-4 animate-bounce-subtle" />
                <input
                  type="text"
                  placeholder="Search for any tool... (e.g., word counter, image resize)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-500 focus:outline-none py-3"
                />
                <Button type="submit" className="btn-glow bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 rounded-xl px-6 py-5 shadow-lg shadow-cyan-500/25 group">
                  <span className="hidden sm:inline mr-2">Search</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>
          </div>
          
          {/* Quick Links with hover effects */}
          <div className="flex flex-wrap justify-center gap-3 animate-slide-up-fade stagger-5">
            <span className="text-gray-500 text-sm flex items-center gap-1">
              <MousePointer2 className="w-3 h-3" /> Popular:
            </span>
            {["Word Counter", "Image Resizer", "PDF Converter", "Color Picker"].map((tool, i) => (
              <button
                key={tool}
                className="text-sm text-gray-400 hover:text-white px-3 py-1 rounded-full border border-gray-700 hover:border-cyan-500 hover:bg-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/10 transition-all hover-scale card-border-glow"
                style={{ animationDelay: `${0.6 + i * 0.1}s` }}
              >
                {tool}
              </button>
            ))}
          </div>
          
          {/* Stats with counter animation */}
          <div className="flex justify-center mt-16 max-w-3xl mx-auto">
            <div 
              className="text-center animate-scale-in group cursor-default"
              style={{ animationDelay: `0.8s` }}
            >
              <div className="relative inline-block">
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1 group-hover:text-gradient-animate transition-all flex items-center gap-2 justify-center">
                  {Object.keys(TOOLS).length}+
                  <Zap className="w-6 h-6 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:animate-bounce-subtle transition-opacity" />
                </div>
              </div>
              <div className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors">Free Tools Available</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator with animation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cyan-500/50 rounded-full flex justify-center pt-2 hover:border-cyan-400 transition-colors cursor-pointer group">
          <div className="w-1 h-2 bg-cyan-500 rounded-full animate-pulse group-hover:h-3 transition-all" />
        </div>
        <span className="block text-xs text-gray-500 mt-2 text-center">Scroll</span>
      </div>
    </section>
  )
}
