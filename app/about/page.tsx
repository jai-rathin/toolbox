import { AnimatedBackground } from "@/components/animated-background"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Zap, Sparkles, User, GraduationCap, MapPin, Code, Rocket, Clock, ShieldCheck, Globe, Type, Hash, FileText, ImageIcon } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col relative text-white">
      <AnimatedBackground />
      <Header />
      
      <main className="flex-1 pt-32 pb-20 px-6 container mx-auto max-w-6xl">
        
        {/* SECTION 1 - HERO */}
        <section className="text-center mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">Tool</span>Box
          </h1>
          <h2 className="text-2xl md:text-3xl text-gray-300 font-medium mb-8 max-w-3xl mx-auto leading-relaxed">
            A growing collection of free online tools designed to help students, developers, and everyday users complete digital tasks faster and more efficiently.
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            ToolBox is a free web platform that provides dozens of practical tools in one place. From text utilities and developer tools to calculators, media tools, and image tools, the goal is to simplify everyday digital workflows.
          </p>
        </section>

        {/* SECTION 2 - MISSION */}
        <section className="mb-24">
          <div className="glass p-10 md:p-14 rounded-[2rem] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <div className="max-w-3xl relative z-10">
              <h3 className="text-4xl font-bold mb-6 flex items-center gap-3">
                <Rocket className="w-10 h-10 text-cyan-400" />
                Our Mission
              </h3>
              <p className="text-xl text-gray-300 leading-relaxed mb-10">
                The mission of ToolBox is to create a simple, reliable platform where anyone can access useful tools instantly without installing software or creating accounts.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center border border-teal-500/20">
                    <Clock className="w-6 h-6 text-teal-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white">Speed</h4>
                  <p className="text-gray-400">Tools run directly in your browser, bypassing slow network uploads for instant results.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/20">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white">Simplicity</h4>
                  <p className="text-gray-400">Clean, intuitive, and easy-to-use interfaces that require absolutely zero learning curve.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
                    <Globe className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white">Accessibility</h4>
                  <p className="text-gray-400">100% free tools available to everyone on any device, anywhere in the world.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 - WHAT TOOLBOX OFFERS */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-5xl font-bold mb-6">What ToolBox Offers</h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              These tools are designed to help with everyday tasks like formatting data, converting files, calculating grades, editing images, and more.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: "Text Tools", icon: Type, color: "text-cyan-400", bg: "bg-cyan-500/10" },
              { label: "Developer Tools", icon: Code, color: "text-teal-400", bg: "bg-teal-500/10" },
              { label: "Image Tools", icon: ImageIcon, color: "text-pink-400", bg: "bg-pink-500/10" },
              { label: "Calculator Tools", icon: Hash, color: "text-blue-400", bg: "bg-blue-500/10" },
              { label: "PDF Tools", icon: FileText, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Media Tools", icon: Hash, color: "text-purple-400", bg: "bg-purple-500/10" },
              { label: "Design Tools", icon: ImageIcon, color: "text-rose-400", bg: "bg-rose-500/10" },
              { label: "Security Tools", icon: Code, color: "text-sky-400", bg: "bg-sky-500/10" }
            ].map((cat) => {
               const Icon = cat.icon
               return (
                 <div key={cat.label} className="glass p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-colors group">
                    <div className={`w-14 h-14 rounded-full ${cat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${cat.color}`} />
                    </div>
                    <span className="font-medium text-gray-200 text-center">{cat.label}</span>
                 </div>
               )
            })}
          </div>
        </section>

        {/* SECTION 4 - BUILT FOR STUDENTS & DEVELOPERS */}
        <section className="mb-24 relative py-20 overflow-hidden rounded-[2rem] border border-cyan-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/40 to-cyan-900/40" />
          <div className="absolute inset-0 pattern-dots opacity-30" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-10 text-center">
            <h3 className="text-3xl md:text-5xl font-bold mb-8">Built for Students & Developers</h3>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto space-y-4">
              <span className="block mb-6">ToolBox is especially useful for students and developers who frequently need quick tools for assignments, projects, and everyday productivity tasks.</span>
              <span className="block font-medium text-white text-2xl">Instead of searching multiple websites, users can access everything from one platform.</span>
            </p>
          </div>
        </section>

        {/* SECTION 5 - CREATOR */}
        <section className="mb-24">
          <div className="glass p-10 md:p-14 rounded-[2rem] border border-white/10 relative overflow-hidden">
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
              <div className="w-full md:w-1/3 flex flex-col items-center text-center space-y-4">
                <div className="w-40 h-40 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 p-1">
                  <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border-4 border-black">
                    <User className="w-16 h-16 text-cyan-400" />
                  </div>
                </div>
                <div>
                   <h3 className="text-3xl font-bold text-white mb-2">Jai Rathin R</h3>
                   <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-semibold tracking-wide border border-cyan-500/20">
                     Creator & Developer
                   </span>
                </div>
              </div>
              
              <div className="w-full md:w-2/3 space-y-8">
                <h3 className="text-3xl font-bold text-white hidden md:block">Meet the Creator</h3>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Jai Rathin is a 3rd year college student at SRM Institute of Science and Technology (SRM KTR) who built ToolBox as a platform to make useful tools easily accessible online.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <a href="mailto:jairathin03@gmail.com" className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-colors group">
                     <div className="bg-cyan-500/10 p-2.5 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                       <MapPin className="w-5 h-5 text-cyan-400 hidden" />
                       <User className="w-5 h-5 text-cyan-400" />
                     </div>
                     <div className="text-left">
                       <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email</p>
                       <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">jairathin03@gmail.com</p>
                     </div>
                  </a>
                  <a href="http://linkedin.com/in/jai-rathin-0ab542329" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors group">
                     <div className="bg-blue-500/10 p-2.5 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                       <Code className="w-5 h-5 text-blue-400 hidden" />
                       <User className="w-5 h-5 text-blue-400" />
                     </div>
                     <div className="text-left">
                       <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">LinkedIn</p>
                       <p className="text-white font-medium group-hover:text-blue-400 transition-colors overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px] sm:max-w-[180px]">jai-rathin-0ab542329</p>
                     </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6 - FUTURE VISION */}
        <section className="text-center max-w-4xl mx-auto py-12">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-3xl mb-8 border border-cyan-500/20">
            <Sparkles className="w-12 h-12 text-cyan-400" />
          </div>
          <h3 className="text-4xl font-bold mb-6">Looking Ahead</h3>
          <p className="text-xl text-gray-300 leading-relaxed mb-12">
            ToolBox will continue to grow with more tools, improved features, and better user experiences. The goal is to build a comprehensive toolbox for digital productivity.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {["More advanced utilities", "AI-powered tools", "Faster processing", "Expanded tool categories"].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl text-cyan-300 font-medium text-sm flex items-center justify-center text-center h-20 shadow-inner">
                   {item}
                </div>
             ))}
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  )
}
