"use client"

import { useState, useCallback, useEffect } from "react"
import { Upload } from "lucide-react"

interface ImageUploaderProps {
  onUpload: (imageSrc: string, file: File) => void
  disabled?: boolean
  description?: string
  accept?: string
}

export function ImageUploader({ 
  onUpload, 
  disabled = false, 
  description = "JPG, PNG, WebP",
  accept = "image/*"
}: ImageUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = (e) => {
      onUpload(e.target?.result as string, file)
    }
    reader.readAsDataURL(file)
  }, [onUpload])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragActive(true)
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragActive(true)
  }, [disabled])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }, [disabled, processFile])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }, [disabled, processFile])

  // Global paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (disabled) return
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile()
          if (file) {
            processFile(file)
          }
          break
        }
      }
    }

    document.addEventListener("paste", handlePaste)
    return () => document.removeEventListener("paste", handlePaste)
  }, [disabled, processFile])

  return (
    <label
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center w-full h-64 md:h-96 border-2 border-dashed rounded-3xl cursor-pointer transition-all overflow-hidden ${
        isDragActive 
          ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]" 
          : "border-white/20 bg-black/20 hover:bg-white/5 hover:border-cyan-500/50"
      } ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center z-10 p-4">
        <div className={`p-4 rounded-full mb-4 transition-colors ${isDragActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-400'}`}>
          <Upload className="w-8 h-8" />
        </div>
        <p className="mb-2 text-sm text-gray-300 md:text-base">
          <span className="font-semibold text-white">Click to upload</span>, drag and drop, or <span className="font-semibold text-white">paste</span> an image (Ctrl+V)
        </p>
        <p className="text-xs text-gray-500 font-medium tracking-wide">
          {description}
        </p>
      </div>
      <input 
        type="file" 
        className="hidden" 
        accept={accept} 
        onChange={handleFileChange} 
        disabled={disabled}
      />
    </label>
  )
}
