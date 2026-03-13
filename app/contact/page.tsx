"use client"

import { AnimatedBackground } from "@/components/animated-background"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Linkedin, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col relative text-white">
      <AnimatedBackground />
      <Header />
      
      <main className="flex-1 pt-32 pb-20 px-6 container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Have feedback, suggestions, or tool requests? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-8 md:p-10 rounded-3xl border border-white/10 hover:border-cyan-500/30 transition-all h-full flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-8 text-white">Get In Touch</h3>
              
              <div className="space-y-8">
                <a 
                  href="mailto:jairathin03@gmail.com"
                  className="flex items-start gap-4 group hover:bg-white/5 p-4 -ml-4 rounded-2xl transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                    <Mail className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Email <span className="text-xs ml-2 text-cyan-500">(Preferred)</span></p>
                    <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">jairathin03@gmail.com</p>
                  </div>
                </a>

                <a 
                  href="http://linkedin.com/in/jai-rathin-0ab542329"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group hover:bg-white/5 p-4 -ml-4 rounded-2xl transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                    <Linkedin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">LinkedIn</p>
                    <p className="text-white font-medium group-hover:text-blue-400 transition-colors break-all">linkedin.com/in/jai-rathin-0ab542329</p>
                  </div>
                </a>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <h4 className="font-medium text-gray-300 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal-400" /> Why contact us?
                </h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-center gap-2">• Report a bug or error</li>
                  <li className="flex items-center gap-2">• Request a new specific tool</li>
                  <li className="flex items-center gap-2">• Collaborate or provide feedback</li>
                  <li className="flex items-center gap-2">• Say hello!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="glass p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden h-full">
              <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
              
              <h3 className="text-2xl font-semibold mb-2 relative">Send a Message</h3>
              <p className="text-gray-400 mb-8 relative text-sm">We will get back to you as soon as possible.</p>

              <form className="space-y-6 relative" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-300">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="John Doe"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="john@example.com"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
                  <textarea 
                    id="message" 
                    rows={6}
                    placeholder="How can we help you today?"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  ></textarea>
                </div>

                <Button className="w-full py-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
                  <Send className="w-4 h-4" /> Send Message
                </Button>
                
                <p className="text-center text-xs text-gray-500 mt-4">
                  * Note: Form submission is currently a demonstration UI. Please email directly.
                </p>
              </form>
            </div>
          </div>
        </div>

      </main>
      
      <Footer />
    </div>
  )
}
