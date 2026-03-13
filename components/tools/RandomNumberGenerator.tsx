"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RefreshCw } from "lucide-react"

function cryptoRandomInt(min: number, max: number) {
  // inclusive min/max
  const lo = Math.min(min, max)
  const hi = Math.max(min, max)
  const range = hi - lo + 1
  if (range <= 0) return lo

  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return lo + (array[0] % range)
}

export default function RandomNumberGenerator() {
  const [min, setMin] = useState("1")
  const [max, setMax] = useState("100")
  const [value, setValue] = useState<number | null>(null)

  const parsed = useMemo(() => {
    const minN = Number(min)
    const maxN = Number(max)
    const valid = Number.isFinite(minN) && Number.isFinite(maxN)
    return { valid, minN, maxN }
  }, [min, max])

  function generate() {
    if (!parsed.valid) return
    setValue(cryptoRandomInt(parsed.minN, parsed.maxN))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass rounded-2xl p-6 border-white/10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Min</Label>
              <Input
                value={min}
                onChange={(e) => setMin(e.target.value)}
                inputMode="numeric"
                placeholder="1"
                className="rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Max</Label>
              <Input
                value={max}
                onChange={(e) => setMax(e.target.value)}
                inputMode="numeric"
                placeholder="100"
                className="rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generate}
            disabled={!parsed.valid}
            className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate
          </Button>

          {!parsed.valid && (
            <p className="text-sm text-red-300">Please enter valid numbers.</p>
          )}
        </Card>

        <Card className="glass rounded-2xl p-6 border-white/10">
          <p className="text-xs text-gray-400 mb-1">Result</p>
          <p className="text-4xl font-bold text-white">{value ?? "—"}</p>
          <p className="text-sm text-gray-500 mt-3">
            Generates a random integer between min and max (inclusive).
          </p>
        </Card>
      </div>
    </div>
  )
}

