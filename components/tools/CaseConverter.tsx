"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Eraser } from "lucide-react"

function toTitleCase(input: string) {
  return input
    .toLowerCase()
    .replace(/\b([\p{L}\p{N}])([\p{L}\p{N}]*)/gu, (_, a: string, b: string) => {
      return a.toUpperCase() + b
    })
}

type Mode =
  | "uppercase"
  | "lowercase"
  | "titlecase"

function transform(input: string, mode: Mode) {
  switch (mode) {
    case "uppercase":
      return input.toUpperCase()
    case "lowercase":
      return input.toLowerCase()
    case "titlecase":
      return toTitleCase(input)
    default:
      return input
  }
}

export default function CaseConverter() {
  const [text, setText] = useState("")
  const [copied, setCopied] = useState(false)

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore clipboard errors
    }
  }

  const actions: Array<{ mode: Mode; label: string }> = [
    { mode: "uppercase", label: "UPPERCASE" },
    { mode: "lowercase", label: "lowercase" },
    { mode: "titlecase", label: "Capitalize Words" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-gray-400">
          Convert text casing in one click. Your input never leaves the browser.
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => copy(text)}
            disabled={!text}
            className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
          >
            <Copy className="w-4 h-4 mr-2" />
            {copied ? "Copied" : "Copy input"}
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
        placeholder="Paste your text here…"
        className="min-h-[200px] rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-cyan-500/50"
      />

      <div className="flex flex-wrap gap-2">
        {actions.map(({ mode, label }) => (
          <Button
            key={mode}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setText((prev) => transform(prev, mode))}
            disabled={!text}
            className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
          >
            {label}
          </Button>
        ))}
      </div>

      <Card className="glass rounded-2xl p-4 border-white/10">
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-sm text-gray-300">Preview</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => copy(text)}
            disabled={!text}
            className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </div>
        <pre className="whitespace-pre-wrap break-words text-sm text-gray-200">
          {text || "—"}
        </pre>
      </Card>
    </div>
  )
}

