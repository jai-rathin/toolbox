"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dices, Hash } from "lucide-react"

type DiceType = 4 | 6 | 8 | 10 | 12 | 20
const DICE_TYPES: DiceType[] = [4, 6, 8, 10, 12, 20]

export default function DiceRoller() {
  const [diceCount, setDiceCount] = useState<number>(2)
  const [diceSides, setDiceSides] = useState<DiceType>(6)
  
  const [results, setResults] = useState<number[]>([1, 1])
  const [isRolling, setIsRolling] = useState(false)

  const handleRoll = () => {
    setIsRolling(true)
    
    // Simulate dice roll animation with immediate fake updates
    let iterations = 0
    const maxIterations = 10
    
    const interval = setInterval(() => {
      setResults(Array.from({ length: diceCount }, () => Math.floor(Math.random() * diceSides) + 1))
      iterations++
      
      if (iterations >= maxIterations) {
        clearInterval(interval)
        // Final real roll
        setResults(Array.from({ length: diceCount }, () => Math.floor(Math.random() * diceSides) + 1))
        setIsRolling(false)
      }
    }, 50)
  }

  // Auto-update visual dice when count changes, but don't 'roll'
  const updateCount = (newCount: number) => {
    setDiceCount(newCount)
    setResults(Array.from({ length: newCount }, () => 1))
  }

  const resultTotal = results.reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-10 max-w-4xl mx-auto py-8">
      
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-black/20 rounded-3xl border border-white/10">
        <div className="space-y-4">
          <Label className="text-gray-300 font-semibold flex items-center gap-2">
            <Hash className="w-4 h-4 text-cyan-400" />
            Amount of Dice (1-10)
          </Label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 8, 10].map(cnt => (
              <button
                key={cnt}
                onClick={() => updateCount(cnt)}
                className={`w-12 h-10 rounded-xl font-medium transition-all ${
                  diceCount === cnt
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cnt}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-gray-300 font-semibold flex items-center gap-2">
            <Dices className="w-4 h-4 text-purple-400" />
            Dice Sides (d4 - d20)
          </Label>
          <div className="flex flex-wrap gap-2">
            {DICE_TYPES.map(sides => (
              <button
                key={sides}
                onClick={() => setDiceSides(sides)}
                className={`px-4 h-10 rounded-xl font-medium transition-all ${
                  diceSides === sides
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                d{sides}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rolling Area */}
      <div className="flex flex-col items-center justify-center space-y-8">
        <Button
          size="lg"
          onClick={handleRoll}
          disabled={isRolling}
          className="text-lg px-12 py-6 h-auto rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Dices className={`w-6 h-6 mr-3 ${isRolling ? "animate-spin" : ""}`} />
          {isRolling ? "Rolling..." : "Roll Dice"}
        </Button>

        <div className="flex flex-wrap justify-center gap-4">
          {results.map((val, idx) => (
            <div 
              key={idx}
              className={`w-20 h-20 md:w-24 md:h-24 glass rounded-2xl border-white/20 flex flex-col items-center justify-center shadow-2xl transition-transform ${isRolling ? 'scale-90 rotate-12 opacity-80' : 'scale-100 rotate-0 opacity-100'}`}
            >
              <span className="text-3xl md:text-4xl font-black text-white">{val}</span>
            </div>
          ))}
        </div>

        <div className="p-6 text-center border-t border-white/10 w-full max-w-sm">
          <p className="text-sm text-gray-500 font-medium uppercase tracking-widest mb-2">Total Sum</p>
          <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-purple-500">
            {resultTotal}
          </p>
        </div>
      </div>
    </div>
  )
}
