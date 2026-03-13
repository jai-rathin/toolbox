"use client"

import { useEffect, useState, useMemo } from "react"

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Generate stable random positions for particles
  const particles = useMemo(() => 
    [...Array(35)].map((_, i) => ({
      id: i,
      left: `${(i * 37 + 13) % 100}%`,
      top: `${(i * 23 + 7) % 100}%`,
      delay: `${(i * 0.3) % 5}s`,
      duration: `${5 + (i % 5)}s`,
      size: i % 3 === 0 ? 'w-1.5 h-1.5' : i % 3 === 1 ? 'w-1 h-1' : 'w-2 h-2',
      color: i % 4 === 0 ? 'bg-cyan-400/50' : i % 4 === 1 ? 'bg-teal-400/40' : i % 4 === 2 ? 'bg-blue-400/45' : 'bg-sky-400/35'
    })), [])

  // Generate floating geometric shapes
  const shapes = useMemo(() => [
    { type: 'circle', size: 'w-32 h-32', left: '10%', top: '20%', delay: '0s', color: 'border-cyan-500/20' },
    { type: 'square', size: 'w-24 h-24', left: '80%', top: '15%', delay: '2s', color: 'border-teal-500/15', rotate: 'rotate-45' },
    { type: 'circle', size: 'w-20 h-20', left: '70%', top: '70%', delay: '4s', color: 'border-blue-500/20' },
    { type: 'hexagon', size: 'w-28 h-28', left: '15%', top: '75%', delay: '1s', color: 'border-sky-500/15' },
    { type: 'triangle', size: 'w-16 h-16', left: '90%', top: '45%', delay: '3s', color: 'border-cyan-500/10' },
    { type: 'square', size: 'w-12 h-12', left: '5%', top: '50%', delay: '5s', color: 'border-teal-500/20', rotate: 'rotate-12' },
  ], [])

  if (!mounted) return <div className="fixed inset-0 -z-10 bg-[#030712]" />

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Deep dark base */}
      <div className="absolute inset-0 bg-[#030712]" />
      
      {/* Aurora gradient layers with animation */}
      <div 
        className="absolute inset-0 opacity-70"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at ${mousePosition.x}% ${mousePosition.y}%, rgba(20, 184, 166, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at ${100 - mousePosition.x}% ${mousePosition.y}%, rgba(34, 211, 238, 0.12) 0%, transparent 45%),
            radial-gradient(ellipse 70% 60% at ${mousePosition.x * 0.7}% ${100 - mousePosition.y}%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
          `
        }}
      />

      {/* Animated aurora waves */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-0 left-0 right-0 h-[60vh] opacity-30 animate-aurora"
          style={{
            background: 'linear-gradient(180deg, rgba(20, 184, 166, 0.2) 0%, rgba(34, 211, 238, 0.15) 30%, rgba(59, 130, 246, 0.1) 60%, transparent 100%)',
            backgroundSize: '200% 200%',
          }}
        />
      </div>
      
      {/* Floating aurora blobs */}
      <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[120px] animate-blob" />
      <div className="absolute top-[40%] right-[15%] w-[400px] h-[400px] bg-cyan-500/12 rounded-full blur-[100px] animate-blob-delay" />
      <div className="absolute bottom-[20%] left-[30%] w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[110px] animate-blob" style={{ animationDelay: '7s' }} />
      <div className="absolute top-[60%] right-[35%] w-[350px] h-[350px] bg-sky-500/10 rounded-full blur-[90px] animate-blob-delay" style={{ animationDelay: '3s' }} />
      
      {/* Subtle animated gradient mesh */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.6) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating geometric shapes */}
      {shapes.map((shape, i) => (
        <div
          key={i}
          className={`absolute ${shape.size} border ${shape.color} ${shape.rotate || ''} animate-float opacity-60`}
          style={{
            left: shape.left,
            top: shape.top,
            animationDelay: shape.delay,
            borderRadius: shape.type === 'circle' ? '50%' : shape.type === 'hexagon' ? '20%' : '8px',
          }}
        />
      ))}

      {/* Glowing orbs */}
      <div className="absolute top-[30%] left-[10%] w-3 h-3 bg-cyan-400 rounded-full blur-sm animate-pulse-glow opacity-60" />
      <div className="absolute top-[20%] right-[25%] w-2 h-2 bg-teal-400 rounded-full blur-sm animate-pulse-glow opacity-50" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-[35%] right-[15%] w-4 h-4 bg-blue-400 rounded-full blur-sm animate-pulse-glow opacity-40" style={{ animationDelay: '2s' }} />
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute ${particle.size} ${particle.color} rounded-full animate-float`}
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}

      {/* Diagonal light streaks */}
      <div className="absolute top-0 left-[20%] w-[1px] h-[40%] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent rotate-[15deg] animate-pulse opacity-40" />
      <div className="absolute top-[10%] right-[30%] w-[1px] h-[30%] bg-gradient-to-b from-transparent via-teal-500/15 to-transparent rotate-[-20deg] animate-pulse opacity-30" style={{ animationDelay: '2s' }} />
      
      {/* Vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(3, 7, 18, 0.4) 100%)'
        }}
      />
    </div>
  )
}
