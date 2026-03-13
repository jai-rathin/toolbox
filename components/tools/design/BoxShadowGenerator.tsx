"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw, Layers } from "lucide-react"

export default function BoxShadowGenerator() {
  const [x, setX] = useState(10)
  const [y, setY] = useState(10)
  const [blur, setBlur] = useState(30)
  const [spread, setSpread] = useState(0)
  const [color, setColor] = useState("#000000")
  const [opacity, setOpacity] = useState(50)
  const [inset, setInset] = useState(false)
  const [copied, setCopied] = useState(false)

  // Convert hex + opacity to rgba
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const rgb = hexToRgb(color)
  const rgbaColor = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity / 100})` : color
  const shadowString = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${rgbaColor}`
  const cssCode = `box-shadow: ${shadowString};\n-webkit-box-shadow: ${shadowString};\n-moz-box-shadow: ${shadowString};`

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const reset = () => {
    setX(10)
    setY(10)
    setBlur(30)
    setSpread(0)
    setColor("#000000")
    setOpacity(50)
    setInset(false)
    setCopied(false)
  }

  return (
    <ToolLayout
      title="Box Shadow Generator"
      description="Design layered CSS box shadows visually and effortlessly generate copyable code."
      category="Design Tools"
      categoryHref="/categories/design-tools"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Controls */}
        <div className="glass p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between mb-2 pb-4 border-b border-white/5">
            <h3 className="text-white font-medium flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Shadow Properties
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} className="rounded text-purple-500 bg-black/20 focus:ring-purple-500/50 focus:ring-offset-0 border-white/10" />
              <span className="text-sm text-gray-300">Inset Shadow</span>
            </label>
          </div>

          {[
            { label: "Horizontal Offset (X)", state: x, set: setX, min: -100, max: 100 },
            { label: "Vertical Offset (Y)", state: y, set: setY, min: -100, max: 100 },
            { label: "Blur Radius", state: blur, set: setBlur, min: 0, max: 150 },
            { label: "Spread", state: spread, set: setSpread, min: -100, max: 100 }
          ].map((slider) => (
            <div key={slider.label} className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{slider.label}</span>
                <span className="text-gray-200 font-mono bg-white/5 px-2 py-0.5 rounded">{slider.state}px</span>
              </div>
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                value={slider.state}
                onChange={(e) => slider.set(parseInt(e.target.value))}
                className="w-full appearance-none bg-black/30 h-2 rounded-full outline-none slider-thumb-purple"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-3">
              <span className="text-sm text-gray-400">Shadow Color</span>
              <div className="flex gap-2 bg-black/20 p-2 rounded-xl border border-white/5">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded shrink-0 bg-transparent border-0 p-0" />
                <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="w-full bg-transparent border-none text-white text-sm font-mono focus:outline-none" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Opacity</span>
                <span className="text-gray-200">{opacity}%</span>
              </div>
              <input
                type="range" min="0" max="100" value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))}
                className="w-full appearance-none bg-black/30 h-2 rounded-full outline-none slider-thumb-purple mt-2"
              />
            </div>
          </div>
        </div>

        {/* Display Area */}
        <div className="flex flex-col gap-6">
          <div className="flex-1 glass rounded-2xl border border-white/10 flex items-center justify-center p-12 min-h-[300px] bg-slate-900 overflow-hidden">
            <div 
              className="w-48 h-48 sm:w-64 sm:h-64 bg-slate-800 rounded-2xl transition-all duration-150 relative border border-white/5"
              style={{ boxShadow: shadowString }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-medium">Preview</div>
            </div>
          </div>

          <div className="relative">
            <pre className="bg-black/40 border border-white/10 p-6 rounded-2xl text-gray-300 font-mono text-sm overflow-x-auto">
              {cssCode}
            </pre>
            <Button onClick={handleCopy} className="absolute top-4 right-4 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md" size="sm">
              {copied ? <span className="text-green-400">Copied!</span> : <span><Copy className="w-4 h-4 mr-2 inline" />Copy</span>}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button onClick={reset} variant="outline" className="border-white/10 text-white hover:bg-white/5 px-8">
          <RefreshCw className="w-4 h-4 mr-2" /> Reset Properties
        </Button>
      </div>
    </ToolLayout>
  )
}
