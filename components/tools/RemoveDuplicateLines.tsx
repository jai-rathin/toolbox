"use client"

import { useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Copy, Eraser } from "lucide-react"
import { splitLines, tryCopyToClipboard } from "@/components/tools/utils"

export default function RemoveDuplicateLines() {
  const [input, setInput] = useState("")
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => {
    const seen = new Set<string>()
    const out: string[] = []
    for (const line of splitLines(input)) {
      if (seen.has(line)) continue
      seen.add(line)
      out.push(line)
    }
    return out.join("\n")
  }, [input])

  const stats = useMemo(() => {
    const lines = splitLines(input)
    const unique = splitLines(output)
    const inputCount = input ? lines.length : 0
    const uniqueCount = output ? unique.length : 0
    return { inputCount, uniqueCount, removed: Math.max(0, inputCount - uniqueCount) }
  }, [input, output])

  async function copy() {
    const ok = await tryCopyToClipboard(output)
    if (!ok) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-gray-300">Input</Label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"apple\nbanana\napple\nbanana\ncherry"}
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

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label className="text-gray-300">Output (unique lines)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copy}
              disabled={!output}
              className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <Card className="glass rounded-2xl p-4 border-white/10">
            <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
              <span>Lines: {stats.inputCount}</span>
              <span>Unique: {stats.uniqueCount}</span>
              <span>Removed: {stats.removed}</span>
            </div>
            <pre className="whitespace-pre-wrap break-words text-sm text-gray-200">
              {output || "—"}
            </pre>
          </Card>
        </div>
      </div>
    </div>
  )
}

