"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react"
import { tryCopyToClipboard } from "@/components/tools/utils"

function hexToRgb(hex: string) {
  const h = hex.replace("#", "").trim()
  if (h.length !== 6) return null
  const r = Number.parseInt(h.slice(0, 2), 16)
  const g = Number.parseInt(h.slice(2, 4), 16)
  const b = Number.parseInt(h.slice(4, 6), 16)
  if ([r, g, b].some((n) => Number.isNaN(n))) return null
  return { r, g, b }
}

export default function ColorPickerTool() {
  const [hex, setHex] = useState("#22d3ee")
  const [copied, setCopied] = useState<"hex" | "rgb" | null>(null)

  const rgb = useMemo(() => hexToRgb(hex), [hex])
  const rgbText = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "—"

  async function copy(value: string, kind: "hex" | "rgb") {
    const ok = await tryCopyToClipboard(value)
    if (!ok) return
    setCopied(kind)
    window.setTimeout(() => setCopied(null), 1200)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass rounded-2xl p-6 border-white/10 space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Pick a color</Label>
            <div className="flex items-center gap-3">
              <Input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="h-12 w-16 p-1 rounded-2xl bg-white/5 border-white/10"
              />
              <Input
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#RRGGBB"
                className="rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Preview</Label>
            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <div className="h-28" style={{ background: hex }} />
            </div>
          </div>
        </Card>

        <Card className="glass rounded-2xl p-6 border-white/10 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-gray-300">HEX</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copy(hex, "hex")}
                className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied === "hex" ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="text-sm text-gray-200 font-mono">{hex}</pre>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-gray-300">RGB</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copy(rgbText, "rgb")}
                disabled={!rgb}
                className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied === "rgb" ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="text-sm text-gray-200 font-mono">{rgbText}</pre>
          </div>
        </Card>
      </div>
    </div>
  )
}

