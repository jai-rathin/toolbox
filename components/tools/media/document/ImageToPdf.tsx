"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Download, RefreshCw, Loader2, Image as ImageIcon,
  Trash2, GripVertical, ChevronUp, ChevronDown, FileText
} from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { PDFDocument } from "pdf-lib"

interface ImageFile {
  id: string
  file: File
  name: string
  url: string
}

type PageSize = "fit" | "a4" | "letter"
type Orientation = "auto" | "portrait" | "landscape"
type Margin = "none" | "small" | "medium" | "large"

const PAGE_SIZES = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
}

const MARGINS: Record<Margin, number> = {
  none: 0,
  small: 20,
  medium: 40,
  large: 60,
}

async function convertToSupportedFormat(file: File): Promise<{ bytes: ArrayBuffer; type: "image/jpeg" | "image/png" }> {
  const isNative = file.type === "image/jpeg" || file.type === "image/png"
  if (isNative) {
    return { bytes: await file.arrayBuffer(), type: file.type as "image/jpeg" | "image/png" }
  }
  // Convert WebP or other formats to PNG via canvas
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext("2d")
      if (!ctx) return reject(new Error("Cannot get canvas context"))
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Canvas toBlob failed"))
          blob.arrayBuffer().then((ab) => resolve({ bytes: ab, type: "image/png" }))
        },
        "image/png",
        1.0
      )
    }
    img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`))
    img.src = URL.createObjectURL(file)
  })
}

export default function ImageToPdf() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  // Options
  const [pageSize, setPageSize] = useState<PageSize>("fit")
  const [orientation, setOrientation] = useState<Orientation>("auto")
  const [margin, setMargin] = useState<Margin>("none")

  // Drag reorder state
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url))
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [])

  const handleUpload = useCallback((file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return
    }
    setImages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10),
        file,
        name: file.name,
        url: URL.createObjectURL(file),
      },
    ])
    setResultUrl(null)
  }, [])

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id)
      if (img) URL.revokeObjectURL(img.url)
      return prev.filter((i) => i.id !== id)
    })
    setResultUrl(null)
  }

  const moveImage = (index: number, direction: "up" | "down") => {
    setImages((prev) => {
      const next = [...prev]
      const swap = direction === "up" ? index - 1 : index + 1
      if (swap < 0 || swap >= next.length) return prev
      ;[next[index], next[swap]] = [next[swap], next[index]]
      return next
    })
    setResultUrl(null)
  }

  // Drag-to-reorder handlers
  const onDragStart = (index: number) => setDragIndex(index)
  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }
  const onDragEnd = () => {
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      setImages((prev) => {
        const next = [...prev]
        const [moved] = next.splice(dragIndex, 1)
        next.splice(dragOverIndex, 0, moved)
        return next
      })
      setResultUrl(null)
    }
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const generatePdf = async () => {
    if (images.length === 0) return
    setIsProcessing(true)
    setResultUrl(null)
    setProgress({ current: 0, total: images.length })

    try {
      const pdfDoc = await PDFDocument.create()
      const marginPt = MARGINS[margin]

      for (let i = 0; i < images.length; i++) {
        setProgress({ current: i + 1, total: images.length })

        const imgItem = images[i]
        let converted: { bytes: ArrayBuffer; type: "image/jpeg" | "image/png" }
        try {
          converted = await convertToSupportedFormat(imgItem.file)
        } catch {
          continue
        }

        const pdfImage =
          converted.type === "image/jpeg"
            ? await pdfDoc.embedJpg(converted.bytes)
            : await pdfDoc.embedPng(converted.bytes)

        const imgDims = pdfImage.scale(1)
        let pageW: number, pageH: number

        if (pageSize === "fit") {
          pageW = imgDims.width + marginPt * 2
          pageH = imgDims.height + marginPt * 2
        } else {
          const base = PAGE_SIZES[pageSize]
          const imgIsLandscape = imgDims.width > imgDims.height
          let usePortrait: boolean

          if (orientation === "auto") {
            usePortrait = !imgIsLandscape
          } else {
            usePortrait = orientation === "portrait"
          }

          pageW = usePortrait ? base.width : base.height
          pageH = usePortrait ? base.height : base.width
        }

        const page = pdfDoc.addPage([pageW, pageH])
        const drawableW = pageW - marginPt * 2
        const drawableH = pageH - marginPt * 2

        // Scale image to fit drawable area while maintaining aspect ratio
        let drawW = imgDims.width
        let drawH = imgDims.height

        if (pageSize !== "fit") {
          const scaleX = drawableW / imgDims.width
          const scaleY = drawableH / imgDims.height
          const scale = Math.min(scaleX, scaleY, 1) // don't upscale
          drawW = imgDims.width * scale
          drawH = imgDims.height * scale
        }

        // Center in drawable area
        const x = marginPt + (drawableW - drawW) / 2
        const y = marginPt + (drawableH - drawH) / 2

        page.drawImage(pdfImage, { x, y, width: drawW, height: drawH })

        // Yield to UI thread
        await new Promise((r) => setTimeout(r, 0))
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
      setResultUrl(URL.createObjectURL(blob))
    } catch (err) {
      console.error(err)
      alert("Error generating PDF. Some images might be corrupted or unsupported.")
    } finally {
      setIsProcessing(false)
      setProgress({ current: 0, total: 0 })
    }
  }

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url))
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setImages([])
    setResultUrl(null)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* ─── Sidebar: Options & Actions ─── */}
        <div className="md:col-span-5 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-400" /> Image to PDF
            </h3>
            <p className="text-sm text-gray-400">
              Convert JPG, PNG & WebP images into a high-quality PDF.
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            {/* Page Size */}
            <div className="space-y-1.5">
              <Label className="text-gray-300 text-xs uppercase tracking-wider">Page Size</Label>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(e.target.value as PageSize); setResultUrl(null) }}
                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white text-sm outline-none focus:border-purple-500/50 transition-colors"
                disabled={isProcessing}
              >
                <option value="fit" className="bg-gray-900">Fit to Image</option>
                <option value="a4" className="bg-gray-900">A4 (210 × 297 mm)</option>
                <option value="letter" className="bg-gray-900">US Letter (8.5 × 11 in)</option>
              </select>
            </div>

            {/* Orientation - only for non-fit */}
            {pageSize !== "fit" && (
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs uppercase tracking-wider">Orientation</Label>
                <select
                  value={orientation}
                  onChange={(e) => { setOrientation(e.target.value as Orientation); setResultUrl(null) }}
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white text-sm outline-none focus:border-purple-500/50 transition-colors"
                  disabled={isProcessing}
                >
                  <option value="auto" className="bg-gray-900">Auto (from image)</option>
                  <option value="portrait" className="bg-gray-900">Portrait</option>
                  <option value="landscape" className="bg-gray-900">Landscape</option>
                </select>
              </div>
            )}

            {/* Margin */}
            <div className="space-y-1.5">
              <Label className="text-gray-300 text-xs uppercase tracking-wider">Margin</Label>
              <select
                value={margin}
                onChange={(e) => { setMargin(e.target.value as Margin); setResultUrl(null) }}
                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white text-sm outline-none focus:border-purple-500/50 transition-colors"
                disabled={isProcessing}
              >
                <option value="none" className="bg-gray-900">None</option>
                <option value="small" className="bg-gray-900">Small</option>
                <option value="medium" className="bg-gray-900">Medium</option>
                <option value="large" className="bg-gray-900">Large</option>
              </select>
            </div>
          </div>

          {/* File info */}
          {images.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 rounded-lg px-3 py-2">
              <FileText className="w-3.5 h-3.5" />
              <span>{images.length} image{images.length > 1 ? "s" : ""} · {(images.reduce((s, i) => s + i.file.size, 0) / 1024 / 1024).toFixed(1)} MB total</span>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            {/* Progress bar */}
            {isProcessing && progress.total > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Processing page {progress.current} of {progress.total}</span>
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

            {!resultUrl ? (
              <Button
                onClick={generatePdf}
                disabled={isProcessing || images.length === 0}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : images.length === 0 ? (
                  "Add images to start"
                ) : (
                  `Create PDF (${images.length} page${images.length > 1 ? "s" : ""})`
                )}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  const link = document.createElement("a")
                  link.download = "images-to-pdf.pdf"
                  link.href = resultUrl
                  link.click()
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 h-12"
              >
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </Button>
            )}
            <Button
              onClick={clearAll}
              variant="ghost"
              className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-10"
              disabled={isProcessing}
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Clear All
            </Button>
          </div>
        </div>

        {/* ─── Main: Upload + Image list ─── */}
        <div className="md:col-span-7 flex flex-col gap-4 bg-black/20 border border-white/10 rounded-3xl p-6 min-h-[400px]">
          <h4 className="text-sm font-medium text-gray-400">Image Sequence</h4>

          {/* Upload area — hidden when result is shown */}
          {!resultUrl && (
            <FileUploader
              onUpload={handleUpload}
              description="Drop JPG, PNG, or WebP images here (multiple supported)"
              icon={<ImageIcon className="w-6 h-6" />}
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={isProcessing}
            />
          )}

          {/* Generated PDF preview */}
          {resultUrl && (
            <div className="w-full space-y-2 mb-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <h4 className="text-sm font-semibold text-purple-300">Generated PDF Preview</h4>
              <iframe src={resultUrl} className="w-full h-80 rounded bg-white shadow-inner" />
            </div>
          )}

          {/* Image list */}
          <div className="space-y-2 flex-1 overflow-y-auto pr-1 max-h-[500px]">
            {images.map((img, index) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragEnd={onDragEnd}
                className={`flex gap-3 items-center bg-gray-900 border p-3 rounded-xl shadow-sm cursor-grab active:cursor-grabbing transition-all ${
                  dragOverIndex === index
                    ? "border-purple-500/60 bg-purple-500/10"
                    : "border-white/5 hover:border-white/15"
                }`}
              >
                {/* Drag handle */}
                <div className="flex flex-col gap-0.5 text-gray-500 shrink-0">
                  <GripVertical className="w-4 h-4" />
                </div>

                {/* Reorder arrows */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    onClick={() => moveImage(index, "up")}
                    disabled={index === 0}
                    className="text-gray-500 hover:text-purple-400 disabled:opacity-20 transition-colors"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveImage(index, "down")}
                    disabled={index === images.length - 1}
                    className="text-gray-500 hover:text-purple-400 disabled:opacity-20 transition-colors"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Thumbnail */}
                <img
                  src={img.url}
                  alt={`Preview ${index + 1}`}
                  className="w-14 h-14 object-cover rounded-lg shadow-md bg-black shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 truncate font-medium">
                    Page {index + 1}. {img.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(img.file.size / 1024 / 1024).toFixed(2)} MB · {img.file.type.split("/")[1].toUpperCase()}
                  </p>
                </div>

                {/* Remove */}
                <Button
                  onClick={() => removeImage(img.id)}
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:bg-red-500/20 hover:text-red-300 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {images.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-sm">
                No images added yet. Upload JPG, PNG, or WebP files above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
