"use client"

import Link from "next/link"
import { Zap, Sparkles, Github, Twitter, Instagram, Heart } from "lucide-react"

const footerLinks = {
  tools: [
    { label: "Text Tools", href: "/tools?category=text" },
    { label: "Developer Tools", href: "/tools?category=dev" },
    { label: "Utility Tools", href: "/tools?category=utility" },
    { label: "All Tools", href: "/tools" },
  ],
  resources: [
    { label: "All Tools", href: "/tools" },
    { label: "Blog", href: "/blog" },
    { label: "Tutorials", href: "/tutorials" },
    { label: "FAQ", href: "/faq" },
    { label: "Changelog", href: "/changelog" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
]

export function Footer() {
  return (
    <footer id="about" className="relative pt-20 pb-8 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-teal-500/5 to-transparent" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-r from-teal-500 to-cyan-500 p-2 rounded-xl">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold">
                <span className="gradient-text">Tool</span>
                <span className="text-white">Box</span>
              </span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </Link>
            
            <p className="text-gray-400 mb-6 max-w-sm">
              ToolBox provides 50+ free online tools. Built for students, developers, and everyday productivity. Tools run directly in the browser for speed and privacy. No signup required.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all group"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tools</h3>
            <ul className="space-y-3">
              {footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 hover:pl-1 transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 hover:pl-1 transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 hover:pl-1 transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 text-center sm:text-left">
          <p className="text-gray-500 text-sm flex items-center justify-center sm:justify-start gap-1">
            &copy; {new Date().getFullYear()} ToolBox. Made with{" "}
            <Heart className="w-4 h-4 text-cyan-500 fill-cyan-500 inline animate-pulse" />{" "}
            for students.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
