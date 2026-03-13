"use client"

import { useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Copy, Eraser } from "lucide-react"
import { tryCopyToClipboard } from "@/components/tools/utils"

export default function TextReverser() {
  const [input, setInput] = useState("")
  const [reverseWords, setReverseWords] = useState(false)
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => {
    if (!input) return ""
    if (reverseWords) {
      const words = input.trim().split(/\s+/).filter(Boolean)
      return words.reverse().join(" ")
    }
    return input.split("").reverse().join("")
  }, [input, reverseWords])

  async function copy() {
    const ok = await tryCopyToClipboard(output)
    if (!ok) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-gray-300">Input</Label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text…"
          className="min-h-[180px] rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-cyan-500/50"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Switch checked={reverseWords} onCheckedChange={setReverseWords} />
            <span className="text-sm text-gray-300">
              Reverse {reverseWords ? "words" : "characters"}
            </span>
          </div>
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
      </div>

      <Card className="glass rounded-2xl p-4 border-white/10">
        <div className="flex items-center justify-between gap-3 mb-3">
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
        <pre className="whitespace-pre-wrap break-words text-sm text-gray-200">
          {output || "—"}
        </pre>
      </Card>
    </div>
  )
}

