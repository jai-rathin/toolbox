"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, Sun, Moon, RefreshCw, Image as ImageIcon } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"

export default function ImageBrightnessAdjuster() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [brightness, setBrightness] = useState(100) // 100% is normal
  const [contrast, setContrast] = useState(100)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const handleUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const src = event.target?.result as string
      setImageSrc(src)
      setBrightness(100)
      setContrast(100)
      
      const img = new Image()
      img.onload = () => {
        imgRef.current = img
        renderImage()
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }

  const renderImage = () => {
    if (!imgRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = imgRef.current
    canvas.width = img.width
    canvas.height = img.height
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`
    ctx.drawImage(img, 0, 0)
  }

  useEffect(() => {
    renderImage()
  }, [brightness, contrast])

  function downloadImage() {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = `adjusted-image.png`
    link.href = canvasRef.current.toDataURL("image/png", 1.0)
    link.click()
  }

  const resetValues = () => {
    setBrightness(100)
    setContrast(100)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!imageSrc ? (
        <FileUploader 
          onUpload={handleUpload} 
          description="Upload an image to adjust brightness and contrast" 
          accept="image/*" 
          icon={<ImageIcon className="w-8 h-8" />} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="space-y-6 pt-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 <Sun className="w-4 h-4 text-cyan-400" /> Color Adjustments
              </h3>
              
              <div className="space-y-4">
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
                    onChange={(e) => setBrightness(parseInt(e.target.value))} 
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
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
                    onChange={(e) => setContrast(parseInt(e.target.value))} 
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
               <Button onClick={resetValues} variant="ghost" className="w-full text-gray-400 hover:text-white hover:bg-white/10 rounded-xl justify-center h-12 transition-all">
                <RefreshCw className="w-4 h-4 mr-2" /> Reset Values
              </Button>
              <Button onClick={downloadImage} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl shadow-lg shadow-cyan-500/20 h-12 transition-all">
                <Download className="w-4 h-4 mr-2" /> Download Image
              </Button>
              <Button onClick={() => { setImageSrc(null); imgRef.current = null }} variant="outline" className="w-full text-red-400 hover:text-red-300 border-white/5 bg-white/5 hover:bg-red-500/10 hover:border-red-400/30 rounded-xl h-12 transition-all">
                Pick New Image
              </Button>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col items-center justify-center bg-black/20 border border-white/10 rounded-3xl p-4 min-h-[500px] overflow-hidden">
             <div className="relative w-full h-[600px] flex items-center justify-center">
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-all duration-200 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVQ4T2P8////fwY8gHGgHkUDGIa1YBg1gIiKBsKxBhFVSYy1YBg1gIiKBsKxBhEAhP1wIemq4iAAAAAASUVORK5CYII=')]"
                />
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
