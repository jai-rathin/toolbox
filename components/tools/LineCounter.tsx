"use client"

import { useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eraser } from "lucide-react"
import { splitLines } from "@/components/tools/utils"

export default function LineCounter() {
  const [input, setInput] = useState("")

  const count = useMemo(() => {
    if (!input) return 0
    return splitLines(input).length
  }, [input])

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-gray-300">Input</Label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"First line\nSecond line\nThird line"}
          className="min-h-[220px] rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-cyan-500/50"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setInput("")}
          disabled={!input}
          className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
        >
          <Eraser className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      <Card className="glass rounded-2xl p-4 border-white/10">
        <p className="text-xs text-gray-400">Line count</p>
        <p className="text-3xl font-bold text-white">{count}</p>
      </Card>
    </div>
  )
}

