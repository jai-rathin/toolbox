"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Calculator, RefreshCw } from "lucide-react"

interface Semester {
  id: string
  gpa: string
  credits: string
}

export default function CgpaCalculator() {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: "1", gpa: "", credits: "" },
    { id: "2", gpa: "", credits: "" }
  ])
  const [cgpa, setCgpa] = useState<number | null>(null)
  const [scale, setScale] = useState<"10" | "4">("10") // 10 point (India) vs 4 point (US)

  const addSemester = () => {
    setSemesters([...semesters, { id: Math.random().toString(), gpa: "", credits: "" }])
    setCgpa(null)
  }

  const removeSemester = (id: string) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(s => s.id !== id))
      setCgpa(null)
    }
  }

  const updateSemester = (id: string, field: "gpa" | "credits", value: string) => {
    setSemesters(semesters.map(s => s.id === id ? { ...s, [field]: value } : s))
    setCgpa(null)
  }

  const calculateCgpa = () => {
    let totalCredits = 0
    let totalPoints = 0
    let valid = true

    semesters.forEach(s => {
      const gpa = parseFloat(s.gpa)
      const credits = parseFloat(s.credits)
      if (!isNaN(gpa) && !isNaN(credits)) {
        totalCredits += credits
        totalPoints += (gpa * credits)
      } else if (s.gpa !== "" || s.credits !== "") {
        valid = false
      }
    })

    if (valid && totalCredits > 0) {
      setCgpa(totalPoints / totalCredits)
    } else {
      alert("Please enter valid numbers for GPA and Credits in filled rows.")
    }
  }

  const reset = () => {
    setSemesters([{ id: "1", gpa: "", credits: "" }, { id: "2", gpa: "", credits: "" }])
    setCgpa(null)
  }

  return (
    <ToolLayout
      title="CGPA Calculator"
      description="Calculate your Cumulative Grade Point Average accurately based on semester GPAs and credits."
      category="Calculators"
      categoryHref="/tools?category=calculators"
    >
      <div className="space-y-6">
        <div className="flex gap-4 p-1 bg-black/20 rounded-xl border border-white/5 w-fit">
          <button
            onClick={() => { setScale("10"); setCgpa(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              scale === "10" ? "bg-cyan-500 text-white shadow-lg" : "text-gray-400 hover:text-white"
            }`}
          >
            10-Point Scale (India)
          </button>
          <button
            onClick={() => { setScale("4"); setCgpa(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              scale === "4" ? "bg-cyan-500 text-white shadow-lg" : "text-gray-400 hover:text-white"
            }`}
          >
            4-Point Scale (US)
          </button>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400 mb-2 px-2">
            <div className="col-span-5">Semester GPA</div>
            <div className="col-span-5">Total Credits</div>
            <div className="col-span-2"></div>
          </div>

          {semesters.map((s, index) => (
            <div key={s.id} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-5">
                <input
                  type="number"
                  min="0"
                  max={scale}
                  step="0.01"
                  placeholder={`e.g. ${scale === "10" ? "8.5" : "3.8"}`}
                  value={s.gpa}
                  onChange={(e) => updateSemester(s.id, "gpa", e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="col-span-5">
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 15"
                  value={s.credits}
                  onChange={(e) => updateSemester(s.id, "credits", e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={() => removeSemester(s.id)}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  disabled={semesters.length <= 1}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          <Button 
            onClick={addSemester}
            variant="outline" 
            className="w-full mt-4 border-dashed border-white/20 text-gray-400 hover:text-white hover:bg-white/5 py-6 rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Semester
          </Button>
        </div>

        {cgpa !== null && (
          <div className="glass p-8 rounded-2xl border border-cyan-500/30 text-center animate-scale-in bg-gradient-to-b from-transparent to-cyan-500/5">
            <h3 className="text-gray-400 font-medium mb-2">Your Cumulative GPA</h3>
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {cgpa.toFixed(2)}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button onClick={reset} variant="outline" className="flex-1 bg-black/20 border-white/10 text-white rounded-xl py-6 hover:bg-white/5">
            <RefreshCw className="w-5 h-5 mr-2" />
            Reset
          </Button>
          <Button onClick={calculateCgpa} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl py-6 border-0 shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-blue-600">
            <Calculator className="w-5 h-5 mr-2" />
            Calculate CGPA
          </Button>
        </div>
      </div>
    </ToolLayout>
  )
}
