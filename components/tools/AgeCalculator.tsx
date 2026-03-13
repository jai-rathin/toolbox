"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

export default function AgeCalculator() {
  const [dob, setDob] = useState("")

  const ageDetails = useMemo(() => {
    if (!dob) return null
    const birthDate = new Date(dob)
    const today = new Date()

    if (isNaN(birthDate.getTime()) || birthDate > today) return null

    let years = today.getFullYear() - birthDate.getFullYear()
    let months = today.getMonth() - birthDate.getMonth()
    let days = today.getDate() - birthDate.getDate()

    if (days < 0) {
      months -= 1
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      days += prevMonth.getDate()
    }

    if (months < 0) {
      years -= 1
      months += 12
    }

    const diffTime = Math.abs(today.getTime() - birthDate.getTime())
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = (years * 12) + months

    return { years, months, days, totalMonths, totalWeeks, totalDays }
  }, [dob])

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <div className="space-y-3">
        <Label className="text-gray-300">Date of Birth</Label>
        <Input 
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="h-12 bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-cyan-500 [color-scheme:dark]"
        />
      </div>

      {!ageDetails && dob && (
         <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-sm">
           Invalid date of birth. Make sure it is in the past.
         </div>
      )}

      {ageDetails && (
        <div className="space-y-6">
          <Card className="glass rounded-3xl border-white/10 p-6 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-cyan-500/10 to-blue-600/10">
            <span className="text-gray-400 font-medium">Exact Age</span>
            <div className="text-3xl md:text-5xl font-bold tracking-tight text-white text-center">
              {ageDetails.years} <span className="text-lg md:text-2xl text-cyan-400 font-normal">years</span> 
              {" "}{ageDetails.months} <span className="text-lg md:text-2xl text-cyan-400 font-normal">months</span> 
              {" "}{ageDetails.days} <span className="text-lg md:text-2xl text-cyan-400 font-normal">days</span>
            </div>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="glass rounded-2xl border-white/10 p-4 text-center">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Months</span>
              <div className="mt-2 text-2xl font-bold text-gray-200">{ageDetails.totalMonths.toLocaleString()}</div>
            </Card>
            <Card className="glass rounded-2xl border-white/10 p-4 text-center">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Weeks</span>
              <div className="mt-2 text-2xl font-bold text-gray-200">{ageDetails.totalWeeks.toLocaleString()}</div>
            </Card>
            <Card className="glass rounded-2xl border-white/10 p-4 text-center col-span-2 md:col-span-1">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Days</span>
              <div className="mt-2 text-2xl font-bold text-gray-200">{ageDetails.totalDays.toLocaleString()}</div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
