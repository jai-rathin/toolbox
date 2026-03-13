"use client"

import { useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowDownAZ, ArrowUpZA, Copy, Eraser } from "lucide-react"
import { splitLines, tryCopyToClipboard } from "@/components/tools/utils"

export default function TextSorter() {
  const [input, setInput] = useState("")
  const [descending, setDescending] = useState(false)
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => {
    const lines = splitLines(input)
    const sorted = [...lines].sort((a, b) => a.localeCompare(b))
    if (descending) sorted.reverse()
    return sorted.join("\n")
  }, [input, descending])

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
          <Label className="text-gray-300">Input (one line per item)</Label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"banana\napple\ncherry"}
            className="min-h-[220px] rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-cyan-500/50"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Switch checked={descending} onCheckedChange={setDescending} />
              <span className="text-sm text-gray-300">
                {descending ? "Descending" : "Ascending"}
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

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label className="text-gray-300">Sorted output</Label>
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
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
              {descending ? (
                <ArrowUpZA className="w-4 h-4" />
              ) : (
                <ArrowDownAZ className="w-4 h-4" />
              )}
              <span>Updates instantly</span>
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

