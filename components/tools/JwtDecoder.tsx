"use client"

import { useState, useMemo } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eraser } from "lucide-react"

function decodeBase64Url(str: string) {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/')
  switch (b64.length % 4) {
    case 2: b64 += '=='
      break
    case 3: b64 += '='
      break
  }
  // Try utf-8 decoding first, fallback to standard btoa if it fails (not typical for JWT but safe)
  try {
    return decodeURIComponent(
      atob(b64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  } catch (e) {
    return atob(b64)
  }
}

export default function JwtDecoder() {
  const [token, setToken] = useState("")

  const decoded = useMemo(() => {
    if (!token.trim()) return null
    try {
      const parts = token.split(".")
      if (parts.length !== 3) {
        throw new Error("JWT must have exactly 3 parts separated by dots.")
      }

      const headerRaw = decodeBase64Url(parts[0])
      const payloadRaw = decodeBase64Url(parts[1])

      return {
        ok: true,
        header: JSON.stringify(JSON.parse(headerRaw), null, 2),
        payload: JSON.stringify(JSON.parse(payloadRaw), null, 2),
        error: null
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Invalid JWT"
      return { ok: false, header: null, payload: null, error: message }
    }
  }, [token])

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">JWT Token</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setToken("")}
            disabled={!token}
            className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
          >
            <Eraser className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
        <Textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT (ey...) here"
          className="min-h-[120px] rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-cyan-500/50 font-mono break-all"
        />
      </div>

      {decoded && !decoded.ok && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
          <p className="text-red-300 text-sm font-medium">Failed to Decode</p>
          <p className="text-red-400 text-xs mt-1">{decoded.error}</p>
        </div>
      )}

      {decoded && decoded.ok && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-pink-400">Header <span className="text-gray-500 text-xs font-normal">(Algorithm & Token Type)</span></Label>
            <div className="bg-black/30 border border-white/10 rounded-2xl p-4 overflow-x-auto">
              <pre className="text-pink-200 text-sm font-mono whitespace-pre-wrap break-all">
                {decoded.header}
              </pre>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-cyan-400">Payload <span className="text-gray-500 text-xs font-normal">(Data)</span></Label>
            <div className="bg-black/30 border border-white/10 rounded-2xl p-4 overflow-x-auto">
              <pre className="text-cyan-200 text-sm font-mono whitespace-pre-wrap break-all">
                {decoded.payload}
              </pre>
            </div>
          </div>
        </div>
      )}
      
      {!decoded && (
        <div className="p-8 text-center bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-gray-500 text-sm">Paste a JWT token above to see its decoded contents safely on your device.</p>
        </div>
      )}
    </div>
  )
}
