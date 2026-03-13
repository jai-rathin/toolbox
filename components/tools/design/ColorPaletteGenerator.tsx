"use client"

import { useState, useEffect } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw, Palette } from "lucide-react"

export default function ColorPaletteGenerator() {
  const [palette, setPalette] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  const generateHex = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  }

  // Generate 5 harmonious random colors or completely random ones
  const generatePalette = () => {
    const baseHue = Math.floor(Math.random() * 360)
    const newPalette = Array.from({ length: 5 }, (_, i) => {
      // Create variations in lightness and saturation for a nice palette
      const hueOffset = (baseHue + (i * 30)) % 360
      return `hsl(${hueOffset}, ${70 + Math.random() * 20}%, ${40 + Math.random() * 40}%)`
    })

    // Helper to convert HSL logic string above down to exact HEX (approximated for simple usage here via DOM standard)
    const tempEl = document.createElement("div")
    const resolvedHexes = newPalette.map(hslStr => {
      tempEl.style.color = hslStr
      document.body.appendChild(tempEl)
      const rgbStr = getComputedStyle(tempEl).color
      document.body.removeChild(tempEl)
      
      const rgbMatches = rgbStr.match(/\d+/g)
      if (rgbMatches) {
        return "#" + rgbMatches.map(x => parseInt(x).toString(16).padStart(2, '0')).join('')
      }
      return generateHex()
    })

    setPalette(resolvedHexes)
  }

  useEffect(() => {
    generatePalette()
  }, [])

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex.toUpperCase())
    setCopied(hex)
    setTimeout(() => setCopied(null), 1500)
  }

  const copyAll = () => {
    navigator.clipboard.writeText(palette.map(h => h.toUpperCase()).join(", "))
    setCopied("all")
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <ToolLayout
      title="Color Palette Generator"
      description="Press spacebar or generate to instantly create beautiful five-color harmonious palettes for your designs."
      category="Design Tools"
      categoryHref="/categories/design-tools"
    >
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row h-96 lg:h-80 w-full rounded-2xl overflow-hidden shadow-2xl shadow-black border border-white/5">
          {palette.map((color, idx) => (
            <div 
              key={idx}
              className="flex-1 flex flex-col justify-end items-center p-6 transition-all duration-300 hover:flex-[1.5] group cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => copyToClipboard(color)}
            >
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur px-4 py-2 rounded-xl text-white font-mono tracking-widest flex items-center gap-2 mb-4 hover:bg-black/60 shadow-lg">
                {copied === color ? <span className="text-green-400 text-sm">Copied!</span> : color.toUpperCase()}
                {copied !== color && <Copy className="w-3 h-3" />}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={generatePalette} 
            className="w-full sm:w-auto px-8 py-6 rounded-xl bg-white text-black hover:bg-gray-200 font-semibold shadow-xl"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Random
          </Button>

          <Button 
            onClick={copyAll} 
            variant="outline"
            className="w-full sm:w-auto px-8 py-6 rounded-xl bg-black/20 border-white/10 text-white hover:bg-white/5"
          >
            {copied === "all" ? <span className="text-green-400">Copied Array!</span> : <><Copy className="w-4 h-4 mr-2" /> Copy All</>}
          </Button>
        </div>

      </div>
    </ToolLayout>
  )
}
