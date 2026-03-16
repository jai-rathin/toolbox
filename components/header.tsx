"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Zap, Sparkles, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeLink, setActiveLink] = useState("")
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      
      // Highlight "About" if scrolled to bottom
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        setActiveLink('about')
        return
      }

      // Highlight active page
      if (pathname === '/tools') {
         setActiveLink('tools')
         return
      }
      if (pathname === '/categories') {
         setActiveLink('categories')
         return
      }

      // Highlight sections on homepage
      if (pathname === '/') {
        let current = ''
        const sections = ['trending', 'categories', 'tools']
        for (const section of sections) {
          const element = document.getElementById(section)
          if (element) {
            const rect = element.getBoundingClientRect()
            if (rect.top <= 250) {
              current = section
              break
            }
          }
        }
        if (current) setActiveLink(current)
      }
    }
    
    // Call initially
    handleScroll()
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  const navLinks = [
    { href: "/tools", label: "Tools", id: "tools" },
    { href: "/categories", label: "Categories", id: "categories" },
    { href: "/#trending", label: "Trending", id: "trending" },
    { href: "#about", label: "About", id: "about" },
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "glass py-3 shadow-lg shadow-black/20" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Animated Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl blur-lg opacity-60 group-hover:opacity-100 group-hover:blur-xl transition-all duration-300" />
              <div className="relative bg-gradient-to-r from-teal-500 to-cyan-500 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white group-hover:animate-wiggle" />
              </div>
            </div>
            <span className="text-2xl font-bold">
              <span className="gradient-text group-hover:text-gradient-animate">Tool</span>
              <span className="text-white">Box</span>
            </span>
            <Sparkles className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-gray-300 hover:text-white transition-colors group py-2 ${
                  activeLink === link.id ? 'text-white' : ''
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {/* Underline animation */}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300 ${
                  activeLink === link.id ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
                {/* Background glow on active */}
                {activeLink === link.id && (
                  <span className="absolute inset-0 bg-cyan-500/10 rounded-lg -z-10" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button with enhanced effects */}
          <div className="hidden md:block">
            <Button asChild className="relative overflow-hidden bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 rounded-full px-6 group shadow-lg shadow-cyan-500/25 hover-lift btn-glow">
              <Link href="/tools">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Shimmer effect */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="relative w-6 h-6">
              <Menu className={`w-6 h-6 absolute transition-all duration-300 ${isMobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
              <X className={`w-6 h-6 absolute transition-all duration-300 ${isMobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
            </div>
          </button>
        </nav>

        {/* Mobile Menu with animation */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
          isMobileMenuOpen ? "max-h-[80vh] mt-4 opacity-100 overflow-y-auto" : "max-h-0 opacity-0"
        }`}>
          <div className="glass rounded-2xl p-2 sm:p-4 space-y-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-xl transition-all ${
                  activeLink === link.id ? 'text-white bg-cyan-500/10' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ 
                  transitionDelay: isMobileMenuOpen ? `${i * 50}ms` : '0ms',
                  transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-10px)'
                }}
              >
                <span>{link.label}</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeLink === link.id ? 'text-cyan-400' : ''}`} />
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-white/10">
              <Button asChild className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0 rounded-xl py-3 hover:from-teal-600 hover:to-cyan-600">
                <Link href="/tools" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="flex items-center justify-center gap-2">
                    Get Started
                    <Sparkles className="w-4 h-4" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
