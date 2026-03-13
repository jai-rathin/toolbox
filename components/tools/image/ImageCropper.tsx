"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Crop as CropIcon } from "lucide-react"
import { ImageUploader } from "@/components/ui/ImageUploader"
import Cropper, { Area } from "react-easy-crop"

export default function ImageCropper() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  
  // Cropper state
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspect, setAspect] = useState<number | undefined>(undefined) // Free crop default
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const handleUpload = (src: string) => {
    setImageSrc(src)
  }

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  function downloadCroppedImage() {
    if (!imageSrc || !croppedAreaPixels) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height
      
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      )

      const link = document.createElement("a")
      link.download = `cropped-image.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
    img.src = imageSrc
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!imageSrc ? (
        <ImageUploader onUpload={handleUpload} description="JPG, PNG, WebP" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 <CropIcon className="w-4 h-4 text-cyan-400" /> Crop Area
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => setAspect(undefined)} className={`h-10 text-sm font-medium rounded-xl transition-colors ${aspect === undefined ? "bg-cyan-500 text-white shadow" : "bg-white/5 text-gray-400 hover:text-white"}`}>Free</button>
                 <button onClick={() => setAspect(1)} className={`h-10 text-sm font-medium rounded-xl transition-colors ${aspect === 1 ? "bg-cyan-500 text-white shadow" : "bg-white/5 text-gray-400 hover:text-white"}`}>1:1 Square</button>
                 <button onClick={() => setAspect(4/3)} className={`h-10 text-sm font-medium rounded-xl transition-colors ${aspect === 4/3 ? "bg-cyan-500 text-white shadow" : "bg-white/5 text-gray-400 hover:text-white"}`}>4:3 Standard</button>
                 <button onClick={() => setAspect(16/9)} className={`h-10 text-sm font-medium rounded-xl transition-colors ${aspect === 16/9 ? "bg-cyan-500 text-white shadow" : "bg-white/5 text-gray-400 hover:text-white"}`}>16:9 Wide</button>
                 <button onClick={() => setAspect(9/16)} className={`h-10 text-sm font-medium rounded-xl transition-colors ${aspect === 9/16 ? "bg-cyan-500 text-white shadow" : "bg-white/5 text-gray-400 hover:text-white"}`}>9:16 Mobile</button>
              </div>

              <div className="pt-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Zoom</span>
                    <span className="text-cyan-400 font-mono">{zoom.toFixed(1)}x</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="3" 
                    step="0.1" 
                    value={zoom} 
                    onChange={(e) => setZoom(parseFloat(e.target.value))} 
                    className="w-full accent-cyan-500"
                  />
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              <Button onClick={downloadCroppedImage} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-lg shadow-cyan-500/20 h-12">
                <Download className="w-4 h-4 mr-2" /> Download Crop
              </Button>
              <Button onClick={() => setImageSrc(null)} variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-12">
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </Button>
            </div>
          </div>

          <div className="md:col-span-8 relative bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVQ4T2P8////fwY8gHGgHkUDGIa1YBg1gIiKBsKxBhFVSYy1YBg1gIiKBsKxBhEAhP1wIemq4iAAAAAASUVORK5CYII=')] border border-white/10 rounded-3xl min-h-[500px] overflow-hidden group">
             {/* react-easy-crop applies to absolute positional div */}
             <div className="absolute inset-0 m-4 rounded-xl overflow-hidden shadow-inner">
               <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  classes={{
                    containerClassName: "w-full h-full",
                    cropAreaClassName: "border-2 border-cyan-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
                  }}
               />
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
