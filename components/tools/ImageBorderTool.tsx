"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, Download, Frame } from "lucide-react"

export default function ImageBorderTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [borderWidth, setBorderWidth] = useState(20)
  const [borderColor, setBorderColor] = useState("#3B82F6")
  const [borderRadiusRadius, setBorderRadiusRadius] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string)
      setBorderWidth(20)
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
      // Set canvas size to original + border on both sides
      canvas.width = img.width + (borderWidth * 2)
      canvas.height = img.height + (borderWidth * 2)
      
      // Draw background (Border Color)
      ctx.fillStyle = borderColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw image in the middle
      ctx.drawImage(img, borderWidth, borderWidth, img.width, img.height)
    }
    img.src = imageSrc
  }, [imageSrc, borderWidth, borderColor])

  function downloadImage() {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = `bordered-image.png`
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
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 <Frame className="w-4 h-4 text-cyan-400" /> Frame Settings
              </h3>
              
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-sm">
                  <Label className="text-gray-300">Border Width</Label>
                  <span className="text-cyan-400 font-mono">{borderWidth}px</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  step="5" 
                  value={borderWidth} 
                  onChange={(e) => setBorderWidth(parseFloat(e.target.value))} 
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="space-y-2 pt-2">
                 <Label className="text-gray-300">Border Color</Label>
                 <div className="flex gap-4">
                   <input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="w-14 h-10 bg-transparent rounded cursor-pointer" />
                   <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 flex items-center">
                     <span className="text-gray-300 font-mono text-sm">{borderColor.toUpperCase()}</span>
                   </div>
                 </div>
              </div>

            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              <Button onClick={downloadImage} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-lg shadow-cyan-500/20 h-11">
                <Download className="w-4 h-4 mr-2" /> Download Image
              </Button>
              <Button onClick={() => setImageSrc(null)} variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-11">
                Start Over
              </Button>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col items-center justify-center bg-black/20 border border-white/10 rounded-3xl p-4 min-h-[400px]">
             <canvas 
              ref={canvasRef} 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-all duration-300 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVQ4T2P8////fwY8gHGgHkUDGIa1YBg1gIiKBsKxBhFVSYy1YBg1gIiKBsKxBhEAhP1wIemq4iAAAAAASUVORK5CYII=')]"
            />
          </div>
        </div>
      )}
    </div>
  )
}
