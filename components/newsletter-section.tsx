"use client"

import { useState, useRef, useEffect } from "react"
import { Mail, Sparkles, Send, CheckCircle2, Zap, Bell, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [sectionRef, isVisible] = useScrollReveal<HTMLElement>({ threshold: 0.2 })
  const cardRef = useRef<HTMLDivElement>(null)

  // Spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        cardRef.current.style.setProperty('--mouse-x', `${x}%`)
        cardRef.current.style.setProperty('--mouse-y', `${y}%`)
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => {
        setIsSubscribed(false)
        setEmail("")
      }, 3000)
    }
  }

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className={`relative max-w-4xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur-3xl animate-pulse-glow" />
          
          {/* Card */}
          <div 
            ref={cardRef}
            className="relative glass-glow rounded-3xl p-8 sm:p-12 overflow-hidden spotlight"
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 animate-gradient" style={{ backgroundSize: '200% 200%' }}>
              <div className="absolute inset-[1px] bg-[#030712]/95 rounded-3xl" />
            </div>

            {/* Floating elements with animation */}
            <div className="absolute top-4 right-4 w-20 h-20 border border-cyan-500/20 rounded-full animate-morph" />
            <div className="absolute bottom-4 left-4 w-16 h-16 border border-teal-500/20 rounded-2xl rotate-12 animate-card-tilt" />
            <div className="absolute top-1/2 right-8 w-3 h-3 bg-cyan-400/30 rounded-full animate-bounce-subtle" />
            <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-teal-400/30 rounded-full animate-float" />

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Icon with pulse */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 mb-6 shadow-lg shadow-cyan-500/30 animate-scale-pulse hover-lift">
                <Mail className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Stay Updated with{" "}
                <span className="text-gradient-animate">New Tools</span>
              </h2>
              
              <p className="text-gray-400 max-w-xl mx-auto mb-8">
                Get notified when we launch new tools, features, and student tips. 
                No spam, just useful stuff delivered to your inbox.
              </p>

              {/* Form with animations */}
              {!isSubscribed ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <div className={`relative flex-1 transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-cyan-400' : 'text-gray-500'}`} />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      required
                      className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300 ${
                        isFocused 
                          ? 'border-cyan-500 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/10' 
                          : 'border-cyan-500/20 hover:border-cyan-500/40'
                      }`}
                    />
                    {/* Typing indicator */}
                    {email && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="w-5 h-5 text-teal-400 animate-scale-in" />
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="btn-glow bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 rounded-xl px-8 py-4 h-auto group shadow-lg shadow-cyan-500/25 hover-lift"
                  >
                    <span className="mr-2">Subscribe</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-3 text-teal-400 animate-scale-in">
                  <div className="relative">
                    <CheckCircle2 className="w-8 h-8" />
                    <span className="absolute inset-0 bg-teal-400 rounded-full animate-ping opacity-50" />
                  </div>
                  <span className="text-lg font-medium">You&apos;re subscribed! Check your inbox.</span>
                </div>
              )}

              {/* Trust badges with hover effects */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-500">
                {[
                  { icon: Bell, label: "Weekly Updates", color: "text-teal-400" },
                  { icon: Zap, label: "No Spam", color: "text-cyan-400" },
                  { icon: Gift, label: "Unsubscribe Anytime", color: "text-blue-400" },
                ].map((badge, i) => {
                  const Icon = badge.icon
                  return (
                    <div 
                      key={badge.label}
                      className="flex items-center gap-2 group cursor-default hover:text-gray-400 transition-colors"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <Icon className={`w-4 h-4 ${badge.color} group-hover:animate-bounce-subtle`} />
                      <span>{badge.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 translate-x-[-100%] animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" style={{ animationDuration: '4s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
