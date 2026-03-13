"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Clock, RefreshCw } from "lucide-react"

export default function StudyTimeCalculator() {
  const [credits, setCredits] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [goal, setGoal] = useState("pass")
  const [result, setResult] = useState<number | null>(null)

  const calculate = () => {
    const creds = parseFloat(credits)
    if (!isNaN(creds) && creds > 0) {
      // Base: 2 hours per credit
      let multiplier = 2
      
      // Adjust for difficulty
      if (difficulty === "hard") multiplier += 1
      if (difficulty === "easy") multiplier -= 0.5
      
      // Adjust for goal
      if (goal === "a") multiplier += 1
      
      setResult(creds * multiplier)
    }
  }

  return (
    <ToolLayout
      title="Study Time Calculator"
      description="Estimate how many hours per week you should study based on standard university guidelines (credits and course difficulty)."
      category="Calculators"
      categoryHref="/tools?category=calculators"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Total Credit Hours</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 15"
              value={credits}
              onChange={(e) => {
                setCredits(e.target.value)
                setResult(null)
              }}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Average Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value)
                setResult(null)
              }}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="easy">Easy (Introductory)</option>
              <option value="medium">Medium (Standard)</option>
              <option value="hard">Hard (Advanced/STEM)</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Grade Goal</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { setGoal("pass"); setResult(null); }}
                className={`py-3 rounded-xl border transition-all ${
                  goal === "pass" 
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-300" 
                    : "glass border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                Pass/Average (C/B)
              </button>
              <button
                onClick={() => { setGoal("a"); setResult(null); }}
                className={`py-3 rounded-xl border transition-all ${
                  goal === "a" 
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-300" 
                    : "glass border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                Excel (A/A+)
              </button>
            </div>
          </div>
        </div>

        {result !== null && (
          <div className="glass p-8 rounded-2xl border border-amber-500/30 text-center animate-scale-in">
            <h3 className="text-gray-400 font-medium mb-2">Recommended Study Time</h3>
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              {result.toFixed(1)} <span className="text-2xl text-amber-500/70">hrs/week</span>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              This is independent of time spent in lectures or labs.
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button 
            onClick={() => { setCredits(""); setDifficulty("medium"); setGoal("pass"); setResult(null); }} 
            variant="outline" 
            className="flex-1 bg-black/20 border-white/10 text-white rounded-xl py-6 hover:bg-white/5"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={calculate} 
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl py-6 border-0 shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-600"
            disabled={!credits}
          >
            <Clock className="w-5 h-5 mr-2" />
            Calculate
          </Button>
        </div>
      </div>
    </ToolLayout>
  )
}
