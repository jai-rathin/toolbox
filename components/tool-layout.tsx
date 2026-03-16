"use client"

import { type ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, Home, Share2, Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedBackground } from "./animated-background"
import { Header } from "./header"
import { Footer } from "./footer"

interface ToolLayoutProps {
  children: ReactNode
  title: string
  description: string
  category: string
  categoryHref: string
}

export function ToolLayout({ 
  children, 
  title, 
  description, 
  category,
  categoryHref 
}: ToolLayoutProps) {
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
            <Link href={categoryHref} className="hover:text-white transition-colors">
              {category}
            </Link>
            <span>/</span>
            <span className="text-cyan-400">{title}</span>
          </nav>

          {/* Tool Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight">{title}</h1>
                <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                  Free
                </span>
              </div>
              <p className="text-gray-400 max-w-2xl">{description}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
              >
                <Star className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Tool Content */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 rounded-3xl blur-3xl" />
            <div className="relative glass-glow rounded-3xl p-4 sm:p-8">
              {children}
            </div>
          </div>

          {/* Back button */}
          <div className="mt-8">
            <Link
              href={categoryHref}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {category}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
