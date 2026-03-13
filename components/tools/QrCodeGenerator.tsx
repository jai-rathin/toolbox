"use client"

import { useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Download, Eraser } from "lucide-react"

function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string) {
  const url = canvas.toDataURL("image/png")
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
}

export default function QrCodeGenerator() {
  const [text, setText] = useState("")
  const [size, setSize] = useState(256)

  const canDownload = typeof document !== "undefined" && !!text.trim()

  function download() {
    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement | null
    if (!canvas) return
    downloadCanvasAsPng(canvas, "qr-code.png")
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label className="text-gray-300">Text / URL</Label>
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
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com"
            className="min-h-[180px] rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-cyan-500/50"
          />

          <div className="space-y-2">
            <Label className="text-gray-300">Size (px)</Label>
            <Input
              value={String(size)}
              onChange={(e) => setSize(Math.max(128, Math.min(512, Number(e.target.value) || 256)))}
              inputMode="numeric"
              className="rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-500">128–512 recommended.</p>
          </div>
        </div>

        <Card className="glass rounded-2xl p-6 border-white/10 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Label className="text-gray-300">QR code</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={download}
              disabled={!canDownload}
              className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PNG
            </Button>
          </div>

          <div className="flex justify-center">
            <div className="rounded-2xl bg-white p-4">
              {text.trim() ? (
                <QRCodeCanvas
                  id="qr-canvas"
                  value={text}
                  size={size}
                  level="M"
                  includeMargin
                />
              ) : (
                <div
                  className="flex items-center justify-center text-sm text-gray-600"
                  style={{ width: size, height: size }}
                >
                  Enter text to generate
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

