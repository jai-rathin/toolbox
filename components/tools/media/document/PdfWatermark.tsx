"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, FileText, RefreshCw, Loader2, Droplets, Info } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib"

type WatermarkPosition = "center" | "diagonal" | "top-left" | "top-right" | "bottom-left" | "bottom-right"

export default function PdfWatermark() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState("document")
  const [totalPages, setTotalPages] = useState(0)

  const [text, setText] = useState("CONFIDENTIAL")
  const [fontSize, setFontSize] = useState(48)
  const [opacity, setOpacity] = useState(0.15)
  const [color, setColor] = useState("#888888")
  const [position, setPosition] = useState<WatermarkPosition>("diagonal")

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

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    return { r, g, b }
  }

  const addWatermark = async () => {
    if (!pdfFile || !text.trim()) return
    setIsProcessing(true)
    setResultUrl(null)
    try {
      const ab = await pdfFile.arrayBuffer()
      const pdf = await PDFDocument.load(ab, { ignoreEncryption: true })
      const font = await pdf.embedFont(StandardFonts.HelveticaBold)
      const { r, g, b } = hexToRgb(color)
      const pages = pdf.getPages()

      for (const page of pages) {
        const { width, height } = page.getSize()
        const textWidth = font.widthOfTextAtSize(text, fontSize)

        let x: number, y: number, rotate: number | undefined

        switch (position) {
          case "center":
            x = (width - textWidth) / 2
            y = height / 2
            rotate = 0
            break
          case "diagonal":
            x = width / 2
            y = height / 2
            rotate = -45
            break
          case "top-left":
            x = 40; y = height - 60; rotate = 0; break
          case "top-right":
            x = width - textWidth - 40; y = height - 60; rotate = 0; break
          case "bottom-left":
            x = 40; y = 40; rotate = 0; break
          case "bottom-right":
            x = width - textWidth - 40; y = 40; rotate = 0; break
        }

        if (position === "diagonal") {
          // For diagonal, we center and rotate
          const rad = (rotate! * Math.PI) / 180
          page.drawText(text, {
            x: width / 2 - (textWidth * Math.cos(Math.abs(rad))) / 2,
            y: height / 2 - fontSize / 2,
            size: fontSize,
            font,
            color: rgb(r, g, b),
            opacity: opacity,
            rotate: degrees(rotate!),
          })
        } else {
          page.drawText(text, {
            x, y,
            size: fontSize,
            font,
            color: rgb(r, g, b),
            opacity: opacity,
          })
        }

        await new Promise((res) => setTimeout(res, 0))
      }

      const bytes = await pdf.save()
      const blob = new Blob([bytes as any], { type: "application/pdf" })
      setResultUrl(URL.createObjectURL(blob))
    } catch (err) {
      console.error(err)
      alert("Error adding watermark.")
    } finally { setIsProcessing(false) }
  }

  const startOver = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setPdfFile(null); setPdfUrl(null); setResultUrl(null); setTotalPages(0)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!pdfUrl ? (
        <FileUploader onUpload={handleUpload} description="Upload a PDF to add a watermark" accept="application/pdf" icon={<Droplets className="w-8 h-8" />} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            <div className="space-y-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-purple-400" /> Add Watermark
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
                <Label className="text-gray-300 text-xs uppercase tracking-wider">Watermark Text</Label>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white text-sm outline-none focus:border-purple-500/50" disabled={isProcessing} placeholder="e.g. CONFIDENTIAL" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-xs uppercase tracking-wider">Font Size</Label>
                  <input type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value) || 24)} min={12} max={120} className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white text-sm outline-none focus:border-purple-500/50" disabled={isProcessing} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-xs uppercase tracking-wider">Opacity</Label>
                  <input type="range" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} min={0.05} max={0.8} step={0.05} className="w-full h-10 accent-purple-500" disabled={isProcessing} />
                  <span className="text-xs text-gray-500">{Math.round(opacity * 100)}%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-xs uppercase tracking-wider">Color</Label>
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-1 cursor-pointer" disabled={isProcessing} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-xs uppercase tracking-wider">Position</Label>
                  <select value={position} onChange={(e) => setPosition(e.target.value as WatermarkPosition)} className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white text-sm outline-none focus:border-purple-500/50" disabled={isProcessing}>
                    <option value="diagonal" className="bg-gray-900">Diagonal</option>
                    <option value="center" className="bg-gray-900">Center</option>
                    <option value="top-left" className="bg-gray-900">Top Left</option>
                    <option value="top-right" className="bg-gray-900">Top Right</option>
                    <option value="bottom-left" className="bg-gray-900">Bottom Left</option>
                    <option value="bottom-right" className="bg-gray-900">Bottom Right</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              {!resultUrl ? (
                <Button onClick={addWatermark} disabled={isProcessing || !text.trim()} className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12">
                  {isProcessing ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding Watermark...</>) : "Add Watermark"}
                </Button>
              ) : (
                <Button onClick={() => { const a = document.createElement("a"); a.download = `${fileName}-watermarked.pdf`; a.href = resultUrl; a.click() }} className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 h-12">
                  <Download className="w-4 h-4 mr-2" /> Download Watermarked PDF
                </Button>
              )}
              <Button onClick={startOver} variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-10" disabled={isProcessing}>
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </Button>
            </div>
          </div>

          <div className="md:col-span-8 bg-black/20 border border-white/10 rounded-3xl p-4 min-h-[400px]">
            <div className="w-full h-[600px] flex flex-col gap-4">
              <h4 className="text-sm font-medium text-gray-400 pl-2">{resultUrl ? "Watermarked PDF" : "Original PDF"}</h4>
              <iframe src={resultUrl || pdfUrl!} className="w-full h-full rounded-xl bg-white/5 border border-white/10" title="PDF Preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
