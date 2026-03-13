"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { tryCopyToClipboard } from "@/components/tools/utils"

function formatDate(d: Date) {
  if (Number.isNaN(d.getTime())) return "Invalid date"
  return d.toISOString()
}

export default function TimestampConverter() {
  const [unixSeconds, setUnixSeconds] = useState("")
  const [iso, setIso] = useState("")
  const [copied, setCopied] = useState<"unix" | "iso" | null>(null)

  const unixToIso = useMemo(() => {
    if (!unixSeconds.trim()) return ""
    const n = Number(unixSeconds)
    if (!Number.isFinite(n)) return "Invalid timestamp"
    return formatDate(new Date(n * 1000))
  }, [unixSeconds])

  const isoToUnix = useMemo(() => {
    if (!iso.trim()) return ""
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return "Invalid date"
    return String(Math.floor(d.getTime() / 1000))
  }, [iso])

  async function copy(value: string, kind: "unix" | "iso") {
    const ok = await tryCopyToClipboard(value)
    if (!ok) return
    setCopied(kind)
    window.setTimeout(() => setCopied(null), 1200)
  }

  function setNow() {
    const now = new Date()
    setIso(now.toISOString())
    setUnixSeconds(String(Math.floor(now.getTime() / 1000)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={setNow}
          className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
        >
          Set current time
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass rounded-2xl p-6 border-white/10 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label className="text-gray-300">Unix timestamp (seconds)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => copy(unixSeconds.trim(), "unix")}
              disabled={!unixSeconds.trim()}
              className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied === "unix" ? "Copied" : "Copy"}
            </Button>
          </div>
          <Input
            value={unixSeconds}
            onChange={(e) => setUnixSeconds(e.target.value)}
            inputMode="numeric"
            placeholder="1710000000"
            className="rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-mono"
          />
          <div>
            <p className="text-xs text-gray-400 mb-1">Readable date (ISO)</p>
            <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap break-words">
              {unixToIso || "—"}
            </pre>
          </div>
        </Card>

        <Card className="glass rounded-2xl p-6 border-white/10 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label className="text-gray-300">Date (ISO 8601)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => copy(iso.trim(), "iso")}
              disabled={!iso.trim()}
              className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied === "iso" ? "Copied" : "Copy"}
            </Button>
          </div>
          <Input
            value={iso}
            onChange={(e) => setIso(e.target.value)}
            placeholder="2026-03-13T12:34:56.000Z"
            className="rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-mono"
          />
          <div>
            <p className="text-xs text-gray-400 mb-1">Unix timestamp (seconds)</p>
            <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap break-words">
              {isoToUnix || "—"}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  )
}

