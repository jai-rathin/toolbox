"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eraser, Copy, Wand2 } from "lucide-react"
import { tryCopyToClipboard } from "@/components/tools/utils"

export default function TextCleaner() {
  const [text, setText] = useState("")
  const [copied, setCopied] = useState(false)

  const [options, setOptions] = useState({
    trim: true,
    removeExtraSpaces: true,
    removeEmptyLines: true,
    removeHtml: false,
    lowerCase: false,
  })

  function processText() {
    let result = text

    if (options.removeHtml) {
      result = result.replace(/<[^>]*>?/gm, '')
    }
    if (options.removeExtraSpaces) {
      result = result.replace(/[ \t]{2,}/g, ' ')
    }
    if (options.removeEmptyLines) {
      result = result.replace(/^\s*[\r\n]/gm, '')
    }
    if (options.trim) {
      result = result.split('\n').map(line => line.trim()).join('\n')
    }
    if (options.lowerCase) {
      result = result.toLowerCase()
    }
    setText(result)
  }

  async function copyText() {
    const ok = await tryCopyToClipboard(text)
    if (!ok) return
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const toggleOption = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
          <input type="checkbox" checked={options.trim} onChange={() => toggleOption("trim")} className="form-checkbox bg-white/10 border-white/20 text-cyan-500 rounded focus:ring-cyan-500/50 focus:ring-offset-0" />
          Trim whitespace
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
          <input type="checkbox" checked={options.removeExtraSpaces} onChange={() => toggleOption("removeExtraSpaces")} className="form-checkbox bg-white/10 border-white/20 text-cyan-500 rounded focus:ring-cyan-500/50 focus:ring-offset-0" />
          Remove extra spaces
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
          <input type="checkbox" checked={options.removeEmptyLines} onChange={() => toggleOption("removeEmptyLines")} className="form-checkbox bg-white/10 border-white/20 text-cyan-500 rounded focus:ring-cyan-500/50 focus:ring-offset-0" />
          Remove empty lines
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
          <input type="checkbox" checked={options.removeHtml} onChange={() => toggleOption("removeHtml")} className="form-checkbox bg-white/10 border-white/20 text-cyan-500 rounded focus:ring-cyan-500/50 focus:ring-offset-0" />
          Remove HTML tags
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
          <input type="checkbox" checked={options.lowerCase} onChange={() => toggleOption("lowerCase")} className="form-checkbox bg-white/10 border-white/20 text-cyan-500 rounded focus:ring-cyan-500/50 focus:ring-offset-0" />
          To Lowercase
        </label>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Input Text</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={processText}
              disabled={!text}
              className="rounded-full bg-cyan-500/20 text-cyan-300 border-cyan-500/50 hover:bg-cyan-500/30"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Clean
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyText}
              disabled={!text}
              className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setText("")}
              disabled={!text}
              className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
            >
              <Eraser className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste messy text here..."
          className="min-h-[300px] rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-cyan-500/50"
        />
      </div>
    </div>
  )
}
