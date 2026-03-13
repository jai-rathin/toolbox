import { AnimatedBackground } from "@/components/animated-background"
import { Header } from "@/components/header"
import { CategorySection } from "@/components/category-section"
import { Footer } from "@/components/footer"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Header />
      <main className="pt-28 pb-20">
        <CategorySection />
      </main>
      <Footer />
    </div>
  )
}
