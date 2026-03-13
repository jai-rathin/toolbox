"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Crosshair, Copy } from "lucide-react"
import { tryCopyToClipboard } from "@/components/tools/utils"

export default function ImageColorPicker() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  
  const [hoverColor, setHoverColor] = useState<{r: number, g: number, b: number} | null>(null)
  const [pickedColor, setPickedColor] = useState<{r: number, g: number, b: number} | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string)
      setPickedColor(null)
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      // Keep canvas size manageable for screen
      const MAX_WIDTH = 800
      let w = img.width
      let h = img.height

      if (w > MAX_WIDTH) {
        h = Math.floor((h * MAX_WIDTH) / w)
        w = MAX_WIDTH
      }

      canvas.width = w
      canvas.height = h
      ctx.drawImage(img, 0, 0, w, h)
    }
    img.src = imageSrc
  }, [imageSrc])

  function getPixelColor(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!canvasRef.current) return null
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    const rect = canvas.getBoundingClientRect()
    // scale coordinates
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    const pixel = ctx.getImageData(x, y, 1, 1).data
    return { r: pixel[0], g: pixel[1], b: pixel[2] }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    setHoverColor(getPixelColor(e))
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    setPickedColor(getPixelColor(e))
  }

  function rgbToHex(r: number, g: number, b: number) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()
  }

  async function copyToClipboard(text: string) {
    const ok = await tryCopyToClipboard(text)
    if (ok) {
      setCopied(text)
      setTimeout(() => setCopied(null), 1200)
    }
  }

  const displayColor = pickedColor || hoverColor

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!imageSrc ? (
        <label className="flex flex-col items-center justify-center w-full h-64 md:h-96 border-2 border-dashed border-white/20 rounded-3xl cursor-pointer hover:bg-white/5 hover:border-cyan-500/50 transition-all bg-black/20">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-12 h-12 mb-4 text-gray-400" />
            <p className="mb-2 text-sm text-gray-300"><span className="font-semibold">Click to upload</span> or drag and drop</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-6">
            
            <div className="p-6 bg-black/20 border border-white/10 rounded-3xl sticky top-24">
               <h3 className="text-xl font-medium text-white flex items-center gap-2 mb-6">
                 <Crosshair className="w-5 h-5 text-cyan-400" />
                 Color Picker
               </h3>
               
               <div 
                 className="w-full aspect-square rounded-2xl shadow-inner border border-white/20 mb-6 transition-colors duration-75"
                 style={{ 
                   backgroundColor: displayColor ? `rgb(${displayColor.r}, ${displayColor.g}, ${displayColor.b})` : 'transparent' 
                 }}
               />

               <div className="space-y-4">
                 {displayColor ? (
                   <>
                     <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl group relative cursor-pointer" onClick={() => copyToClipboard(rgbToHex(displayColor.r, displayColor.g, displayColor.b))}>
                        <span className="text-gray-400 text-sm font-medium">HEX</span>
                        <span className="font-mono text-white">{rgbToHex(displayColor.r, displayColor.g, displayColor.b)}</span>
                        {copied === rgbToHex(displayColor.r, displayColor.g, displayColor.b) && <span className="absolute right-2 text-xs text-green-400">Copied!</span>}
                        {copied !== rgbToHex(displayColor.r, displayColor.g, displayColor.b) && <Copy className="absolute right-2 w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                     </div>
                     <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl group relative cursor-pointer" onClick={() => copyToClipboard(`rgb(${displayColor.r}, ${displayColor.g}, ${displayColor.b})`)}>
                        <span className="text-gray-400 text-sm font-medium">RGB</span>
                        <span className="font-mono text-white text-sm">{`rgb(${displayColor.r}, ${displayColor.g}, ${displayColor.b})`}</span>
                        {copied === `rgb(${displayColor.r}, ${displayColor.g}, ${displayColor.b})` && <span className="absolute right-2 text-xs text-green-400">Copied!</span>}
                        {copied !== `rgb(${displayColor.r}, ${displayColor.g}, ${displayColor.b})` && <Copy className="absolute right-2 w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                     </div>
                   </>
                 ) : (
                   <p className="text-sm text-gray-500 text-center py-4">Hover over or click the image to pick colors.</p>
                 )}
               </div>

               <Button onClick={() => setImageSrc(null)} variant="outline" className="w-full mt-6 rounded-xl border-gray-700 bg-transparent hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 text-gray-400">
                  Select New Image
               </Button>
            </div>
            
          </div>

          <div className="md:col-span-3">
             <div className="bg-black/20 border border-white/10 rounded-3xl p-2 inline-flex relative cursor-crosshair">
                <canvas 
                  ref={canvasRef} 
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHoverColor(null)}
                  onClick={handleClick}
                  className="rounded-xl shadow-2xl bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVQ4T2P8////fwY8gHGgHkUDGIa1YBg1gIiKBsKxBhFVSYy1YBg1gIiKBsKxBhEAhP1wIemq4iAAAAAASUVORK5CYII=')] w-full h-auto object-contain"
                />
             </div>
             <p className="text-sm text-gray-500 text-center mt-4">Click to lock a color, hover to preview.</p>
          </div>
        </div>
      )}
    </div>
  )
}
