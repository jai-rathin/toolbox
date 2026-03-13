"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, Info } from "lucide-react"

type Metadata = {
  name: string
  size: number
  type: string
  lastModified: number
  width: number
  height: number
}

export default function ImageMetadataViewer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<Metadata | null>(null)

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const src = event.target?.result as string
      setImageSrc(src)

      const img = new Image()
      img.onload = () => {
        setMetadata({
          name: file.name,
          size: file.size,
          type: file.type || "Unknown",
          lastModified: file.lastModified,
          width: img.width,
          height: img.height,
        })
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }

  function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!imageSrc ? (
        <label className="flex flex-col items-center justify-center w-full h-64 md:h-96 border-2 border-dashed border-white/20 rounded-3xl cursor-pointer hover:bg-white/5 hover:border-cyan-500/50 transition-all bg-black/20">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-12 h-12 mb-4 text-gray-400" />
            <p className="mb-2 text-sm text-gray-300"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">JPG, PNG, WebP, GIF</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center justify-center bg-black/20 border border-white/10 rounded-3xl p-4 min-h-[300px]">
            <img src={imageSrc} alt="Preview" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
          </div>
          
          <div className="space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            <h3 className="text-xl font-medium text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-cyan-400" />
              File Metadata
            </h3>
            
            {metadata ? (
              <div className="space-y-4">
                {[
                  { label: "File Name", value: metadata.name },
                  { label: "Dimensions", value: `${metadata.width} × ${metadata.height} px` },
                  { label: "File Size", value: formatBytes(metadata.size) },
                  { label: "MIME Type", value: metadata.type },
                  { label: "Last Modified", value: new Date(metadata.lastModified).toLocaleString() }
                ].map(info => (
                  <div key={info.label} className="flex flex-col gap-1 border-b border-white/5 pb-2 last:border-0">
                    <Label className="text-xs text-gray-500 uppercase tracking-widest">{info.label}</Label>
                    <div className="text-sm font-mono text-gray-200 break-all">{info.value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">Reading metadata...</div>
            )}

            <div className="pt-4 mt-6">
              <Button onClick={() => { setImageSrc(null); setMetadata(null) }} variant="outline" className="w-full rounded-xl border-gray-700 bg-transparent hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 text-gray-400">
                Inspect Another Image
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
