"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Copy, RefreshCw } from "lucide-react"
import { tryCopyToClipboard } from "@/components/tools/utils"

export default function UuidGenerator() {
  const [uuid, setUuid] = useState("")
  const [copied, setCopied] = useState(false)

  function generate() {
    setUuid(crypto.randomUUID())
  }

  async function copy() {
    if (!uuid) return
    const ok = await tryCopyToClipboard(uuid)
    if (!ok) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generate}
          className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate UUID
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={copy}
          disabled={!uuid}
          className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
        >
          <Copy className="w-4 h-4 mr-2" />
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <Card className="glass rounded-2xl p-4 border-white/10 space-y-2">
        <Label className="text-gray-300">Result</Label>
        <pre className="whitespace-pre-wrap break-words text-sm text-gray-200 font-mono">
          {uuid || "—"}
        </pre>
      </Card>
    </div>
  )
}

