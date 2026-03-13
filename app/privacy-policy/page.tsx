import { AnimatedBackground } from "@/components/animated-background"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShieldCheck, Lock, EyeOff, Zap, ServerOff, Cookie } from "lucide-react"

export default function PrivacyPolicyPage() {
  const lastUpdated = "March 15, 2026"

  return (
    <div className="min-h-screen flex flex-col relative text-white">
      <AnimatedBackground />
      <Header />
      
      <main className="flex-1 pt-32 pb-20 px-6 container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-3xl mb-6 border border-cyan-500/20">
             <ShieldCheck className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Privacy Policy</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your privacy is our priority. ToolBox is built to process your digital tasks locally and securely.
          </p>
          <p className="text-sm text-cyan-500/80 mt-6 font-medium tracking-wide uppercase">Last Updated: {lastUpdated}</p>
        </div>

        <div className="glass p-8 md:p-14 rounded-[2rem] border border-white/10 space-y-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Quick Summary Grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-16 relative z-10">
            {[
              { icon: EyeOff, title: "No Accounts", desc: "ToolBox does not require user accounts.", color: "text-rose-400", bg: "bg-rose-500/10" },
              { icon: Zap, title: "Browser execution", desc: "Most tools run locally directly in your browser.", color: "text-amber-400", bg: "bg-amber-500/10" },
              { icon: ServerOff, title: "No Server Storage", desc: "Uploaded files are not permanently stored.", color: "text-teal-400", bg: "bg-teal-500/10" },
              { icon: Cookie, title: "Minimal Tracking", desc: "Cookies used only for essential functionality.", color: "text-blue-400", bg: "bg-blue-500/10" }
            ].map((stat, i) => {
               const Icon = stat.icon
               return (
                 <div key={i} className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                   <div className={`p-3 rounded-xl ${stat.bg}`}>
                     <Icon className={`w-5 h-5 ${stat.color}`} />
                   </div>
                   <div>
                     <h4 className="font-semibold text-white mb-1">{stat.title}</h4>
                     <p className="text-sm text-gray-400 leading-snug">{stat.desc}</p>
                   </div>
                 </div>
               )
            })}
          </div>

          <div className="space-y-12 text-gray-300 leading-relaxed text-lg relative z-10">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
              <p className="mb-4">Because ToolBox operates heavily on client-side rendering architecture, we limit data collection exclusively to non-identifying metrics required to keep the website running.</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li>We do not collect names, usernames, or passwords.</li>
                <li>We do not extract metadata from the files you upload into our PDF or Image manipulation tools.</li>
                <li>If you contact us directly via email, we collect your email address only to process your inquiry.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">How We Use Information</h2>
              <p>
                Any anonymous analytical data we collect is utilized strictly to improve the ToolBox platform. Analytics may be used to identify which tools are struggling to render or which categories are most popular, allowing us to focus development efforts on features you actually want.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Cookies</h2>
              <p>
                ToolBox uses standard, minimal cookies necessary for basic functionality (like remembering theme preferences). We may deploy secure third-party tracking cookies (such as basic traffic analytics) to understand broad geographical audience metrics, but we do not track individuals across the internet.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
              <p>
                We may employ third-party companies and individuals to facilitate our Service (e.g., Vercel for website hosting). These third parties have access to minimal background network data exclusively to perform routing tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
              <p>
                We value your trust. All connections to ToolBox are securely encrypted (HTTPS). Furthermore, processing your media locally in the browser immediately bypasses the most common vulnerability vector: remote server uploads. Your data remains perfectly safe inside your own computer's memory.
              </p>
            </section>

            <section className="bg-gradient-to-r from-teal-500/10 to-transparent p-8 rounded-2xl border-l-4 border-teal-500">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <p>
                If you have any questions or suggestions about our Privacy Policy, please contact the developer at:
                <br />
                <a href="mailto:jairathin03@gmail.com" className="text-teal-400 font-semibold hover:text-teal-300 transition-colors mt-2 inline-block">jairathin03@gmail.com</a>
              </p>
            </section>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  )
}
