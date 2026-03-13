"use client"

import { useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Copy, Eraser } from "lucide-react"
import { base64DecodeUtf8, tryCopyToClipboard } from "@/components/tools/utils"

export default function Base64Decoder() {
  const [input, setInput] = useState("")
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: "" }
    try {
      return { ok: true as const, output: base64DecodeUtf8(input.trim()) }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Invalid Base64"
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
            <Label className="text-gray-300">Base64 input</Label>
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
            placeholder="SGVsbG8gd29ybGQ="
            className="min-h-[220px] rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-cyan-500/50 font-mono"
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
              <p className="text-sm text-gray-400">Paste Base64 to see the decoded text.</p>
            ) : result.ok ? (
              <pre className="whitespace-pre-wrap break-words text-sm text-gray-200">
                {result.output || "—"}
              </pre>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-300">Invalid Base64</p>
                <p className="text-sm text-gray-300">{result.error}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

