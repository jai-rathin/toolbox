"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Download, Type, ImageIcon, RefreshCw } from "lucide-react"
import { ImageUploader } from "@/components/ui/ImageUploader"

export default function ImageWatermark() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  
  // Watermark state
  const [mode, setMode] = useState<"text" | "image">("text")
  const [text, setText] = useState("Confidential")
  const [fontFamily, setFontFamily] = useState("sans-serif")
  const [fontSize, setFontSize] = useState(48)
  const [color, setColor] = useState("#FFFFFF")
  const [opacity, setOpacity] = useState(0.8)
  const [rotation, setRotation] = useState(0)
  
  const [watermarkImgSrc, setWatermarkImgSrc] = useState<string | null>(null)
  const [watermarkScale, setWatermarkScale] = useState(1)

  // Position state
  const [position, setPosition] = useState({ x: 50, y: 50 }) // Percentages 0-100
  const isDragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleBaseUpload = (src: string) => {
    setImageSrc(src)
  }

  const handleWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => setWatermarkImgSrc(event.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handlePointerDown = () => {
    isDragging.current = true
  }

  const handlePointerUp = () => {
    isDragging.current = false
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    // Calculate percentage position
    let x = ((e.clientX - rect.left) / rect.width) * 100
    let y = ((e.clientY - rect.top) / rect.height) * 100
    
    x = Math.max(0, Math.min(x, 100))
    y = Math.max(0, Math.min(y, 100))
    
    setPosition({ x, y })
  }

  function downloadImage() {
    if (!imageSrc) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      const pxX = (position.x / 100) * canvas.width
      const pxY = (position.y / 100) * canvas.height

      ctx.globalAlpha = opacity

      if (mode === "text") {
         if (!text.trim()) return
         ctx.font = `bold ${fontSize * (canvas.width/800)}px ${fontFamily}` // scale font size roughly to image size based on a typical 800px display
         ctx.fillStyle = color
         ctx.textAlign = "center"
         ctx.textBaseline = "middle"
         
         ctx.translate(pxX, pxY)
         ctx.rotate((rotation * Math.PI) / 180)
         ctx.fillText(text, 0, 0)
         
      } else if (mode === "image" && watermarkImgSrc) {
         const wmImg = new Image()
         wmImg.onload = () => {
            const scaledWidth = wmImg.width * (canvas.width/800) * watermarkScale
            const scaledHeight = wmImg.height * (canvas.width/800) * watermarkScale
            
            ctx.translate(pxX, pxY)
            ctx.rotate((rotation * Math.PI) / 180)
            ctx.drawImage(wmImg, -scaledWidth/2, -scaledHeight/2, scaledWidth, scaledHeight)
            executeDownload(canvas)
         }
         wmImg.src = watermarkImgSrc
         return // Wait for watermark image load to download
      }

      executeDownload(canvas)
    }
    img.src = imageSrc
  }

  function executeDownload(canvas: HTMLCanvasElement) {
      const link = document.createElement("a")
      link.download = `watermarked-image.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!imageSrc ? (
        <ImageUploader onUpload={handleBaseUpload} description="JPG, PNG, WebP" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="flex bg-white/5 rounded-xl p-1 mb-4">
               <button 
                 onClick={() => setMode("text")}
                 className={`flex-1 py-1.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${mode === "text" ? "bg-cyan-500 text-white shadow" : "text-gray-400 hover:text-white"}`}
               >
                 <Type className="w-4 h-4" /> Text
               </button>
               <button 
                 onClick={() => setMode("image")}
                 className={`flex-1 py-1.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${mode === "image" ? "bg-cyan-500 text-white shadow" : "text-gray-400 hover:text-white"}`}
               >
                 <ImageIcon className="w-4 h-4" /> Image
               </button>
            </div>

            <div className="space-y-4 pt-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              
              {mode === "text" ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">Text</Label>
                    <Input 
                      value={text} 
                      onChange={(e) => setText(e.target.value)} 
                      className="bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-cyan-500 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">Font Family</Label>
                    <select 
                      value={fontFamily} 
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full h-10 bg-white/5 text-gray-200 border border-white/10 rounded-xl px-3 outline-none focus:ring-1 focus:ring-cyan-500"
                    >
                      <option value="sans-serif" className="bg-gray-900">Sans Serif</option>
                      <option value="serif" className="bg-gray-900">Serif</option>
                      <option value="monospace" className="bg-gray-900">Monospace</option>
                      <option value="Arial" className="bg-gray-900">Arial</option>
                      <option value="Times New Roman" className="bg-gray-900">Times New Roman</option>
                      <option value="Courier New" className="bg-gray-900">Courier New</option>
                      <option value="Impact" className="bg-gray-900">Impact</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <Label className="text-gray-300">Font Size</Label>
                      <span className="text-cyan-400 font-mono">{fontSize}px</span>
                    </div>
                    <input 
                      type="range" min="10" max="200" step="1" 
                      value={fontSize} 
                      onChange={(e) => setFontSize(parseInt(e.target.value))} 
                      className="w-full accent-cyan-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                     <Label className="text-gray-300 text-sm">Text Color</Label>
                     <div className="flex gap-4">
                       <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 bg-transparent rounded cursor-pointer" />
                     </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">Upload Watermark Image</Label>
                    <input 
                       type="file" 
                       accept="image/*"
                       onChange={handleWatermarkUpload}
                       className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 transition-colors cursor-pointer"
                    />
                    {watermarkImgSrc && (
                       <img src={watermarkImgSrc} alt="watermark preview" className="h-16 object-contain mt-2 bg-black/50 rounded p-1"/>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <Label className="text-gray-300">Scale</Label>
                      <span className="text-cyan-400 font-mono">{watermarkScale.toFixed(1)}x</span>
                    </div>
                    <input 
                      type="range" min="0.1" max="5" step="0.1" 
                      value={watermarkScale} 
                      onChange={(e) => setWatermarkScale(parseFloat(e.target.value))} 
                      className="w-full accent-cyan-500"
                      disabled={!watermarkImgSrc}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2 border-t border-white/10 pt-4 mt-2">
                <div className="flex justify-between items-center text-sm">
                  <Label className="text-gray-300">Opacity</Label>
                  <span className="text-cyan-400 font-mono">{Math.round(opacity * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={opacity} 
                  onChange={(e) => setOpacity(parseFloat(e.target.value))} 
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <Label className="text-gray-300">Rotation</Label>
                  <span className="text-cyan-400 font-mono">{rotation}°</span>
                </div>
                <input 
                  type="range" min="-180" max="180" step="1" 
                  value={rotation} 
                  onChange={(e) => setRotation(parseInt(e.target.value))} 
                  className="w-full accent-cyan-500"
                />
              </div>

            </div>

            <div className="space-y-3 mt-4 pt-4 border-t border-white/10">
              <span className="text-xs text-gray-500 flex justify-center pb-2">Drag the watermark to position it</span>
              <Button onClick={downloadImage} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-lg shadow-cyan-500/20 h-11">
                <Download className="w-4 h-4 mr-2" /> Download Result
              </Button>
              <Button onClick={() => { setImageSrc(null); setWatermarkImgSrc(null) }} variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-11">
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </Button>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col items-center justify-center bg-black/20 border border-white/10 rounded-3xl p-4 min-h-[500px] overflow-hidden">
             
             {/* Interactive Preview Container */}
             <div 
                ref={containerRef}
                className="relative inline-block max-w-full max-h-[70vh] shadow-2xl touch-none select-none rounded bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVQ4T2P8////fwY8gHGgHkUDGIa1YBg1gIiKBsKxBhFVSYy1YBg1gIiKBsKxBhEAhP1wIemq4iAAAAAASUVORK5CYII=')]"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
             >
                <img src={imageSrc} className="block max-w-full max-h-[70vh] object-contain pointer-events-none" />

                {/* Draggable Watermark Overlay */}
                <div 
                   className="absolute pointer-events-none origin-center"
                   style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                      opacity: opacity,
                   }}
                >
                   {mode === "text" ? (
                      <span 
                         style={{ 
                            color: color, 
                            fontFamily: fontFamily, 
                            fontSize: `${fontSize}px`, 
                            fontWeight: 'bold',
                            textShadow: '0 0 4px rgba(0,0,0,0.5)',
                            whiteSpace: 'nowrap'
                         }}
                      >
                         {text}
                      </span>
                   ) : (
                      watermarkImgSrc && (
                         <img 
                            src={watermarkImgSrc} 
                            style={{ 
                               transform: `scale(${watermarkScale})`,
                               maxWidth: '300px'
                            }} 
                         />
                      )
                   )}
                </div>
             </div>
             
          </div>
        </div>
      )}
    </div>
  )
}
