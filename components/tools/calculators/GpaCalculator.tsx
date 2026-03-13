"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Calculator, RefreshCw } from "lucide-react"

interface Course {
  id: string
  name: string
  grade: string
  credits: string
}

const gradePoints: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "F": 0.0
}

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "", grade: "A", credits: "" },
    { id: "2", name: "", grade: "A", credits: "" },
    { id: "3", name: "", grade: "A", credits: "" }
  ])
  const [gpa, setGpa] = useState<number | null>(null)

  const addCourse = () => {
    setCourses([...courses, { id: Math.random().toString(), name: "", grade: "A", credits: "" }])
    setGpa(null)
  }

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id))
      setGpa(null)
    }
  }

  const updateCourse = (id: string, field: keyof Course, value: string) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c))
    setGpa(null)
  }

  const calculateGpa = () => {
    let totalCredits = 0
    let totalPoints = 0
    let valid = true

    courses.forEach(c => {
      const credits = parseFloat(c.credits)
      if (!isNaN(credits) && credits > 0) {
        totalCredits += credits
        totalPoints += (gradePoints[c.grade] * credits)
      } else if (c.credits !== "") {
        valid = false
      }
    })

    if (valid && totalCredits > 0) {
      setGpa(totalPoints / totalCredits)
    } else {
      alert("Please enter valid credits for filled courses.")
    }
  }

  const reset = () => {
    setCourses([
      { id: "1", name: "", grade: "A", credits: "" },
      { id: "2", name: "", grade: "A", credits: "" },
      { id: "3", name: "", grade: "A", credits: "" }
    ])
    setGpa(null)
  }

  return (
    <ToolLayout
      title="GPA Calculator"
      description="Calculate your semester Grade Point Average (GPA) using standard US letter grades."
      category="Calculator Tools"
      categoryHref="/categories/calculator-tools"
    >
      <div className="space-y-6">
        <div className="glass p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400 mb-2 px-2 hidden md:grid">
            <div className="col-span-4">Course Name</div>
            <div className="col-span-3">Letter Grade</div>
            <div className="col-span-3">Credits</div>
            <div className="col-span-2"></div>
          </div>

          {courses.map((c) => (
            <div key={c.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-black/20 md:bg-transparent p-4 md:p-0 rounded-xl">
              <div className="md:col-span-4">
                <input
                  type="text"
                  placeholder="e.g. Calculus"
                  value={c.name}
                  onChange={(e) => updateCourse(c.id, "name", e.target.value)}
                  className="w-full bg-black/30 md:bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="md:col-span-3">
                <select
                  value={c.grade}
                  onChange={(e) => updateCourse(c.id, "grade", e.target.value)}
                  className="w-full bg-black/30 md:bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  {Object.keys(gradePoints).map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="Credits (e.g. 3)"
                  value={c.credits}
                  onChange={(e) => updateCourse(c.id, "credits", e.target.value)}
                  className="w-full bg-black/30 md:bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={() => removeCourse(c.id)}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  disabled={courses.length <= 1}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          <Button 
            onClick={addCourse}
            variant="outline" 
            className="w-full mt-4 border-dashed border-white/20 text-gray-400 hover:text-white hover:bg-white/5 py-6 rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Course
          </Button>
        </div>

        {gpa !== null && (
          <div className="glass p-8 rounded-2xl border border-cyan-500/30 text-center animate-scale-in bg-gradient-to-b from-transparent to-cyan-500/5">
            <h3 className="text-gray-400 font-medium mb-2">Semester GPA</h3>
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {gpa.toFixed(2)}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button onClick={reset} variant="outline" className="flex-1 bg-black/20 border-white/10 text-white rounded-xl py-6 hover:bg-white/5">
            <RefreshCw className="w-5 h-5 mr-2" />
            Reset
          </Button>
          <Button onClick={calculateGpa} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl py-6 border-0 shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-blue-600">
            <Calculator className="w-5 h-5 mr-2" />
            Calculate GPA
          </Button>
        </div>
      </div>
    </ToolLayout>
  )
}
