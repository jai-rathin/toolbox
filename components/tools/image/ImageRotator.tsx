"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, RotateCw } from "lucide-react"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { RotationWheel } from "@/components/ui/RotationWheel"

export default function ImageRotator() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleUpload = (src: string) => {
    setImageSrc(src)
    setRotation(0)
  }

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      // Calculate rotation
      const rad = (rotation * Math.PI) / 180
      
      // Calculate new bounding box to ensure image fits when rotated freely
      const sin = Math.abs(Math.sin(rad))
      const cos = Math.abs(Math.cos(rad))
      canvas.width = img.width * cos + img.height * sin
      canvas.height = img.width * sin + img.height * cos

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(rad)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)
    }
    img.src = imageSrc
  }, [imageSrc, rotation])

  function downloadImage() {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = `rotated-${rotation}deg.png`
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
            
            <div className="flex flex-col items-center justify-center space-y-6 pt-2 pb-6 border-b border-white/10">
               <h3 className="font-semibold text-white flex items-center gap-2 w-full text-left bg-white/5 p-3 rounded-xl mb-4">
                 <RotateCw className="w-4 h-4 text-cyan-400" /> Interactive Rotation
               </h3>
               
               <RotationWheel 
                  value={rotation} 
                  onChange={setRotation} 
                  onReset={() => setRotation(0)} 
                  size={180}
               />
            </div>

            <div className="space-y-3 pt-2">
              <Button onClick={downloadImage} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-lg shadow-cyan-500/20 h-12">
                <Download className="w-4 h-4 mr-2" /> Download Image
              </Button>
              <Button onClick={() => setImageSrc(null)} variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-12">
                Start Over
              </Button>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col items-center justify-center bg-black/20 border border-white/10 rounded-3xl p-8 min-h-[400px] overflow-hidden">
            <canvas 
              ref={canvasRef} 
              className="max-w-full max-h-[600px] object-contain rounded transition-[transform] duration-75 shadow-2xl pointer-events-none"
              style={{ background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVQ4T2P8////fwY8gHGgHkUDGIa1YBg1gIiKBsKxBhFVSYy1YBg1gIiKBsKxBhEAhP1wIemq4iAAAAAASUVORK5CYII=") repeat' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
