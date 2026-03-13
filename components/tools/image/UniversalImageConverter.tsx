"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, FileImage, RefreshCw } from "lucide-react"
import { ImageUploader } from "@/components/ui/ImageUploader"

export default function UniversalImageConverter() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [fileName, setFileName] = useState("image")
  const [format, setFormat] = useState<"jpeg" | "png" | "webp" | "gif">("jpeg")
  const [quality, setQuality] = useState("0.9")
  
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleUpload = (src: string, file: File) => {
    setImageSrc(src)
    const nameExt = file.name.lastIndexOf(".")
    setFileName(nameExt > 0 ? file.name.substring(0, nameExt) : file.name)
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
      
      if (format === "jpeg") {
        ctx.fillStyle = "#FFFFFF" // Fill white background for JPEGs to replace transparency
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      
      ctx.drawImage(img, 0, 0)
    }
    img.src = imageSrc
  }, [imageSrc, format])

  function downloadImage() {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    
    // adjust extensions for friendly names
    const ext = format === "jpeg" ? "jpg" : format
    link.download = `${fileName}.${ext}`
    
    if (format === "png" || format === "gif") {
       link.href = canvasRef.current.toDataURL(`image/${format}`)
    } else {
       link.href = canvasRef.current.toDataURL(`image/${format}`, parseFloat(quality))
    }
    link.click()
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!imageSrc ? (
        <ImageUploader onUpload={handleUpload} description="Upload any local image" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 <FileImage className="w-4 h-4 text-cyan-400" /> Universal Converter
              </h3>
              
              <div className="space-y-2 pt-2">
                <Label className="text-gray-300 text-sm">Target Format</Label>
                <select 
                  value={format} 
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full h-12 bg-white/5 text-gray-200 border border-white/10 rounded-xl px-3 outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                >
                  <option value="jpeg" className="bg-gray-900">JPG / JPEG</option>
                  <option value="png" className="bg-gray-900">PNG</option>
                  <option value="webp" className="bg-gray-900">WebP</option>
                  <option value="gif" className="bg-gray-900">GIF (Static)</option>
                </select>
              </div>

              {(format === "jpeg" || format === "webp") && (
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <Label className="text-gray-300">Compression Quality</Label>
                    <span className="text-cyan-400 font-mono">{Math.round(parseFloat(quality) * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="1" step="0.05" 
                    value={quality} 
                    onChange={(e) => setQuality(e.target.value)} 
                    className="w-full accent-cyan-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">Lower values reduce file size but lower visual quality.</p>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              <Button onClick={downloadImage} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-lg shadow-cyan-500/20 h-12">
                <Download className="w-4 h-4 mr-2" /> Download {format === "jpeg" ? "JPG" : format.toUpperCase()}
              </Button>
              <Button onClick={() => setImageSrc(null)} variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-12">
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </Button>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col items-center justify-center bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVQ4T2P8////fwY8gHGgHkUDGIa1YBg1gIiKBsKxBhFVSYy1YBg1gIiKBsKxBhEAhP1wIemq4iAAAAAASUVORK5CYII=')] border border-white/10 rounded-3xl p-6 min-h-[400px]">
             {/* Use CSS object-fit to maintain aspect ratio in the grid visualization */}
             <div className="w-full h-full max-h-[60vh] flex items-center justify-center">
                 <canvas 
                  ref={canvasRef} 
                  className="max-w-full max-h-full object-contain rounded shadow-2xl transition-all duration-300 bg-white"
                />
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
