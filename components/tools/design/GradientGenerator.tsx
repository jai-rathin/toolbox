"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw, Palette } from "lucide-react"

export default function GradientGenerator() {
  const [color1, setColor1] = useState("#06b6d4")
  const [color2, setColor2] = useState("#3b82f6")
  const [angle, setAngle] = useState(90)
  const [copied, setCopied] = useState(false)

  const gradientString = `linear-gradient(${angle}deg, ${color1}, ${color2})`
  const cssCode = `background: ${color1};\nbackground: ${gradientString};`

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const reset = () => {
    setColor1("#06b6d4")
    setColor2("#3b82f6")
    setAngle(90)
    setCopied(false)
  }

  return (
    <ToolLayout
      title="Gradient Generator"
      description="Create beautiful CSS linear gradients and copy the exact code instantly."
      category="Design Tools"
      categoryHref="/categories/design-tools"
    >
      <div className="space-y-8">
        {/* Preview Area */}
        <div 
          className="w-full h-48 md:h-64 rounded-3xl shadow-2xl transition-all duration-300 border border-white/10"
          style={{ background: gradientString }}
        />

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-white font-medium flex items-center gap-2 mb-4">
              <Palette className="w-4 h-4 text-cyan-400" />
              Colors
            </h3>
            
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-16 h-12 rounded-xl cursor-pointer bg-transparent border-0 p-0"
              />
              <input
                type="text"
                value={color1.toUpperCase()}
                onChange={(e) => setColor1(e.target.value)}
                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-16 h-12 rounded-xl cursor-pointer bg-transparent border-0 p-0"
              />
              <input
                type="text"
                value={color2.toUpperCase()}
                onChange={(e) => setColor2(e.target.value)}
                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-4">
              <label className="text-white font-medium">Angle</label>
              <span className="text-cyan-400 font-mono bg-cyan-500/10 px-3 py-1 rounded-lg">{angle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-full appearance-none bg-black/30 h-2 rounded-full outline-none slider-thumb-cyan"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>0°</span>
              <span>180°</span>
              <span>360°</span>
            </div>
          </div>
        </div>

        {/* Output Area */}
        <div className="relative group">
          <pre className="bg-black/40 border border-white/10 p-6 rounded-2xl text-gray-300 font-mono text-sm overflow-x-auto selection:bg-cyan-500/30">
            {cssCode}
          </pre>
          <Button
            onClick={handleCopy}
            className="absolute top-4 right-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md"
            size="sm"
          >
            {copied ? (
              <span className="text-green-400 flex items-center gap-2">Copied!</span>
            ) : (
              <span className="flex items-center gap-2"><Copy className="w-4 h-4" /> Copy CSS</span>
            )}
          </Button>
        </div>

        <div className="flex justify-center pt-4">
          <Button onClick={reset} variant="outline" className="border-white/10 text-white hover:bg-white/5">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Gradient
          </Button>
        </div>
      </div>
    </ToolLayout>
  )
}
