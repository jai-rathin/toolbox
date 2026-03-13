"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, Download, Sun, Moon } from "lucide-react"

export default function ImageBrightnessAdjuster() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [brightness, setBrightness] = useState(100) // 100% is normal
  const [contrast, setContrast] = useState(100)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string)
      setBrightness(100)
      setContrast(100)
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
      
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`
      ctx.drawImage(img, 0, 0)
    }
    img.src = imageSrc
  }, [imageSrc, brightness, contrast])

  function downloadImage() {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = `adjusted-image.png`
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
            
            <div className="space-y-6 pt-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 <Sun className="w-4 h-4 text-cyan-400" /> Color Adjustments
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <Label className="text-gray-300">Brightness</Label>
                  <span className="text-cyan-400 font-mono">{brightness}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  step="1" 
                  value={brightness} 
                  onChange={(e) => setBrightness(parseFloat(e.target.value))} 
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <Label className="text-gray-300 flex items-center gap-1"><Moon className="w-3 h-3"/>Contrast</Label>
                  <span className="text-purple-400 font-mono">{contrast}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  step="1" 
                  value={contrast} 
                  onChange={(e) => setContrast(parseFloat(e.target.value))} 
                  className="w-full accent-purple-500"
                />
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
               <Button onClick={() => { setBrightness(100); setContrast(100) }} variant="ghost" className="w-full text-gray-400 hover:text-white hover:bg-white/10 rounded-xl justify-center h-10">
                Reset Values
              </Button>
              <Button onClick={downloadImage} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-lg shadow-cyan-500/20 h-10">
                <Download className="w-4 h-4 mr-2" /> Download Image
              </Button>
              <Button onClick={() => setImageSrc(null)} variant="outline" className="w-full text-red-400 hover:text-red-300 border-gray-700 bg-transparent hover:bg-red-500/10 hover:border-red-500/50 rounded-xl h-10">
                Pick New Image
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
