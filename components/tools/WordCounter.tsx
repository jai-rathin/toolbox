"use client"

import { useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eraser, Copy } from "lucide-react"

function countWords(text: string) {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).filter(Boolean).length
}

export default function WordCounter() {
  const [text, setText] = useState("")
  const [copied, setCopied] = useState(false)

  const stats = useMemo(() => {
    const characters = text.length
    const words = countWords(text)
    return { characters, words }
  }, [text])

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore clipboard errors (e.g. insecure context)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-gray-400">
          Paste or type your text below to instantly see counts.
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyText}
            disabled={!text}
            className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
          >
            <Copy className="w-4 h-4 mr-2" />
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setText("")}
            disabled={!text}
            className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
          >
            <Eraser className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing…"
        className="min-h-[220px] rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-cyan-500/50"
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="glass rounded-2xl p-4 border-white/10">
          <p className="text-xs text-gray-400">Words</p>
          <p className="text-2xl font-bold text-white">{stats.words}</p>
        </Card>
        <Card className="glass rounded-2xl p-4 border-white/10">
          <p className="text-xs text-gray-400">Characters</p>
          <p className="text-2xl font-bold text-white">{stats.characters}</p>
        </Card>
      </div>
    </div>
  )
}

