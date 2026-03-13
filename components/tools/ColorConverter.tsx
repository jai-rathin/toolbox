"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RefreshCw, Copy } from "lucide-react"
import { tryCopyToClipboard } from "@/components/tools/utils"

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export default function ColorConverter() {
  const [colorInput, setColorInput] = useState("#3B82F6") // default tailwind blue
  const [copied, setCopied] = useState<string | null>(null)

  const parsedColors = useMemo(() => {
    let hex = "", r = 0, g = 0, b = 0, h = 0, s = 0, l = 0
    let valid = false

    const cleanInput = colorInput.trim().toLowerCase()

    if (cleanInput.startsWith('#') || cleanInput.length === 6 || cleanInput.length === 3) {
      // Try Hex
      let hexStr = cleanInput.startsWith('#') ? cleanInput : '#' + cleanInput
      if (hexStr.length === 4) {
        hexStr = '#' + hexStr[1] + hexStr[1] + hexStr[2] + hexStr[2] + hexStr[3] + hexStr[3]
      }
      const rgb = hexToRgb(hexStr)
      if (rgb) {
        r = rgb.r; g = rgb.g; b = rgb.b
        valid = true
      }
    } else if (cleanInput.startsWith('rgb')) {
      const match = cleanInput.match(/\d+/g)
      if (match && match.length >= 3) {
        r = Math.min(255, Math.max(0, parseInt(match[0])))
        g = Math.min(255, Math.max(0, parseInt(match[1])))
        b = Math.min(255, Math.max(0, parseInt(match[2])))
        valid = true
      }
    }

    if (valid) {
      hex = rgbToHex(r, g, b)
      const hsl = rgbToHsl(r, g, b)
      h = hsl.h; s = hsl.s; l = hsl.l;
      return { ok: true, hex, rgb: `rgb(${r}, ${g}, ${b})`, hsl: `hsl(${h}, ${s}%, ${l}%)` }
    }
    return { ok: false, hex: "", rgb: "", hsl: "" }
  }, [colorInput])

  async function handleCopy(type: string, value: string) {
    const ok = await tryCopyToClipboard(value)
    if (ok) {
      setCopied(type)
      setTimeout(() => setCopied(null), 1200)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-3">
        <Label className="text-gray-300">Enter a Color (HEX or RGB)</Label>
        <div className="flex gap-4">
          <Input 
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            placeholder="#3B82F6 or rgb(59, 130, 246)"
            className="h-12 border-white/10 bg-white/5 text-white focus-visible:ring-1 focus-visible:ring-cyan-500 rounded-xl"
          />
        </div>
      </div>

      <div className="p-6 rounded-3xl border border-white/10 bg-black/20 space-y-6">
        <div className="flex items-center gap-6">
          <div 
            className="w-24 h-24 rounded-2xl shadow-inner border border-white/20 shrink-0"
            style={{ backgroundColor: parsedColors.ok ? parsedColors.hex : 'transparent' }}
          />
          <div className="space-y-1">
            <h3 className="text-xl font-medium text-white">Color Preview</h3>
            <p className="text-sm text-gray-500">
              {parsedColors.ok ? "Valid color detected" : "Invalid color format"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: "HEX", value: parsedColors.hex },
            { label: "RGB", value: parsedColors.rgb },
            { label: "HSL", value: parsedColors.hsl },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <Label className="w-12 text-sm text-gray-400 font-medium">{item.label}</Label>
              <Input
                readOnly
                value={parsedColors.ok ? item.value : ""}
                placeholder="---"
                className="flex-1 bg-white/5 border-white/10 text-white font-mono h-10 rounded-lg"
              />
              <Button
                variant="outline"
                size="icon"
                disabled={!parsedColors.ok}
                onClick={() => handleCopy(item.label, item.value)}
                className="shrink-0 rounded-lg border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
                title={`Copy ${item.label}`}
              >
                {copied === item.label ? <span className="text-xs text-green-400 font-medium italic">OK</span> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
