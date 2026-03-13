"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])

  return [ref, isVisible]
}

// Hook for staggered children animations
export function useStaggeredReveal(
  isVisible: boolean,
  itemCount: number,
  baseDelay: number = 0,
  staggerDelay: number = 0.1
): number[] {
  return Array.from({ length: itemCount }, (_, i) => baseDelay + i * staggerDelay)
}

// Hook for parallax scrolling
export function useParallax(speed: number = 0.5): number {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * speed)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return offset
}

// Hook for mouse parallax effect
export function useMouseParallax(intensity: number = 0.02): { x: number; y: number } {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) * intensity
      const y = (e.clientY - window.innerHeight / 2) * intensity
      setPosition({ x, y })
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [intensity])

  return position
}
