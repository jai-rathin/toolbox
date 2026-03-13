"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, CloudRain, Eraser, Brush, Paintbrush, Undo } from "lucide-react"
import { ImageUploader } from "@/components/ui/ImageUploader"

export default function ImageBlurTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  
  // Settings
  const [mode, setMode] = useState<"global" | "brush">("global")
  const [blurValue, setBlurValue] = useState(15)
  const [brushSize, setBrushSize] = useState(40)
  
  // Internal original image properties to map coordinate scaling properly
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)

  // Canvas refs
  // Base canvas contains the fully blurred image.
  // Top canvas contains the sharp image which we "erase" to reveal the blur underneath.
  const blurCanvasRef = useRef<HTMLCanvasElement>(null)
  const sharpCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isDrawing = useRef(false)
  const [strokesExist, setStrokesExist] = useState(false)

  const handleUpload = (src: string) => {
    setImageSrc(src)
  }

  const renderCanvases = useCallback(() => {
    if (!imageSrc || !blurCanvasRef.current || !sharpCanvasRef.current) return
    
    const blurCanvas = blurCanvasRef.current
    const blurCtx = blurCanvas.getContext("2d")
    const sharpCanvas = sharpCanvasRef.current
    const sharpCtx = sharpCanvas.getContext("2d")
    
    if (!blurCtx || !sharpCtx) return

    const img = new Image()
    img.onload = () => {
      setImgWidth(img.width)
      setImgHeight(img.height)

      blurCanvas.width = img.width
      blurCanvas.height = img.height
      sharpCanvas.width = img.width
      sharpCanvas.height = img.height

      // Render blurred version
      blurCtx.clearRect(0, 0, blurCanvas.width, blurCanvas.height)
      blurCtx.filter = `blur(${blurValue}px)`
      // Draw slightly larger to avoid white edges (a common CSS/canvas blur quirk)
      blurCtx.drawImage(img, -blurValue, -blurValue, blurCanvas.width + blurValue*2, blurCanvas.height + blurValue*2)

      // Render sharp version on top
      sharpCtx.clearRect(0, 0, sharpCanvas.width, sharpCanvas.height)
      sharpCtx.drawImage(img, 0, 0)
      setStrokesExist(false)
    }
    img.src = imageSrc
  }, [imageSrc, blurValue])

  useEffect(() => {
    if (mode === "global") {
      // For global blur, we can just hide the sharp canvas via CSS
    }
  }, [mode])

  // Re-render when image or blur value changes
  useEffect(() => {
    renderCanvases()
  }, [renderCanvases])

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!sharpCanvasRef.current) return null
    const sharpCanvas = sharpCanvasRef.current
    const rect = sharpCanvas.getBoundingClientRect()
    
    let clientX, clientY
    if ('touches' in e) {
       clientX = e.touches[0].clientX
       clientY = e.touches[0].clientY
    } else {
       clientX = (e as React.MouseEvent).clientX
       clientY = (e as React.MouseEvent).clientY
    }

    const scaleX = sharpCanvas.width / rect.width
    const scaleY = sharpCanvas.height / rect.height

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true
    draw(e)
  }

  const stopDrawing = () => {
    isDrawing.current = false
    const sharpCtx = sharpCanvasRef.current?.getContext("2d")
    if (sharpCtx) sharpCtx.beginPath()
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || mode !== "brush" || !sharpCanvasRef.current) return
    const coords = getCoordinates(e)
    if (!coords) return

    const sharpCtx = sharpCanvasRef.current.getContext("2d")
    if (!sharpCtx) return

    sharpCtx.lineWidth = brushSize
    sharpCtx.lineCap = "round"
    sharpCtx.lineJoin = "round"
    // Erase the sharp canvas to reveal the blurred canvas underneath
    sharpCtx.globalCompositeOperation = "destination-out"

    sharpCtx.lineTo(coords.x, coords.y)
    sharpCtx.stroke()
    sharpCtx.beginPath()
    sharpCtx.moveTo(coords.x, coords.y)

    setStrokesExist(true)
  }

  const resetBrush = () => {
      renderCanvases()
  }

  function downloadImage() {
    if (!blurCanvasRef.current || !sharpCanvasRef.current) return
    
    // We combine the two canvases into a final export canvas
    const exportCanvas = document.createElement("canvas")
    exportCanvas.width = imgWidth
    exportCanvas.height = imgHeight
    const ctx = exportCanvas.getContext("2d")
    if (!ctx) return

    // Draw blur layer
    ctx.drawImage(blurCanvasRef.current, 0, 0)
    
    // Draw remaining sharp layer on top (only if mode is brush)
    if (mode === "brush") {
       ctx.drawImage(sharpCanvasRef.current, 0, 0)
    }

    const link = document.createElement("a")
    link.download = `blurred-image.png`
    link.href = exportCanvas.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!imageSrc ? (
        <ImageUploader onUpload={handleUpload} description="JPG, PNG, WebP" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="flex bg-white/5 rounded-xl p-1 mb-2">
               <button 
                 onClick={() => setMode("global")}
                 className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${mode === "global" ? "bg-cyan-500 text-white shadow" : "text-gray-400 hover:text-white"}`}
               >
                 <CloudRain className="w-4 h-4" /> Global Blur
               </button>
               <button 
                 onClick={() => setMode("brush")}
                 className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${mode === "brush" ? "bg-cyan-500 text-white shadow" : "text-gray-400 hover:text-white"}`}
               >
                 <Paintbrush className="w-4 h-4" /> Brush Blur
               </button>
            </div>

            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <Label className="text-gray-300">Blur Intensity</Label>
                  <span className="text-cyan-400 font-mono">{blurValue}px</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  step="1" 
                  value={blurValue} 
                  onChange={(e) => setBlurValue(parseFloat(e.target.value))} 
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className={`space-y-2 transition-opacity duration-300 ${mode === "brush" ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                <div className="flex justify-between items-center text-sm">
                  <Label className="text-gray-300">Brush Size</Label>
                  <span className="text-cyan-400 font-mono">{brushSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="200" 
                  step="5" 
                  value={brushSize} 
                  onChange={(e) => setBrushSize(parseFloat(e.target.value))} 
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              {mode === "brush" && strokesExist && (
                <Button onClick={resetBrush} variant="outline" className="w-full bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white rounded-xl h-11 mb-2">
                  <Undo className="w-4 h-4 mr-2" /> Reset Brush Strokes
                </Button>
              )}
              <Button onClick={downloadImage} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-lg shadow-cyan-500/20 h-12">
                <Download className="w-4 h-4 mr-2" /> Download Image
              </Button>
              <Button onClick={() => setImageSrc(null)} variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-12">
                Start Over
              </Button>
            </div>
          </div>

          {/* Canvas Container */}
          <div ref={containerRef} className="md:col-span-8 flex flex-col items-center justify-center bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVQ4T2P8////fwY8gHGgHkUDGIa1YBg1gIiKBsKxBhFVSYy1YBg1gIiKBsKxBhEAhP1wIemq4iAAAAAASUVORK5CYII=')] border border-white/10 rounded-3xl p-4 min-h-[500px] overflow-hidden relative touch-none select-none">
             
             <div className="relative inline-block w-full h-full max-h-[70vh] flex items-center justify-center">
                 {/* Background Canvas: Blurred */}
                 <canvas 
                    ref={blurCanvasRef} 
                    className="max-w-full max-h-full object-contain absolute z-10 pointer-events-none rounded shadow-2xl"
                 />
                 
                 {/* Foreground Canvas: Sharp (Erase to reveal blur) */}
                 {/* We hide it when global blur is active so only blur layer is visible */}
                 <canvas 
                    ref={sharpCanvasRef} 
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className={`max-w-full max-h-full object-contain absolute z-20 rounded shadow-2xl transition-opacity duration-300 ${mode === "brush" ? "cursor-crosshair opacity-100" : "opacity-0 pointer-events-none"}`}
                 />
             </div>
             {mode === "brush" && <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-500 font-medium z-30 pointer-events-none">Brush over the image to blur specific areas</p>}
          </div>
        </div>
      )}
    </div>
  )
}
