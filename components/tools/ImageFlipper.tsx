"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Download, ArrowLeftRight, ArrowUpDown } from "lucide-react"

export default function ImageFlipper() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string)
      setFlipH(false)
      setFlipV(false)
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
      ctx.translate(flipH ? canvas.width : 0, flipV ? canvas.height : 0)
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
      ctx.drawImage(img, 0, 0)
    }
    img.src = imageSrc
  }, [imageSrc, flipH, flipV])

  function downloadImage() {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = `flipped-image.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
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
            
            <div className="space-y-4 pt-2">
              <Button onClick={() => setFlipH(!flipH)} variant="outline" className={`w-full bg-white/5 border-white/10 text-white hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/50 rounded-xl h-12 ${flipH ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300' : ''}`}>
                <ArrowLeftRight className="w-4 h-4 mr-2" /> Flip Horizontal
              </Button>
              <Button onClick={() => setFlipV(!flipV)} variant="outline" className={`w-full bg-white/5 border-white/10 text-white hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/50 rounded-xl h-12 ${flipV ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300' : ''}`}>
                <ArrowUpDown className="w-4 h-4 mr-2" /> Flip Vertical
              </Button>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              <Button onClick={downloadImage} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-lg shadow-cyan-500/20">
                <Download className="w-4 h-4 mr-2" /> Download Image
              </Button>
              <Button onClick={() => setImageSrc(null)} variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl">
                Start Over
              </Button>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col items-center justify-center bg-black/20 border border-white/10 rounded-3xl p-4 min-h-[400px]">
            <canvas 
              ref={canvasRef} 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-all duration-300"
              style={{ background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVQ4T2P8////fwY8gHGgHkUDGIa1YBg1gIiKBsKxBhFVSYy1YBg1gIiKBsKxBhEAhP1wIemq4iAAAAAASUVORK5CYII=") repeat' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
