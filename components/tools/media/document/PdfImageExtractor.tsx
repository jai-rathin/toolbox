"use client"

import "@/lib/promise-polyfill"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, FileText, RefreshCw, Loader2, Image as ImageIcon, Archive, Info } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"

interface ExtractedImage {
  id: string
  url: string
  pageNumber: number
}

export default function PdfImageExtractor() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState("document")
  const [totalPages, setTotalPages] = useState(0)

  const [isProcessing, setIsProcessing] = useState(false)
  const [images, setImages] = useState<ExtractedImage[]>([])
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [isZipping, setIsZipping] = useState(false)

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf") { alert("Please upload a valid PDF file."); return }
    try {
      const pdfjsLib = await import("pdfjs-dist")
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
      const ab = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: ab }).promise
      setTotalPages(pdf.numPages)
    } catch { setTotalPages(0) }
    setPdfFile(file)
    setPdfUrl(URL.createObjectURL(file))
    setImages([])
    const dot = file.name.lastIndexOf(".")
    setFileName(dot > 0 ? file.name.substring(0, dot) : file.name)
  }

  const extractImages = async () => {
    if (!pdfFile) return
    setIsProcessing(true)
    setImages([])
    try {
      const pdfjsLib = await import("pdfjs-dist")
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
      const ab = await pdfFile.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: ab }).promise

      setProgress({ current: 0, total: pdf.numPages })
      const extracted: ExtractedImage[] = []

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress({ current: i, total: pdf.numPages })
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 2 })
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) continue
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise
        extracted.push({
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10),
          url: canvas.toDataURL("image/png"),
          pageNumber: i,
        })
        await new Promise((r) => setTimeout(r, 0))
      }
      setImages(extracted)
    } catch (err) {
      console.error(err)
      alert("Error extracting images from PDF.")
    } finally {
      setIsProcessing(false)
      setProgress({ current: 0, total: 0 })
    }
  }

  const downloadSingle = (img: ExtractedImage) => {
    const a = document.createElement("a")
    a.download = `${fileName}-page-${img.pageNumber}.png`
    a.href = img.url
    a.click()
  }

  const downloadAllZip = async () => {
    if (images.length === 0) return
    setIsZipping(true)
    try {
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()
      for (const img of images) {
        const res = await fetch(img.url)
        const blob = await res.blob()
        zip.file(`${fileName}-page-${img.pageNumber}.png`, blob)
      }
      const content = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(content)
      const a = document.createElement("a")
      a.download = `${fileName}-images.zip`
      a.href = url
      a.click()
      URL.revokeObjectURL(url)
    } catch { alert("Error creating ZIP.") }
    finally { setIsZipping(false) }
  }

  const startOver = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    setPdfFile(null); setPdfUrl(null); setImages([])
    setTotalPages(0)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!pdfUrl ? (
        <FileUploader onUpload={handleUpload} description="Upload a PDF to extract page images" accept="application/pdf" icon={<ImageIcon className="w-8 h-8" />} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            <div className="space-y-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-400" /> Extract Images
              </h3>
              {totalPages > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 rounded-lg px-3 py-2">
                  <Info className="w-3.5 h-3.5" />
                  <span>{fileName}.pdf · {totalPages} page{totalPages > 1 ? "s" : ""} · {(pdfFile!.size / 1024 / 1024).toFixed(1)} MB</span>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              {isProcessing && progress.total > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Extracting page {progress.current}/{progress.total}</span>
                    <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300" style={{ width: `${(progress.current / progress.total) * 100}%` }} />
                  </div>
                </div>
              )}

              {images.length === 0 ? (
                <Button onClick={extractImages} disabled={isProcessing} className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12">
                  {isProcessing ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Extracting...</>) : "Extract All Page Images"}
                </Button>
              ) : (
                <Button onClick={downloadAllZip} disabled={isZipping} className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 h-12">
                  {isZipping ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating ZIP...</>) : (<><Archive className="w-4 h-4 mr-2" /> Download All as ZIP ({images.length})</>)}
                </Button>
              )}
              <Button onClick={startOver} variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-10" disabled={isProcessing}>
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </Button>
            </div>
          </div>

          <div className="md:col-span-8 bg-black/20 border border-white/10 rounded-3xl p-6 min-h-[400px]">
            <h4 className="text-sm font-medium text-gray-400 mb-4">
              {images.length > 0 ? `Extracted Images (${images.length} pages)` : "PDF Preview"}
            </h4>
            {images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 pb-4">
                {images.map((img) => (
                  <div key={img.id} className="group relative flex flex-col gap-2 p-2 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/50 transition-all">
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded shadow z-10">Page {img.pageNumber}</div>
                    <img src={img.url} alt={`Page ${img.pageNumber}`} className="w-full aspect-[1/1.4] object-contain bg-white rounded-lg shadow-inner" />
                    <Button onClick={() => downloadSingle(img)} size="sm" className="w-full bg-white/10 hover:bg-purple-500 text-white transition-colors">
                      <Download className="w-3 h-3 mr-2" /> Save
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-[600px]">
                <iframe src={pdfUrl!} className="w-full h-full rounded-xl bg-white/5 border border-white/10" title="PDF Preview" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
