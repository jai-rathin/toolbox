"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, FileText, RefreshCw, Loader2, RotateCw, Info } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { PDFDocument, degrees } from "pdf-lib"

type RotationAngle = 90 | 180 | 270
type RotateMode = "all" | "custom"

function parsePageSelection(input: string, maxPages: number): number[] {
  if (!input.trim()) return []
  const pages = new Set<number>()
  for (const part of input.split(",")) {
    const trimmed = part.trim()
    if (trimmed.includes("-")) {
      const [s, e] = trimmed.split("-")
      const start = parseInt(s, 10), end = parseInt(e, 10)
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) pages.add(i)
      }
    } else {
      const num = parseInt(trimmed, 10)
      if (!isNaN(num) && num >= 1 && num <= maxPages) pages.add(num)
    }
  }
  return Array.from(pages).sort((a, b) => a - b)
}

export default function PdfRotator() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState("document")
  const [totalPages, setTotalPages] = useState(0)

  const [angle, setAngle] = useState<RotationAngle>(90)
  const [mode, setMode] = useState<RotateMode>("all")
  const [customPages, setCustomPages] = useState("")

  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf") { alert("Please upload a valid PDF file."); return }
    try {
      const ab = await file.arrayBuffer()
      const pdf = await PDFDocument.load(ab, { ignoreEncryption: true })
      setTotalPages(pdf.getPageCount())
      setPdfFile(file)
      setPdfUrl(URL.createObjectURL(file))
      setResultUrl(null)
      const dot = file.name.lastIndexOf(".")
      setFileName(dot > 0 ? file.name.substring(0, dot) : file.name)
    } catch { alert("Failed to read PDF.") }
  }

  const rotatePdf = async () => {
    if (!pdfFile) return
    setIsProcessing(true)
    setResultUrl(null)
    try {
      const ab = await pdfFile.arrayBuffer()
      const pdf = await PDFDocument.load(ab, { ignoreEncryption: true })
      const pages = pdf.getPages()

      let targetIndices: number[]
      if (mode === "custom" && customPages.trim()) {
        targetIndices = parsePageSelection(customPages, pages.length).map(p => p - 1)
        if (targetIndices.length === 0) { alert("Invalid page selection."); setIsProcessing(false); return }
      } else {
        targetIndices = pages.map((_, i) => i)
      }

      for (const idx of targetIndices) {
        const page = pages[idx]
        const current = page.getRotation().angle
        page.setRotation(degrees(current + angle))
      }

      const bytes = await pdf.save()
      const blob = new Blob([bytes as any], { type: "application/pdf" })
      setResultUrl(URL.createObjectURL(blob))
    } catch (err) {
      console.error(err)
      alert("Error rotating PDF.")
    } finally { setIsProcessing(false) }
  }

  const startOver = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setPdfFile(null); setPdfUrl(null); setResultUrl(null); setTotalPages(0); setCustomPages("")
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!pdfUrl ? (
        <FileUploader onUpload={handleUpload} description="Upload a PDF to rotate pages" accept="application/pdf" icon={<RotateCw className="w-8 h-8" />} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            <div className="space-y-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-purple-400" /> Rotate PDF
              </h3>
              {totalPages > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 rounded-lg px-3 py-2">
                  <Info className="w-3.5 h-3.5" />
                  <span>{fileName}.pdf · {totalPages} page{totalPages > 1 ? "s" : ""}</span>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs uppercase tracking-wider">Rotation</Label>
                <select value={angle} onChange={(e) => setAngle(parseInt(e.target.value) as RotationAngle)} className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white text-sm outline-none focus:border-purple-500/50" disabled={isProcessing}>
                  <option value="90" className="bg-gray-900">90° Clockwise</option>
                  <option value="180" className="bg-gray-900">180°</option>
                  <option value="270" className="bg-gray-900">90° Counter-clockwise</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs uppercase tracking-wider">Pages</Label>
                <select value={mode} onChange={(e) => setMode(e.target.value as RotateMode)} className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white text-sm outline-none focus:border-purple-500/50" disabled={isProcessing}>
                  <option value="all" className="bg-gray-900">All Pages</option>
                  <option value="custom" className="bg-gray-900">Select Pages</option>
                </select>
                {mode === "custom" && (
                  <input type="text" value={customPages} onChange={(e) => setCustomPages(e.target.value)} placeholder="e.g. 1,3,5-8" className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white text-sm outline-none focus:border-purple-500/50 placeholder:text-gray-600" disabled={isProcessing} />
                )}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              {!resultUrl ? (
                <Button onClick={rotatePdf} disabled={isProcessing} className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12">
                  {isProcessing ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Rotating...</>) : "Rotate PDF"}
                </Button>
              ) : (
                <Button onClick={() => { const a = document.createElement("a"); a.download = `${fileName}-rotated.pdf`; a.href = resultUrl; a.click() }} className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 h-12">
                  <Download className="w-4 h-4 mr-2" /> Download Rotated PDF
                </Button>
              )}
              <Button onClick={startOver} variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-10" disabled={isProcessing}>
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </Button>
            </div>
          </div>

          <div className="md:col-span-8 bg-black/20 border border-white/10 rounded-3xl p-4 min-h-[400px]">
            <div className="w-full h-[600px] flex flex-col gap-4">
              <h4 className="text-sm font-medium text-gray-400 pl-2">{resultUrl ? "Rotated PDF" : "Original PDF"}</h4>
              <iframe src={resultUrl || pdfUrl!} className="w-full h-full rounded-xl bg-white/5 border border-white/10" title="PDF Preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
