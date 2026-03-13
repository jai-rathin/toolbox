"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eraser } from "lucide-react"

export default function TextDiffChecker() {
  const [text1, setText1] = useState("")
  const [text2, setText2] = useState("")

  function computeSingleLineDiff(oldText: string, newText: string) {
    if (oldText === newText) {
      return <span>{oldText}</span>
    }
    return (
      <div className="flex flex-col text-xs space-y-1">
        <div className="bg-red-500/20 text-red-300 p-1 rounded">- {oldText || <span className="opacity-50 italic">empty</span>}</div>
        <div className="bg-green-500/20 text-green-300 p-1 rounded">+ {newText || <span className="opacity-50 italic">empty</span>}</div>
      </div>
    )
  }

  const lines1 = text1.split('\n')
  const lines2 = text2.split('\n')
  const maxLines = Math.max(lines1.length, lines2.length)
  
  const diffs = []
  for (let i = 0; i < maxLines; i++) {
    const l1 = lines1[i] ?? ""
    const l2 = lines2[i] ?? ""
    diffs.push(
      <div key={i} className="flex gap-4 p-2 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
        <div className="text-gray-500 select-none w-8 text-right text-xs pt-1">{i + 1}</div>
        <div className="flex-1 font-mono text-sm break-all">
          {computeSingleLineDiff(l1, l2)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300">Original Text</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setText1("")}
              disabled={!text1}
              className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
            >
              <Eraser className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
          <Textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Paste original text here..."
            className="min-h-[200px] rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-cyan-500/50"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300">Changed Text</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setText2("")}
              disabled={!text2}
              className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
            >
              <Eraser className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
          <Textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Paste changed text here..."
            className="min-h-[200px] rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-cyan-500/50"
          />
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-white/10">
        <Label className="text-gray-300">Line-by-Line Difference</Label>
        <div className="glass rounded-2xl border border-white/10 overflow-hidden bg-black/20">
          {(text1 || text2) ? (
            <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
              {diffs}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">
              Provide both original and changed text to see the diff.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
