"use client"

import { useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Copy, Eraser } from "lucide-react"
import { tryCopyToClipboard } from "@/components/tools/utils"

function capitalizeWords(input: string) {
  return input
    .toLowerCase()
    .replace(/\b([\p{L}\p{N}])([\p{L}\p{N}]*)/gu, (_, a: string, b: string) => {
      return a.toUpperCase() + b
    })
}

export default function CapitalizeText() {
  const [input, setInput] = useState("")
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => capitalizeWords(input), [input])

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
            placeholder="hello world"
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
            <Label className="text-gray-300">Output</Label>
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
            <pre className="whitespace-pre-wrap break-words text-sm text-gray-200">
              {output || "—"}
            </pre>
          </Card>
        </div>
      </div>
    </div>
  )
}

