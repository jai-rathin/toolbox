"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Calculator, RefreshCw, Plus, Trash2 } from "lucide-react"

interface Assignment {
  id: string
  name: string
  score: string
  weight: string
}

export default function GradeCalculator() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: "1", name: "Homework", score: "", weight: "" },
    { id: "2", name: "Midterm", score: "", weight: "" },
    { id: "3", name: "Final", score: "", weight: "" }
  ])
  const [currentGrade, setCurrentGrade] = useState<number | null>(null)

  const addAssignment = () => {
    setAssignments([...assignments, { id: Math.random().toString(), name: "", score: "", weight: "" }])
    setCurrentGrade(null)
  }

  const removeAssignment = (id: string) => {
    if (assignments.length > 1) {
      setAssignments(assignments.filter(a => a.id !== id))
      setCurrentGrade(null)
    }
  }

  const updateAssignment = (id: string, field: keyof Assignment, value: string) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, [field]: value } : a))
    setCurrentGrade(null)
  }

  const calculateGrade = () => {
    let totalWeight = 0
    let earnedPoints = 0

    for (const a of assignments) {
      const score = parseFloat(a.score)
      const weight = parseFloat(a.weight)
      
      if (!isNaN(score) && !isNaN(weight) && weight > 0) {
        totalWeight += weight
        earnedPoints += (score * weight / 100)
      }
    }

    if (totalWeight > 0) {
      // Scale to 100 if weights don't add up perfectly
      const grade = (earnedPoints / totalWeight) * 100
      setCurrentGrade(grade)
    } else {
      alert("Please enter valid scores and weights.")
    }
  }

  const reset = () => {
    setAssignments([
      { id: "1", name: "Homework", score: "", weight: "" },
      { id: "2", name: "Midterm", score: "", weight: "" },
      { id: "3", name: "Final", score: "", weight: "" }
    ])
    setCurrentGrade(null)
  }

  return (
    <ToolLayout
      title="Grade Calculator"
      description="Calculate your current class grade based on weighted assignments and exams."
      category="Calculator Tools"
      categoryHref="/categories/calculator-tools"
    >
      <div className="space-y-6">
        <div className="glass p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400 mb-2 px-2 hidden md:grid">
            <div className="col-span-5">Assignment</div>
            <div className="col-span-3">Score (%)</div>
            <div className="col-span-3">Weight (%)</div>
            <div className="col-span-1"></div>
          </div>

          {assignments.map((a) => (
            <div key={a.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-black/20 md:bg-transparent p-4 md:p-0 rounded-xl">
              <div className="md:col-span-5">
                <input
                  type="text"
                  placeholder="e.g. Midterm"
                  value={a.name}
                  onChange={(e) => updateAssignment(a.id, "name", e.target.value)}
                  className="w-full bg-black/30 md:bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="md:col-span-3">
                <input
                  type="number"
                  min="0"
                  max="150"
                  placeholder="Score (e.g. 85)"
                  value={a.score}
                  onChange={(e) => updateAssignment(a.id, "score", e.target.value)}
                  className="w-full bg-black/30 md:bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="md:col-span-3">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Weight (e.g. 20)"
                  value={a.weight}
                  onChange={(e) => updateAssignment(a.id, "weight", e.target.value)}
                  className="w-full bg-black/30 md:bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="md:col-span-1 flex justify-end">
                <button
                  onClick={() => removeAssignment(a.id)}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  disabled={assignments.length <= 1}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          <Button 
            onClick={addAssignment}
            variant="outline" 
            className="w-full mt-4 border-dashed border-white/20 text-gray-400 hover:text-white hover:bg-white/5 py-6 rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Assignment
          </Button>
        </div>

        {currentGrade !== null && (
          <div className="glass p-8 rounded-2xl border border-rose-500/30 text-center animate-scale-in">
            <h3 className="text-gray-400 font-medium mb-2">Current Class Grade</h3>
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">
              {currentGrade.toFixed(2)}%
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button onClick={reset} variant="outline" className="flex-1 bg-black/20 border-white/10 text-white rounded-xl py-6 hover:bg-white/5">
            <RefreshCw className="w-5 h-5 mr-2" />
            Reset
          </Button>
          <Button onClick={calculateGrade} className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl py-6 border-0 shadow-lg shadow-rose-500/20 hover:from-rose-600 hover:to-pink-600">
            <Calculator className="w-5 h-5 mr-2" />
            Calculate Grade
          </Button>
        </div>
      </div>
    </ToolLayout>
  )
}
