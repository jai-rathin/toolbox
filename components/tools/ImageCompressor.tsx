"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, Download } from "lucide-react"

export default function ImageCompressor() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const [quality, setQuality] = useState(0.8)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [compressedDataUrl, setCompressedDataUrl] = useState<string | null>(null)

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setOriginalSize(file.size)

    const reader = new FileReader()
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      
      const compressed = canvas.toDataURL("image/jpeg", quality)
      setCompressedDataUrl(compressed)
      
      // Calculate byte size of base64 string
      const base64str = compressed.split(',')[1]
      if (base64str) {
        const decoded = atob(base64str)
        setCompressedSize(decoded.length)
      }
    }
    img.src = imageSrc
  }, [imageSrc, quality])

  function downloadImage() {
    if (!compressedDataUrl) return
    const link = document.createElement("a")
    link.download = "compressed-image.jpg"
    link.href = compressedDataUrl
    link.click()
  }

  function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <canvas ref={canvasRef} className="hidden" />
      
      {!imageSrc ? (
        <label className="flex flex-col items-center justify-center w-full h-64 md:h-96 border-2 border-dashed border-white/20 rounded-3xl cursor-pointer hover:bg-white/5 hover:border-cyan-500/50 transition-all bg-black/20">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-12 h-12 mb-4 text-gray-400" />
            <p className="mb-2 text-sm text-gray-300"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">JPG, PNG, WebP</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <Label className="text-gray-300">Compression Quality</Label>
                  <span className="text-cyan-400 font-mono">{Math.round(quality * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.05" 
                  value={quality} 
                  onChange={(e) => setQuality(parseFloat(e.target.value))} 
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Original Size:</span>
                  <span className="text-gray-300">{formatBytes(originalSize)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Compressed Size:</span>
                  <span className={compressedSize < originalSize ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
                    {formatBytes(compressedSize)}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-medium pt-2 border-t border-white/5">
                  <span className="text-gray-500">Reduction:</span>
                  <span className="text-cyan-400">
                    {originalSize > 0 
                      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <Button onClick={downloadImage} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-lg shadow-cyan-500/20">
                <Download className="w-4 h-4 mr-2" /> Download JPG
              </Button>
              <Button onClick={() => setImageSrc(null)} variant="outline" className="w-full rounded-xl border-gray-700 bg-transparent hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 text-gray-400">
                Start Over
              </Button>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col items-center justify-center bg-black/20 border border-white/10 rounded-3xl p-4 overflow-hidden relative min-h-[300px]">
             {compressedDataUrl && (
                <img src={compressedDataUrl} alt="Compressed Preview" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
             )}
          </div>
        </div>
      )}
    </div>
  )
}
