"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { ArrowRightLeft, RefreshCw } from "lucide-react"

export default function GpaToPercentage() {
  const [gpa, setGpa] = useState("")
  const [multiplier, setMultiplier] = useState("9.5") // standard for India (CBSE/AICTE)
  const [result, setResult] = useState<number | null>(null)

  const calculate = () => {
    const val = parseFloat(gpa)
    const mult = parseFloat(multiplier)
    if (!isNaN(val) && !isNaN(mult)) {
      setResult(Math.min(val * mult, 100))
    }
  }

  return (
    <ToolLayout
      title="GPA to Percentage"
      description="Convert your GPA (like 10-point scales) to a percentage standard used by universities and employers."
      category="Calculators"
      categoryHref="/tools?category=calculators"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Your GPA</label>
            <input
              type="number"
              step="0.01"
              max="10"
              placeholder="e.g., 8.5"
              value={gpa}
              onChange={(e) => {
                setGpa(e.target.value)
                setResult(null)
              }}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Multiplier Formula</label>
            <select
              value={multiplier}
              onChange={(e) => {
                setMultiplier(e.target.value)
                setResult(null)
              }}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="9.5">Multiply by 9.5 (Standard India/CBSE)</option>
              <option value="10">Multiply by 10 (Direct Base 10)</option>
              <option value="25">Multiply by 25 (US 4.0 Scale to 100)</option>
            </select>
          </div>
        </div>

        {result !== null && (
          <div className="glass p-8 rounded-2xl border border-purple-500/30 text-center animate-scale-in">
            <h3 className="text-gray-400 font-medium mb-2">Equivalent Percentage</h3>
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              {result.toFixed(2)}%
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button 
            onClick={() => { setGpa(""); setResult(null); }} 
            variant="outline" 
            className="flex-1 bg-black/20 border-white/10 text-white rounded-xl py-6 hover:bg-white/5"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={calculate} 
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl py-6 border-0 shadow-lg shadow-purple-500/20 hover:from-purple-600 hover:to-pink-600"
          >
            <ArrowRightLeft className="w-5 h-5 mr-2" />
            Convert
          </Button>
        </div>
      </div>
    </ToolLayout>
  )
}
