"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Copy, RefreshCw, ShieldCheck } from "lucide-react"

const CHARSETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
} as const

function randomInt(maxExclusive: number) {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return array[0] % maxExclusive
}

function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function generatePassword(options: {
  length: number
  lower: boolean
  upper: boolean
  digits: boolean
  symbols: boolean
}) {
  const enabled: Array<keyof typeof CHARSETS> = []
  if (options.lower) enabled.push("lower")
  if (options.upper) enabled.push("upper")
  if (options.digits) enabled.push("digits")
  if (options.symbols) enabled.push("symbols")

  if (enabled.length === 0 || options.length <= 0) return ""

  const pools = enabled.map((k) => CHARSETS[k])
  const all = pools.join("")
  const out: string[] = []

  // Ensure at least one from each selected pool (when length allows).
  for (const pool of pools) {
    if (out.length >= options.length) break
    out.push(pool[randomInt(pool.length)])
  }

  while (out.length < options.length) {
    out.push(all[randomInt(all.length)])
  }

  return shuffle(out).join("")
}

function estimateStrength(password: string) {
  if (!password) return { label: "—", score: 0 }

  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasDigit = /\d/.test(password)
  const hasSymbol = /[^A-Za-z0-9]/.test(password)
  const variety = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length

  const length = password.length
  const score =
    (length >= 16 ? 3 : length >= 12 ? 2 : length >= 8 ? 1 : 0) + variety

  if (score >= 6) return { label: "Strong", score: 3 }
  if (score >= 4) return { label: "Good", score: 2 }
  if (score >= 2) return { label: "Weak", score: 1 }
  return { label: "Very weak", score: 0 }
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(12)
  const [lower, setLower] = useState(true)
  const [upper, setUpper] = useState(true)
  const [digits, setDigits] = useState(true)
  const [symbols, setSymbols] = useState(false)
  const [password, setPassword] = useState("")
  const [copied, setCopied] = useState(false)

  const strength = useMemo(() => estimateStrength(password), [password])

  function regenerate() {
    // Always generate with at least letters + numbers by default.
    setPassword(generatePassword({ length, lower, upper, digits, symbols }))
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore clipboard errors
    }
  }

  return (
    <div className="space-y-6">
      <Card className="glass rounded-2xl p-5 border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Strength</p>
              <p className="text-white font-semibold">{strength.label}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={regenerate}
              className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copy}
              disabled={!password}
              className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass rounded-2xl p-6 border-white/10 space-y-5">
          <div className="space-y-2">
            <Label className="text-gray-300">Password</Label>
            <Input
              value={password}
              readOnly
              placeholder="Click Generate"
              className="rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300">Length</Label>
              <span className="text-sm text-gray-400">{length}</span>
            </div>
            <Slider
              value={[length]}
              onValueChange={(v) => setLength(v[0] ?? 12)}
              min={8}
              max={32}
              step={1}
            />
          </div>
        </Card>

        <Card className="glass rounded-2xl p-6 border-white/10 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-white font-medium">Lowercase</p>
              <p className="text-sm text-gray-400">a-z</p>
            </div>
            <Switch checked={lower} onCheckedChange={setLower} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-white font-medium">Uppercase</p>
              <p className="text-sm text-gray-400">A-Z</p>
            </div>
            <Switch checked={upper} onCheckedChange={setUpper} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-white font-medium">Numbers</p>
              <p className="text-sm text-gray-400">0-9</p>
            </div>
            <Switch checked={digits} onCheckedChange={setDigits} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-white font-medium">Symbols</p>
              <p className="text-sm text-gray-400">!@#$…</p>
            </div>
            <Switch checked={symbols} onCheckedChange={setSymbols} />
          </div>

          <p className="text-xs text-gray-500 pt-1">
            Default is a 12 character password with letters and numbers.
          </p>
        </Card>
      </div>
    </div>
  )
}

