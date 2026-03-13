"use client"

import { useState, useMemo } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eraser } from "lucide-react"

export default function RegexTester() {
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState("g")
  const [testString, setTestString] = useState("")

  const result = useMemo(() => {
    if (!pattern) return { ok: true, matches: [], error: null }
    try {
      let f = flags
      if (!f.includes('g')) f += 'g' // matchAll requires global flag
      const regex = new RegExp(pattern, f)
      
      const matches = Array.from(testString.matchAll(regex)).map(match => ({
        value: match[0],
        index: match.index,
        groups: match.groups || {}
      }))

      return { ok: true, matches, error: null }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Invalid Regex"
      return { ok: false, matches: [], error: message }
    }
  }, [pattern, flags, testString])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-2">
          <Label className="text-gray-300">Regular Expression</Label>
          <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-cyan-500">
            <span className="flex items-center px-4 text-cyan-500 font-mono font-bold bg-white/5 border-r border-white/10">
              /
            </span>
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$"
              className="border-0 bg-transparent text-white font-mono focus-visible:ring-0 rounded-none h-12"
            />
            <span className="flex items-center px-4 text-cyan-500 font-mono font-bold bg-white/5 border-l border-white/10">
              /
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Flags</Label>
          <Input
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="gmi"
            className="h-12 border-white/10 bg-white/5 text-white font-mono focus-visible:ring-1 focus-visible:ring-cyan-500 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Test String</Label>
          <button
            type="button"
            onClick={() => setTestString("")}
            className="text-xs text-gray-400 hover:text-white flex items-center transition-colors"
          >
            <Eraser className="w-3 h-3 mr-1" />
            Clear
          </button>
        </div>
        <Textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Paste string to test against the regex..."
          className="min-h-[150px] rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-mono focus-visible:ring-1 focus-visible:ring-cyan-500/50 resize-none"
        />
      </div>

      <div className="space-y-3 pt-4 border-t border-white/10">
        <Label className="text-gray-300">Matches Preview</Label>
        
        {!result.ok ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 font-mono text-sm">
            {result.error}
          </div>
        ) : !pattern ? (
          <div className="p-8 text-center bg-white/5 border border-white/10 rounded-xl text-gray-500 text-sm">
            Enter a regex pattern to see matches.
          </div>
        ) : result.matches.length === 0 ? (
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-sm font-mono">
            No matches found.
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-cyan-400 mb-2">
              Found {result.matches.length} match{result.matches.length === 1 ? '' : 'es'}
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
              {result.matches.map((m, i) => (
                <div key={i} className="bg-black/20 border border-white/10 rounded-xl p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-gray-500">Match {i + 1}</span>
                    <span className="text-xs text-gray-500">Index: {m.index}</span>
                  </div>
                  <div className="text-white font-mono break-all text-sm">{m.value}</div>
                  {Object.keys(m.groups).length > 0 && (
                    <div className="mt-2 text-xs border-t border-white/5 pt-2">
                      <span className="text-gray-400">Groups:</span>
                      <pre className="text-cyan-300 mt-1 break-all whitespace-pre-wrap">
                        {JSON.stringify(m.groups, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
