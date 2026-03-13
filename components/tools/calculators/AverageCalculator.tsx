"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Calculator, RefreshCw } from "lucide-react"

export default function AverageCalculator() {
  const [inputData, setInputData] = useState("")
  
  const [stats, setStats] = useState<{
    count: number
    sum: number
    mean: number
    median: number
    min: number
    max: number
  } | null>(null)

  const calculate = () => {
    // Parse input: split by comma, space, or newline
    const rawNumbers = inputData
      .split(/[\s,]+/)
      .map(part => parseFloat(part.trim()))
      .filter(n => !isNaN(n))

    if (rawNumbers.length > 0) {
      const count = rawNumbers.length
      const sum = rawNumbers.reduce((a, b) => a + b, 0)
      const mean = sum / count
      const min = Math.min(...rawNumbers)
      const max = Math.max(...rawNumbers)
      
      const sorted = [...rawNumbers].sort((a, b) => a - b)
      const mid = Math.floor(count / 2)
      const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2

      setStats({ count, sum, mean, median, min, max })
    } else {
      alert("Please enter at least one valid number.")
    }
  }

  const reset = () => {
    setInputData("")
    setStats(null)
  }

  return (
    <ToolLayout
      title="Average Calculator"
      description="Quickly calculate the average (mean), median, sum, and count of a dataset."
      category="Calculators"
      categoryHref="/tools?category=calculators"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 ml-1">Data Values (comma or space separated)</label>
          <textarea
            rows={4}
            placeholder="e.g. 10, 25, 30, 42, 55"
            value={inputData}
            onChange={(e) => { setInputData(e.target.value); setStats(null); }}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 resize-none font-mono"
          />
        </div>

        {stats !== null && (
          <div className="glass p-6 rounded-2xl border border-cyan-500/30 animate-scale-in">
            <h3 className="text-gray-400 font-medium mb-4 text-center">Statistical Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Average (Mean)</div>
                <div className="text-2xl font-bold text-cyan-400">{Number.isInteger(stats.mean) ? stats.mean : stats.mean.toFixed(2)}</div>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Median</div>
                <div className="text-2xl font-bold text-cyan-400">{Number.isInteger(stats.median) ? stats.median : stats.median.toFixed(2)}</div>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Sum</div>
                <div className="text-2xl font-bold text-cyan-400">{Number.isInteger(stats.sum) ? stats.sum : stats.sum.toFixed(2)}</div>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Count</div>
                <div className="text-2xl font-bold text-cyan-400">{stats.count}</div>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Min</div>
                <div className="text-2xl font-bold text-cyan-400">{stats.min}</div>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Max</div>
                <div className="text-2xl font-bold text-cyan-400">{stats.max}</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button 
            onClick={reset} 
            variant="outline" 
            className="flex-1 bg-black/20 border-white/10 text-white rounded-xl py-6 hover:bg-white/5"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={calculate} 
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl py-6 border-0 shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-blue-600"
            disabled={!inputData.trim()}
          >
            <Calculator className="w-5 h-5 mr-2" />
            Calculate Stats
          </Button>
        </div>
      </div>
    </ToolLayout>
  )
}
