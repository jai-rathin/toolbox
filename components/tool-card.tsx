"use client"

import { useRef, useEffect, useState } from "react"
import { type LucideIcon } from "lucide-react"
import { ArrowRight, Star, Sparkles } from "lucide-react"

interface ToolCardProps {
  name: string
  description: string
  icon: LucideIcon
  color: string
  href: string
  isNew?: boolean
  isTrending?: boolean
}

export function ToolCard({ 
  name, 
  description, 
  icon: Icon, 
  color, 
  href,
  isNew,
  isTrending 
}: ToolCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [tiltStyle, setTiltStyle] = useState({})

  // 3D tilt effect on hover
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10
      
      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
        transition: 'transform 0.1s ease-out'
      })

      // Spotlight position
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`)
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`)
    }

    const handleMouseLeave = () => {
      setTiltStyle({
        transform: 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
        transition: 'transform 0.5s ease-out'
      })
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isHovered])

  return (
    <a
      ref={cardRef}
      href={href}
      className="group relative block spotlight"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={tiltStyle}
    >
      {/* Animated gradient border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500 group-hover:blur-md animate-gradient" />
      
      {/* Card content */}
      <div className="relative glass rounded-2xl p-6 h-full overflow-hidden">
        {/* Badges with animation */}
        <div className="absolute top-4 right-4 flex gap-2">
          {isNew && (
            <span className="px-2 py-1 text-xs font-medium bg-teal-500/20 text-teal-400 rounded-full border border-teal-500/30 animate-scale-pulse flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              New
            </span>
          )}
          {isTrending && (
            <span className="px-2 py-1 text-xs font-medium bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30 flex items-center gap-1 group-hover:animate-wiggle">
              <Star className="w-3 h-3 fill-current" />
              Hot
            </span>
          )}
        </div>

        {/* Icon with 3D floating effect */}
        <div className="relative mb-4">
          <div 
            className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center 
              transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:-translate-y-1 shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          {/* Glow ring */}
          <div className={`absolute inset-0 w-12 h-12 rounded-xl bg-gradient-to-r ${color} opacity-0 group-hover:opacity-60 blur-xl transition-all duration-500`} />
          {/* Orbiting dot */}
          <div className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              top: '50%',
              left: '50%',
              animation: isHovered ? 'spin-slow 3s linear infinite' : 'none',
              transformOrigin: '-20px 0'
            }}
          />
        </div>

        {/* Text with reveal animation */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gradient-animate transition-all duration-300">
          {name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 group-hover:text-gray-300 transition-colors">
          {description}
        </p>

        {/* CTA with magnetic effect */}
        <div className="flex items-center text-cyan-400 text-sm font-medium group-hover:text-teal-400 transition-colors">
          <span className="relative">
            Open Tool
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-400 group-hover:w-full transition-all duration-300" />
          </span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
        </div>

        {/* Shimmer effect */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        {/* Corner accent */}
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-cyan-500/10 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </a>
  )
}
