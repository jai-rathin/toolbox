"use client"

import { useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Copy, Eraser } from "lucide-react"
import { tryCopyToClipboard } from "@/components/tools/utils"

export default function UrlDecoder() {
  const [input, setInput] = useState("")
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: "" }
    try {
      return { ok: true as const, output: decodeURIComponent(input.trim()) }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Invalid URL encoding"
      return { ok: false as const, error: message }
    }
  }, [input])

  async function copy() {
    if (!result.ok || !result.output) return
    const ok = await tryCopyToClipboard(result.output)
    if (!ok) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label className="text-gray-300">Encoded input</Label>
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
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="hello%20world%3F%20a%3D1%26b%3D2"
            className="min-h-[220px] rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-cyan-500/50"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label className="text-gray-300">Decoded output</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copy}
              disabled={!result.ok || !result.output}
              className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <Card className="glass rounded-2xl p-4 border-white/10">
            {!input.trim() ? (
              <p className="text-sm text-gray-400">Paste encoded text to decode it.</p>
            ) : result.ok ? (
              <pre className="whitespace-pre-wrap break-words text-sm text-gray-200">
                {result.output || "—"}
              </pre>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-300">Invalid input</p>
                <p className="text-sm text-gray-300">{result.error}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

