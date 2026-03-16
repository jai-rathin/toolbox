"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Copy, RefreshCw } from "lucide-react"
import { tryCopyToClipboard } from "@/components/tools/utils"

const WORDS = [
  "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "mountain", "river",
  "forest", "summer", "winter", "morning", "evening", "sunlight", "moonlight", "starlight",
  "ocean", "breeze", "whisper", "echo", "spirit", "journey", "adventure", "discovery",
  "balance", "harmony", "silence", "energy", "vibration", "frequency", "dimension",
  "knowledge", "wisdom", "insight", "philosophy", "science", "nature", "universe",
  "galaxies", "nebula", "constellation", "evolution", "revolution", "transformation",
  "creation", "imagination", "inspiration", "motivation", "determination", "resilience",
  "courage", "strength", "peace", "freedom", "justice", "equality", "unity",
  "experience", "memories", "dreams", "reality", "perspective", "connection",
  "system", "logic", "module", "component", "interface", "protocol", "architecture",
  "database", "network", "security", "encryption", "algorithm", "processing", "storage",
  "cloud", "digital", "analog", "virtual", "synthetic", "organic", "metaphor", "symbol"
]

function generateRandomText(wordCount: number) {
  const result = []
  for (let i = 0; i < wordCount; i++) {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    if (i === 0 || Math.random() < 0.1) {
      result.push(randomWord.charAt(0).toUpperCase() + randomWord.slice(1))
    } else {
      result.push(randomWord)
    }
    
    if (i === wordCount - 1) {
      result[i] += "."
    } else if (Math.random() < 0.1) {
      result[i] += ","
    } else if (Math.random() < 0.05) {
      result[i] += "."
    }
  }
  return result.join(" ")
}

export default function RandomTextGenerator() {
  const [wordCount, setWordCount] = useState("50")
  const [text, setText] = useState(generateRandomText(50))
  const [copied, setCopied] = useState(false)

  function handleGenerate() {
    const count = parseInt(wordCount) || 50
    setText(generateRandomText(Math.min(Math.max(count, 1), 1000)))
  }

  async function copyText() {
    const ok = await tryCopyToClipboard(text)
    if (!ok) return
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-2 flex-1 min-w-[200px]">
          <Label className="text-gray-300">Number of Words (Max 1000)</Label>
          <input
            type="number"
            min="1"
            max="1000"
            value={wordCount}
            onChange={(e) => setWordCount(e.target.value)}
            className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        <Button
          type="button"
          onClick={handleGenerate}
          className="bg-cyan-500 hover:bg-cyan-600 text-white h-10 px-6 rounded-lg font-medium shadow-lg shadow-cyan-500/20"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate Text
        </Button>
      </div>

      <div className="space-y-3 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Generated Text</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyText}
            className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
          >
            <Copy className="w-4 h-4 mr-2" />
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <Textarea
          value={text}
          readOnly
          className="min-h-[300px] rounded-2xl bg-white/5 border-white/10 text-white focus-visible:ring-0 focus-visible:border-cyan-500/50 resize-none leading-relaxed"
        />
      </div>
    </div>
  )
}
