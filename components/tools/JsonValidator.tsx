"use client"

import { useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eraser, CheckCircle2, XCircle } from "lucide-react"

export default function JsonValidator() {
  const [input, setInput] = useState("")

  const result = useMemo(() => {
    if (!input.trim()) return null
    try {
      JSON.parse(input)
      return { isValid: true, error: null }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Invalid JSON"
      return { isValid: false, error: message }
    }
  }, [input])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-gray-300">JSON Input</Label>
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
        placeholder='{"name": "ToolBox", "valid": true}'
        className="min-h-[300px] rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-cyan-500/50 font-mono"
      />

      {result && (
        <Card className={`rounded-2xl p-6 border ${result.isValid ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
          <div className="flex items-start gap-4">
            {result.isValid ? (
              <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className={`font-semibold ${result.isValid ? 'text-green-300' : 'text-red-300'}`}>
                {result.isValid ? "Valid JSON" : "Invalid JSON"}
              </h3>
              {!result.isValid && result.error && (
                <p className="text-red-200 mt-1 text-sm font-mono break-words">
                  {result.error}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
