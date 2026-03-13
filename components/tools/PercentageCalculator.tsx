"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

export default function PercentageCalculator() {
  const [val1, setVal1] = useState("15")
  const [val1Base, setVal1Base] = useState("150")

  const [val2, setVal2] = useState("30")
  const [val2Base, setVal2Base] = useState("150")

  const [val3From, setVal3From] = useState("100")
  const [val3To, setVal3To] = useState("150")

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* What is X% of Y? */}
      <Card className="glass rounded-3xl border-white/10 p-6 space-y-4">
        <h3 className="text-lg font-medium text-white mb-2">What is X% of Y?</h3>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-gray-400">What is</span>
          <Input 
            type="number" 
            value={val1} 
            onChange={e => setVal1(e.target.value)}
            className="w-24 bg-white/5 border-white/10 text-white rounded-lg h-10"
          />
          <span className="text-gray-400">% of</span>
          <Input 
            type="number" 
            value={val1Base} 
            onChange={e => setVal1Base(e.target.value)}
            className="w-32 bg-white/5 border-white/10 text-white rounded-lg h-10"
          />
          <span className="text-gray-400">=</span>
          <div className="bg-black/30 border border-white/10 rounded-lg px-4 h-10 flex items-center min-w-[100px] text-cyan-300 font-mono font-bold">
            {(!isNaN(parseFloat(val1)) && !isNaN(parseFloat(val1Base))) 
              ? parseFloat(((parseFloat(val1) / 100) * parseFloat(val1Base)).toFixed(4)) 
              : "0"}
          </div>
        </div>
      </Card>

      {/* X is what % of Y? */}
      <Card className="glass rounded-3xl border-white/10 p-6 space-y-4">
        <h3 className="text-lg font-medium text-white mb-2">X is what percent of Y?</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Input 
            type="number" 
            value={val2} 
            onChange={e => setVal2(e.target.value)}
            className="w-32 bg-white/5 border-white/10 text-white rounded-lg h-10"
          />
          <span className="text-gray-400">is what % of</span>
          <Input 
            type="number" 
            value={val2Base} 
            onChange={e => setVal2Base(e.target.value)}
            className="w-32 bg-white/5 border-white/10 text-white rounded-lg h-10"
          />
          <span className="text-gray-400">=</span>
          <div className="bg-black/30 border border-white/10 rounded-lg px-4 h-10 flex items-center min-w-[100px] text-cyan-300 font-mono font-bold">
            {(!isNaN(parseFloat(val2)) && !isNaN(parseFloat(val2Base)) && parseFloat(val2Base) !== 0) 
              ? parseFloat(((parseFloat(val2) / parseFloat(val2Base)) * 100).toFixed(4)) + "%"
              : "0%"}
          </div>
        </div>
      </Card>

      {/* Percentage change */ }
      <Card className="glass rounded-3xl border-white/10 p-6 space-y-4">
        <h3 className="text-lg font-medium text-white mb-2">Percentage increase/decrease</h3>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-gray-400">Change from</span>
          <Input 
            type="number" 
            value={val3From} 
            onChange={e => setVal3From(e.target.value)}
            className="w-32 bg-white/5 border-white/10 text-white rounded-lg h-10"
          />
          <span className="text-gray-400">to</span>
          <Input 
            type="number" 
            value={val3To} 
            onChange={e => setVal3To(e.target.value)}
            className="w-32 bg-white/5 border-white/10 text-white rounded-lg h-10"
          />
          <span className="text-gray-400">=</span>
          <div className="bg-black/30 border border-white/10 rounded-lg px-4 h-10 flex items-center min-w-[100px] text-cyan-300 font-mono font-bold">
            {(!isNaN(parseFloat(val3From)) && !isNaN(parseFloat(val3To)) && parseFloat(val3From) !== 0) 
              ? (() => {
                  const p = ((parseFloat(val3To) - parseFloat(val3From)) / Math.abs(parseFloat(val3From))) * 100;
                  return (p > 0 ? "+" : "") + parseFloat(p.toFixed(4)) + "%";
                })()
              : "0%"}
          </div>
        </div>
      </Card>

    </div>
  )
}
