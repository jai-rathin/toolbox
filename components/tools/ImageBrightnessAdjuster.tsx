"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, Sun, Moon, RefreshCw, Image as ImageIcon } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"

const MAX_CANVAS_DIMENSION = 2048;

export default function ImageBrightnessAdjuster() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [brightness, setBrightness] = useState(100) // 100% is normal
  const [contrast, setContrast] = useState(100)
  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const handleUpload = (file: File) => {
    setIsProcessing(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      const src = event.target?.result as string
      const img = new Image()
      img.onload = () => {
        imgRef.current = img
        setImageSrc(src)
        resetValues() // Reset sliders for new image
        setIsProcessing(false)
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }

  const renderInitialImage = (img: HTMLImageElement) => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = img.width
    let height = img.height

    // Scale down if exceeds MAX_CANVAS_DIMENSION to prevent mobile crashes
    if (width > MAX_CANVAS_DIMENSION || height > MAX_CANVAS_DIMENSION) {
      const ratio = Math.min(MAX_CANVAS_DIMENSION / width, MAX_CANVAS_DIMENSION / height)
      width = Math.floor(width * ratio)
      height = Math.floor(height * ratio)
    }

    canvas.width = width
    canvas.height = height
    
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)
  }

  // Use an effect to draw the initial image once the canvas is rendered in the DOM
  useEffect(() => {
    if (imageSrc && imgRef.current && canvasRef.current) {
      renderInitialImage(imgRef.current)
    }
  }, [imageSrc])

  function downloadImage() {
    if (!imgRef.current) return
    
    // Create a temporary canvas to apply the final filter to pixels
    const tempCanvas = document.createElement("canvas")
    const tempCtx = tempCanvas.getContext("2d")
    if (!tempCtx) return

    const img = imgRef.current
    tempCanvas.width = img.width
    tempCanvas.height = img.height

    // Apply the current adjustments to the context before drawing
    tempCtx.filter = `brightness(${brightness}%) contrast(${contrast}%)`
    tempCtx.drawImage(img, 0, 0)

    const link = document.createElement("a")
    link.download = `adjusted-image-${Date.now()}.png`
    link.href = tempCanvas.toDataURL("image/png", 1.0)
    link.click()
  }

  const resetValues = () => {
    setBrightness(100)
    setContrast(100)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 md:px-0">
      {!imageSrc ? (
        <FileUploader 
          onUpload={handleUpload} 
          description="Upload an image to adjust brightness and contrast locally" 
          accept="image/*" 
          icon={<ImageIcon className="w-8 h-8" />} 
          disabled={isProcessing}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6 p-6 glass border border-white/10 rounded-3xl h-fit lg:sticky lg:top-24">
            
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

          <div className="lg:col-span-8 flex flex-col items-center justify-center glass border border-white/10 rounded-3xl p-4 min-h-[400px] lg:min-h-[600px] overflow-hidden bg-black/40">
             <div className="relative w-full h-full flex items-center justify-center overflow-auto max-h-[70vh] lg:max-h-[80vh]">
                <canvas 
                  ref={canvasRef} 
                  style={{ 
                    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                    maxWidth: '100%',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                  className="rounded-xl shadow-2xl transition-all duration-75 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVQ4T2P8////fwY8gHGgHkUDGIa1YBg1gIiKBsKxBhFVSYy1YBg1gIiKBsKxBhEAhP1wIemq4iAAAAAASUVORK5CYII=')]"
                />
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
