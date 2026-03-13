"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw, Maximize } from "lucide-react"

export default function CssBorderRadius() {
  const [tl, setTl] = useState(20)
  const [tr, setTr] = useState(20)
  const [bl, setBl] = useState(20)
  const [br, setBr] = useState(20)
  const [copied, setCopied] = useState(false)
  const [linkAll, setLinkAll] = useState(true)

  const handleSlider = (val: number, setter: (v: number) => void) => {
    setter(val)
    if (linkAll) {
      setTl(val); setTr(val); setBl(val); setBr(val)
    }
  }

  const radiusString = linkAll 
    ? `${tl}px` 
    : `${tl}px ${tr}px ${br}px ${bl}px`
    
  const cssCode = `border-radius: ${radiusString};\n-webkit-border-radius: ${radiusString};\n-moz-border-radius: ${radiusString};`

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const reset = () => {
    setTl(20); setTr(20); setBl(20); setBr(20)
    setCopied(false)
    setLinkAll(true)
  }

  return (
    <ToolLayout
      title="CSS Border Radius Builder"
      description="Visually generate perfect border-radius shapes and quickly copy the boilerplate."
      category="Design Tools"
      categoryHref="/categories/design-tools"
    >
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center p-8 glass rounded-2xl border border-white/10">
          
          <div className="relative w-full max-w-sm flex items-center justify-center group h-64 md:h-80 pattern-dots">
            {/* Visualizer output block */}
            <div 
              className="w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-tr from-rose-500 to-pink-500 shadow-xl transition-all duration-300 flex items-center justify-center"
              style={{ borderRadius: radiusString }}
            >
              <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md text-white font-mono text-sm border border-white/20">
                {radiusString}
              </div>
            </div>
          </div>

          <div className="w-full flex-1 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-medium flex items-center gap-2">
                <Maximize className="w-4 h-4 text-pink-400" />
                Radius Corners
              </h3>
              <label className="flex items-center gap-2 cursor-pointer bg-white/5 py-1.5 px-3 rounded-lg hover:bg-white/10 transition-colors">
                <input type="checkbox" checked={linkAll} onChange={(e) => setLinkAll(e.target.checked)} className="rounded text-pink-500 focus:ring-pink-500/50 bg-black/20" />
                <span className="text-sm text-gray-300">Link Common Curve</span>
              </label>
            </div>

            {[
              { label: "Top Left", state: tl, set: setTl },
              { label: "Top Right", state: tr, set: setTr },
              { label: "Bottom Right", state: br, set: setBr },
              { label: "Bottom Left", state: bl, set: setBl }
            ].map((corner, i) => (
              <div key={corner.label} className={`space-y-3 ${linkAll && i > 0 ? "opacity-30 pointer-events-none" : ""}`}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{corner.label}</span>
                  <span className="text-gray-200 font-mono bg-white/5 px-2 py-0.5 rounded w-12 text-center">{corner.state}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={corner.state}
                  onChange={(e) => handleSlider(parseInt(e.target.value), corner.set)}
                  className="w-full appearance-none bg-black/30 h-2 rounded-full outline-none slider-thumb-pink"
                />
              </div>
            ))}
          </div>

        </div>

        {/* Output */}
        <div className="relative">
          <pre className="bg-black/40 border border-white/10 p-6 rounded-2xl text-gray-300 font-mono text-sm overflow-x-auto selection:bg-pink-500/30">
            {cssCode}
          </pre>
          <Button onClick={handleCopy} className="absolute top-4 right-4 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md" size="sm">
            {copied ? <span className="text-green-400">Copied!</span> : <span><Copy className="w-4 h-4 mr-2 inline" /> Copy CSS</span>}
          </Button>
        </div>

        <div className="flex justify-center">
          <Button onClick={reset} variant="outline" className="border-white/10 text-white hover:bg-white/5">
            <RefreshCw className="w-4 h-4 mr-2" /> Reset Shape
          </Button>
        </div>
      </div>
    </ToolLayout>
  )
}
