"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Copy, Wand2 } from "lucide-react"
import { tryCopyToClipboard } from "@/components/tools/utils"

const LOREM_SENTENCES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Curabitur pretium tincidunt lacus.",
  "Nulla gravida orci a odio.",
  "Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
  "Integer in mauris eu nibh euismod gravida.",
  "Duis ac tellus et risus vulputate vehicula.",
  "Donec lobortis risus a elit.",
  "Etiam pellentesque aliquet tellus.",
  "Phasellus pharetra nulla ac diam."
]

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState("3")
  const [type, setType] = useState<"paragraphs" | "sentences">("paragraphs")
  const [text, setText] = useState("")
  const [copied, setCopied] = useState(false)

  function generateText() {
    const num = Math.min(Math.max(parseInt(count) || 1, 1), 100)
    let result = []

    if (type === "sentences") {
      for (let i = 0; i < num; i++) {
        result.push(LOREM_SENTENCES[i % LOREM_SENTENCES.length])
      }
      setText(result.join(" "))
    } else {
      for (let p = 0; p < num; p++) {
        let paragraph = []
        // random number of sentences per paragraph (3 to 7)
        const sentencesInP = Math.floor(Math.random() * 5) + 3
        for (let s = 0; s < sentencesInP; s++) {
          const randomIndex = Math.floor(Math.random() * LOREM_SENTENCES.length)
          paragraph.push(LOREM_SENTENCES[randomIndex])
        }
        // Force the first paragraph to start with standard Lorem Ipsum
        if (p === 0 && paragraph[0] !== LOREM_SENTENCES[0]) {
           paragraph.unshift(LOREM_SENTENCES[0])
        }
        result.push(paragraph.join(" "))
      }
      setText(result.join("\n\n"))
    }
  }

  async function copyText() {
    if (!text) return
    const ok = await tryCopyToClipboard(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-2 flex-1 min-w-[200px]">
          <Label className="text-gray-300">Length (Max 100)</Label>
          <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-cyan-500">
            <Input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="border-0 bg-transparent text-white font-mono focus-visible:ring-0 rounded-none h-12"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="bg-black/40 text-gray-300 px-4 border-l border-white/10 focus:outline-none"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
            </select>
          </div>
        </div>
        <Button
          type="button"
          onClick={generateText}
          className="bg-cyan-500 hover:bg-cyan-600 text-white h-12 px-6 rounded-xl font-medium shadow-lg shadow-cyan-500/20 shrink-0"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Generate
        </Button>
      </div>

      {text && (
        <div className="space-y-3 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300">Generated text</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyText}
              className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <Textarea
            value={text}
            readOnly
            className="min-h-[300px] rounded-2xl bg-white/5 border-white/10 text-white focus-visible:ring-0 focus-visible:border-cyan-500/50 resize-none leading-relaxed px-4 py-4"
          />
        </div>
      )}
    </div>
  )
}
