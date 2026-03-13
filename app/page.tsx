import { AnimatedBackground } from "@/components/animated-background"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CategorySection } from "@/components/category-section"
import { ToolsGrid } from "@/components/tools-grid"
import { TrendingCarousel } from "@/components/trending-carousel"
import { NewsletterSection } from "@/components/newsletter-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen relative">
      <AnimatedBackground />
      <Header />
      <HeroSection />
      <CategorySection />
      <ToolsGrid />
      <TrendingCarousel />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
