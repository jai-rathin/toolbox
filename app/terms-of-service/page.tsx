import { AnimatedBackground } from "@/components/animated-background"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Scale, FileText, CheckCircle2 } from "lucide-react"

export default function TermsOfServicePage() {
  const lastUpdated = "March 15, 2026"

  return (
    <div className="min-h-screen flex flex-col relative text-white">
      <AnimatedBackground />
      <Header />
      
      <main className="flex-1 pt-32 pb-20 px-6 container mx-auto max-w-4xl">
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-3xl mb-6 border border-teal-500/20 relative z-10">
             <Scale className="w-12 h-12 text-teal-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight relative z-10">Terms of Service</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto relative z-10">
            Please read these terms carefully before accessing or using the ToolBox platform.
          </p>
          <p className="text-sm text-teal-500/80 mt-6 font-medium tracking-wide uppercase relative z-10">Last Updated: {lastUpdated}</p>
        </div>

        <div className="glass p-8 md:p-14 rounded-[2rem] border border-white/10 space-y-12 relative overflow-hidden">
          
          {/* Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-transparent" />

          <div className="space-y-12 text-gray-300 leading-relaxed text-lg relative z-10">
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-teal-400" />
                Acceptance of Terms
              </h2>
              <p>
                By accessing and using the ToolBox website (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service. These terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Use of Tools</h2>
              <p className="mb-4">
                ToolBox provides a collection of free online utilities designed to assist with formatting, development, mathematical calculations, and media conversions.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400 bg-white/5 p-6 rounded-2xl border border-white/5">
                <li>You may use the tools freely for personal, academic, or commercial purposes.</li>
                <li>You may not use the Service in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.</li>
                <li>You must not use the website to copy, store, host, transmit, send, use, publish or distribute any malicious software.</li>
                <li>Automated scraping or programmatic bypassing of our core UI layouts without consent is prohibited.</li>
              </ul>
            </section>

            <section className="bg-rose-500/10 p-8 rounded-2xl border border-rose-500/20">
              <h2 className="text-2xl font-bold text-rose-400 mb-4 flex items-center gap-2">
                Accuracy Disclaimer
              </h2>
              <p className="text-rose-200/90 font-medium mb-4">
                All tools and calculators provided by ToolBox are delivered on an "as is" and "as available" basis.
              </p>
              <p className="text-rose-200/80">
                While we strive to ensure that all algorithms and conversions are accurate, we cannot guarantee 100% precision. You should always manually verify critical results (such as academic grades, loan EMI constraints, or security hash generations) before relying on them for sensitive financial, academic, or administrative decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
              <p>
                The original software scripts, frontend designs, graphics, and structure of ToolBox are owned by Jai Rathin R and are protected by applicable copyright and trademark law. You may not reproduce our website UI design styles or specific operational mechanisms without explicit permission.
              </p>
              <p className="mt-4">
                Users retain full intellectual property rights to any files (PDFs, Images, Videos), data, or text they upload, process, or render through our tools during their temporary local browser sessions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <p>
                In no event shall ToolBox, its founder, or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses directly resulting from your use of the Service. We are not liable for files that may become corrupted during complex local browser conversions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section className="bg-white/5 p-8 rounded-2xl border border-white/5">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                Contact Information
              </h2>
              <p className="text-gray-400">
                If you require clarification on any of the terms outlined above, please direct your questions to:
                <br />
                <a href="mailto:jairathin03@gmail.com" className="text-teal-400 font-semibold hover:text-teal-300 transition-colors mt-4 inline-block">jairathin03@gmail.com</a>
              </p>
            </section>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
