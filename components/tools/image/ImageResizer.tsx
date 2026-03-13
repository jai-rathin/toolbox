"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Link as LinkIcon, Unlink, RefreshCw } from "lucide-react"
import { ImageUploader } from "@/components/ui/ImageUploader"

export default function ImageResizer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [originalWidth, setOriginalWidth] = useState(0)
  const [originalHeight, setOriginalHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [maintainRatio, setMaintainRatio] = useState(true)
  const [percentage, setPercentage] = useState(100)
  const [resizeMode, setResizeMode] = useState<"dimensions" | "percentage">("dimensions")
  
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleUpload = (src: string) => {
    const img = new Image()
    img.onload = () => {
      setOriginalWidth(img.width)
      setOriginalHeight(img.height)
      setWidth(img.width)
      setHeight(img.height)
      setPercentage(100)
    }
    img.src = src
    setImageSrc(src)
  }

  useEffect(() => {
    if (!imageSrc || !canvasRef.current || width === 0 || height === 0) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = width
      canvas.height = height
      // Enable high-quality resizing
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)
    }
    img.src = imageSrc
  }, [imageSrc, width, height])

  const handleWidthChange = (val: string) => {
    const newWidth = parseInt(val) || 0
    setWidth(newWidth)
    if (maintainRatio && originalWidth > 0) {
      setHeight(Math.round((newWidth / originalWidth) * originalHeight))
    }
  }

  const handleHeightChange = (val: string) => {
    const newHeight = parseInt(val) || 0
    setHeight(newHeight)
    if (maintainRatio && originalHeight > 0) {
      setWidth(Math.round((newHeight / originalHeight) * originalWidth))
    }
  }

  const handlePercentageChange = (val: string) => {
    let p = parseInt(val)
    if (isNaN(p)) p = 100
    setPercentage(p)
    setWidth(Math.round(originalWidth * (p / 100)))
    setHeight(Math.round(originalHeight * (p / 100)))
  }

  function downloadImage() {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = `resized-${width}x${height}.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!imageSrc ? (
        <ImageUploader onUpload={handleUpload} description="JPG, PNG, WebP" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="flex bg-white/5 rounded-xl p-1 mb-6">
               <button 
                 onClick={() => {
                   setResizeMode("dimensions")
                   if (percentage !== 100) {
                      setWidth(Math.round(originalWidth * (percentage/100)))
                      setHeight(Math.round(originalHeight * (percentage/100)))
                   }
                 }}
                 className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${resizeMode === "dimensions" ? "bg-cyan-500 text-white shadow" : "text-gray-400 hover:text-white"}`}
               >
                 Dimensions
               </button>
               <button 
                 onClick={() => setResizeMode("percentage")}
                 className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${resizeMode === "percentage" ? "bg-cyan-500 text-white shadow" : "text-gray-400 hover:text-white"}`}
               >
                 Percentage
               </button>
            </div>

            {resizeMode === "dimensions" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-300">Dimensions (px)</Label>
                  <button 
                    onClick={() => setMaintainRatio(!maintainRatio)} 
                    className={`p-2 rounded-lg transition-colors ${maintainRatio ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                    title={maintainRatio ? "Aspect Ratio Locked" : "Aspect Ratio Unlocked"}
                  >
                    {maintainRatio ? <LinkIcon className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">WIDTH</Label>
                    <Input 
                      type="number" 
                      value={width || ""} 
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="bg-white/5 font-mono text-white text-center rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">HEIGHT</Label>
                    <Input 
                      type="number" 
                      value={height || ""} 
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="bg-white/5 font-mono text-white text-center rounded-xl h-12"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <Label className="text-gray-300">Scale Percentage</Label>
                  <span className="text-cyan-400 font-mono">{percentage}%</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="500" 
                  step="1" 
                  value={percentage} 
                  onChange={(e) => handlePercentageChange(e.target.value)} 
                  className="w-full accent-cyan-500"
                />
                <div className="pt-2 text-center text-sm text-gray-400 font-mono">
                  {Math.round(originalWidth * (percentage / 100))} × {Math.round(originalHeight * (percentage / 100))} px
                </div>
              </div>
            )}

            <div className="space-y-3 pt-6 border-t border-white/10">
              <Button onClick={downloadImage} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-lg shadow-cyan-500/20 h-12">
                <Download className="w-4 h-4 mr-2" /> Download Image
              </Button>
              <Button onClick={() => setImageSrc(null)} variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-12">
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 text-center space-y-1">
               <p>Original: {originalWidth} × {originalHeight}</p>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col items-center justify-center bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVQ4T2P8////fwY8gHGgHkUDGIa1YBg1gIiKBsKxBhFVSYy1YBg1gIiKBsKxBhEAhP1wIemq4iAAAAAASUVORK5CYII=')] border border-white/10 rounded-3xl p-6 min-h-[400px] overflow-hidden">
             
             {width > 0 && height > 0 ? (
               <canvas 
                ref={canvasRef} 
                className="max-w-full max-h-full object-contain rounded shadow-2xl transition-all duration-300 pointer-events-none"
              />
             ) : (
               <p className="text-gray-500 animate-pulse">Invalid dimensions</p>
             )}
          </div>
        </div>
      )}
    </div>
  )
}
