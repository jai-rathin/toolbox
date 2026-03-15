"use client"

import "@/lib/promise-polyfill"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Download, FileText, RefreshCw, Loader2,
  Image as ImageIcon, Archive, Info
} from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"

interface ExtractedImage {
  id: string
  url: string
  pageNumber: number
}

function parsePageSelection(input: string, maxPages: number): number[] {
  if (!input.trim()) return []
  const pages = new Set<number>()
  const parts = input.split(",")
  for (const part of parts) {
    const trimmed = part.trim()
    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-")
      const start = parseInt(startStr, 10)
      const end = parseInt(endStr, 10)
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
          pages.add(i)
        }
      }
    } else {
      const num = parseInt(trimmed, 10)
      if (!isNaN(num) && num >= 1 && num <= maxPages) {
        pages.add(num)
      }
    }
  }
  return Array.from(pages).sort((a, b) => a - b)
}

export default function PdfToImage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState("document")
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [totalPages, setTotalPages] = useState(0)

  const [isProcessing, setIsProcessing] = useState(false)
  const [images, setImages] = useState<ExtractedImage[]>([])
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  const [quality, setQuality] = useState(2)
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/png")
  const [pageMode, setPageMode] = useState<"all" | "custom">("all")
  const [customPages, setCustomPages] = useState("")

  const [isZipping, setIsZipping] = useState(false)

  // Cleanup
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }
  }, [])

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.")
      return
    }
    const url = URL.createObjectURL(file)
    setPdfUrl(url)
    setPdfFile(file)
    setImages([])

    const nameExt = file.name.lastIndexOf(".")
    setFileName(nameExt > 0 ? file.name.substring(0, nameExt) : file.name)

    // Read page count
    try {
      const pdfjsLib = await import("pdfjs-dist")
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      setTotalPages(pdf.numPages)
    } catch {
      setTotalPages(0)
    }
  }

  const convertToImages = async () => {
    if (!pdfFile) return
    setIsProcessing(true)
    setImages([])

    try {
      const pdfjsLib = await import("pdfjs-dist")
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      let pagesToRender: number[]
      if (pageMode === "custom" && customPages.trim()) {
        pagesToRender = parsePageSelection(customPages, pdf.numPages)
        if (pagesToRender.length === 0) {
          alert("Invalid page selection. Use comma-separated numbers or ranges like 1,3,5-8")
          setIsProcessing(false)
          return
        }
      } else {
        pagesToRender = Array.from({ length: pdf.numPages }, (_, i) => i + 1)
      }

      setProgress({ current: 0, total: pagesToRender.length })
      const extractedImgs: ExtractedImage[] = []

      for (let idx = 0; idx < pagesToRender.length; idx++) {
        const pageNum = pagesToRender[idx]
        setProgress({ current: idx + 1, total: pagesToRender.length })

        const page = await pdf.getPage(pageNum)
        const viewport = page.getViewport({ scale: quality })

        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        if (!context) continue

        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({ canvasContext: context, viewport }).promise
        const dataUrl = canvas.toDataURL(format, format === "image/jpeg" ? 0.92 : undefined)

        extractedImgs.push({
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10),
          url: dataUrl,
          pageNumber: pageNum,
        })

        // Yield to UI
        await new Promise((r) => setTimeout(r, 0))
      }

      setImages(extractedImgs)
    } catch (err) {
      console.error(err)
      alert("Error extracting images. The PDF might be corrupted or locked.")
    } finally {
      setIsProcessing(false)
      setProgress({ current: 0, total: 0 })
    }
  }

  const downloadSingle = (img: ExtractedImage) => {
    const link = document.createElement("a")
    const ext = format === "image/jpeg" ? "jpg" : "png"
    link.download = `${fileName}-page-${img.pageNumber}.${ext}`
    link.href = img.url
    link.click()
  }

  const downloadAllAsZip = async () => {
    if (images.length === 0) return
    setIsZipping(true)

    try {
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()
      const ext = format === "image/jpeg" ? "jpg" : "png"

      for (const img of images) {
        // Convert data URL to blob
        const response = await fetch(img.url)
        const blob = await response.blob()
        zip.file(`${fileName}-page-${img.pageNumber}.${ext}`, blob)
      }

      const content = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(content)
      const link = document.createElement("a")
      link.download = `${fileName}-images.zip`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert("Error creating ZIP file.")
    } finally {
      setIsZipping(false)
    }
  }

  const startOver = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    setPdfUrl(null)
    setPdfFile(null)
    setImages([])
    setTotalPages(0)
    setCustomPages("")
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!pdfUrl ? (
        <FileUploader
          onUpload={handleUpload}
          description="Upload a PDF to extract pages as images"
          accept="application/pdf"
          icon={<FileText className="w-8 h-8" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* ─── Sidebar ─── */}
          <div className="md:col-span-4 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            <div className="space-y-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-400" /> PDF to Image
              </h3>

              {/* File info */}
              {totalPages > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 rounded-lg px-3 py-2">
                  <Info className="w-3.5 h-3.5" />
                  <span>{fileName}.pdf · {totalPages} page{totalPages > 1 ? "s" : ""} · {(pdfFile!.size / 1024 / 1024).toFixed(1)} MB</span>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              {/* Quality */}
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs uppercase tracking-wider">Quality</Label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white text-sm outline-none focus:border-purple-500/50 transition-colors"
                  disabled={isProcessing}
                >
                  <option value="1" className="bg-gray-900">Low (1× — fastest)</option>
                  <option value="2" className="bg-gray-900">Medium (2× — recommended)</option>
                  <option value="3" className="bg-gray-900">High (3× — best quality)</option>
                </select>
              </div>

              {/* Format */}
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs uppercase tracking-wider">Format</Label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as "image/png" | "image/jpeg")}
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white text-sm outline-none focus:border-purple-500/50 transition-colors"
                  disabled={isProcessing}
                >
                  <option value="image/png" className="bg-gray-900">PNG (lossless)</option>
                  <option value="image/jpeg" className="bg-gray-900">JPG (smaller file)</option>
                </select>
              </div>

              {/* Page selection */}
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs uppercase tracking-wider">Pages</Label>
                <select
                  value={pageMode}
                  onChange={(e) => setPageMode(e.target.value as "all" | "custom")}
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white text-sm outline-none focus:border-purple-500/50 transition-colors"
                  disabled={isProcessing}
                >
                  <option value="all" className="bg-gray-900">All Pages</option>
                  <option value="custom" className="bg-gray-900">Select Pages</option>
                </select>
                {pageMode === "custom" && (
                  <input
                    type="text"
                    value={customPages}
                    onChange={(e) => setCustomPages(e.target.value)}
                    placeholder="e.g. 1,3,5-8"
                    className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white text-sm outline-none focus:border-purple-500/50 transition-colors placeholder:text-gray-600"
                    disabled={isProcessing}
                  />
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              {/* Progress */}
              {isProcessing && progress.total > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Rendering page {progress.current} of {progress.total}</span>
                    <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {images.length === 0 ? (
                <Button
                  onClick={convertToImages}
                  disabled={isProcessing}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Extracting Pages...
                    </>
                  ) : (
                    "Convert to Images"
                  )}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={downloadAllAsZip}
                    disabled={isZipping}
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 h-12"
                  >
                    {isZipping ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating ZIP...
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4 mr-2" /> Download All as ZIP ({images.length})
                      </>
                    )}
                  </Button>
                </div>
              )}
              <Button
                onClick={startOver}
                variant="ghost"
                className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-10"
                disabled={isProcessing}
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </Button>
            </div>
          </div>

          {/* ─── Main area ─── */}
          <div className="md:col-span-8 bg-black/20 border border-white/10 rounded-3xl p-6 min-h-[400px]">
            <h4 className="text-sm font-medium text-gray-400 mb-4">
              {images.length > 0
                ? `Extracted Images (${images.length} page${images.length > 1 ? "s" : ""})`
                : "Original PDF Preview"}
            </h4>

            {images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 pb-4">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="group relative flex flex-col gap-2 p-2 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/50 transition-all"
                  >
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded shadow z-10">
                      Page {img.pageNumber}
                    </div>
                    <img
                      src={img.url}
                      alt={`Page ${img.pageNumber}`}
                      className="w-full aspect-[1/1.4] object-contain bg-white rounded-lg shadow-inner"
                    />
                    <Button
                      onClick={() => downloadSingle(img)}
                      size="sm"
                      className="w-full bg-white/10 hover:bg-purple-500 text-white transition-colors"
                    >
                      <Download className="w-3 h-3 mr-2" /> Save
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-[600px]">
                <iframe
                  src={pdfUrl!}
                  className="w-full h-full rounded-xl bg-white/5 border border-white/10"
                  title="PDF Preview"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
