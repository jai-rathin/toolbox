"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const UNITS = {
  length: {
    base: "meters",
    units: {
      meters: 1,
      kilometers: 1000,
      centimeters: 0.01,
      millimeters: 0.001,
      miles: 1609.34,
      yards: 0.9144,
      feet: 0.3048,
      inches: 0.0254,
    }
  },
  weight: {
    base: "grams",
    units: {
      grams: 1,
      kilograms: 1000,
      milligrams: 0.001,
      pounds: 453.592,
      ounces: 28.3495,
    }
  },
  temperature: {
    base: "celsius", // Special formula needed
    units: {
      celsius: "C",
      fahrenheit: "F",
      kelvin: "K"
    }
  }
}

type CategoryType = keyof typeof UNITS

export default function UnitConverter() {
  const [category, setCategory] = useState<CategoryType>("length")
  const [fromUnit, setFromUnit] = useState("meters")
  const [toUnit, setToUnit] = useState("feet")
  const [inputValue, setInputValue] = useState("1")

  const result = useMemo(() => {
    const val = parseFloat(inputValue)
    if (isNaN(val)) return ""

    if (category === "temperature") {
      let c = 0
      if (fromUnit === "celsius") c = val
      else if (fromUnit === "fahrenheit") c = (val - 32) * 5 / 9
      else if (fromUnit === "kelvin") c = val - 273.15

      let out = 0
      if (toUnit === "celsius") out = c
      else if (toUnit === "fahrenheit") out = (c * 9 / 5) + 32
      else if (toUnit === "kelvin") out = c + 273.15

      return parseFloat(out.toFixed(4)).toString()
    } else {
      const fromFactor = UNITS[category].units[fromUnit as keyof typeof UNITS[typeof category]["units"]] as number
      const toFactor = UNITS[category].units[toUnit as keyof typeof UNITS[typeof category]["units"]] as number
      
      const baseValue = val * fromFactor
      const outValue = baseValue / toFactor
      
      // limit small floating point errors
      return parseFloat(outValue.toFixed(6)).toString()
    }
  }, [category, fromUnit, toUnit, inputValue])

  function handleCategoryChange(c: CategoryType) {
    setCategory(c)
    const availableUnits = Object.keys(UNITS[c].units)
    setFromUnit(availableUnits[0])
    setToUnit(availableUnits[1] || availableUnits[0])
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-3">
        <Label className="text-gray-300">Category</Label>
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl">
          {(Object.keys(UNITS) as CategoryType[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
                category === cat 
                  ? 'bg-cyan-500/20 text-cyan-300 shadow-sm' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="md:col-span-2 space-y-2">
          <Label className="text-gray-300">From</Label>
          <div className="flex border border-white/10 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-cyan-500 bg-white/5">
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border-0 bg-transparent text-white font-mono focus-visible:ring-0 rounded-none h-12 text-lg"
            />
          </div>
          <select 
            value={fromUnit} 
            onChange={e => setFromUnit(e.target.value)}
            className="w-full mt-2 h-10 bg-white/5 text-gray-200 border border-white/10 rounded-lg px-3 outline-none focus:ring-1 focus:ring-cyan-500 capitalize"
          >
            {Object.keys(UNITS[category].units).map(u => (
              <option key={u} value={u} className="bg-gray-900 text-white capitalize">{u}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-center md:pb-12 text-gray-500">
          =
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label className="text-gray-300">To</Label>
          <div className="flex border border-white/10 rounded-xl overflow-hidden bg-black/20">
            <Input
              readOnly
              value={result}
              placeholder="0"
              className="border-0 bg-transparent text-white font-mono focus-visible:ring-0 rounded-none h-12 text-lg"
            />
          </div>
          <select 
            value={toUnit} 
            onChange={e => setToUnit(e.target.value)}
            className="w-full mt-2 h-10 bg-white/5 text-gray-200 border border-white/10 rounded-lg px-3 outline-none focus:ring-1 focus:ring-cyan-500 capitalize"
          >
            {Object.keys(UNITS[category].units).map(u => (
              <option key={u} value={u} className="bg-gray-900 text-white capitalize">{u}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
