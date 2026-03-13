"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eraser, Copy } from "lucide-react"
import { tryCopyToClipboard } from "@/components/tools/utils"

export default function HashGenerator() {
  const [input, setInput] = useState("")
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    async function generateHashes() {
      if (!input) {
        setHashes({})
        return
      }

      const encoder = new TextEncoder()
      const data = encoder.encode(input)

      const generateHash = async (algo: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512") => {
        try {
          const hashBuffer = await crypto.subtle.digest(algo, data)
          const hashArray = Array.from(new Uint8Array(hashBuffer))
          return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        } catch {
          return "Not supported"
        }
      }

      const [sha1, sha256, sha384, sha512] = await Promise.all([
        generateHash('SHA-1'),
        generateHash('SHA-256'),
        generateHash('SHA-384'),
        generateHash('SHA-512')
      ])

      setHashes({
        "SHA-1": sha1,
        "SHA-256": sha256,
        "SHA-384": sha384,
        "SHA-512": sha512,
      })
    }

    generateHashes()
  }, [input])

  async function copyHash(hashName: string, hashValue: string) {
    const ok = await tryCopyToClipboard(hashValue)
    if (!ok) return
    setCopied(hashName)
    setTimeout(() => setCopied(null), 1200)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Input Text</Label>
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
          placeholder="Type or paste text to hash..."
          className="min-h-[120px] rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-cyan-500/50"
        />
      </div>

      <div className="space-y-4">
        {["SHA-1", "SHA-256", "SHA-384", "SHA-512"].map((algo) => (
          <div key={algo} className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-cyan-400 font-semibold">{algo}</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => copyHash(algo, hashes[algo] || "")}
                disabled={!hashes[algo]}
                className="h-8 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
              >
                {copied === algo ? (
                  <span className="text-green-400 text-xs">Copied</span>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </Button>
            </div>
            <div className="bg-black/20 p-3 rounded-xl border border-white/5 overflow-x-auto">
              <code className="text-sm text-gray-300 break-all select-all font-mono">
                {hashes[algo] || <span className="text-gray-600 italic">Waiting for input...</span>}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
