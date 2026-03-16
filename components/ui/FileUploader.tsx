"use client"

import { useState, useCallback, useEffect } from "react"
import { Upload } from "lucide-react"

interface FileUploaderProps {
  onUpload: (file: File) => void
  disabled?: boolean
  description?: string
  accept?: string
  icon?: React.ReactNode
  multiple?: boolean
}

export function FileUploader({ 
  onUpload, 
  disabled = false, 
  description = "Upload file",
  accept = "*/*",
  icon = <Upload className="w-8 h-8" />,
  multiple = false
}: FileUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const processFile = useCallback((file: File) => {
    onUpload(file)
  }, [onUpload])

  const processFiles = useCallback((files: FileList) => {
    if (multiple) {
      Array.from(files).forEach(f => processFile(f))
    } else if (files.length > 0) {
      processFile(files[0])
    }
  }, [multiple, processFile])

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
      processFiles(files)
    }
  }, [disabled, processFiles])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const files = e.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
    // Reset input value so re-selecting same file works
    e.target.value = ""
  }, [disabled, processFiles])

  // Global paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (disabled) return
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        const file = items[i].getAsFile()
        if (file) {
          processFile(file)
          if (!multiple) break
        }
      }
    }

    document.addEventListener("paste", handlePaste)
    return () => document.removeEventListener("paste", handlePaste)
  }, [disabled, processFile, multiple])

  return (
    <label
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center w-full min-h-[16rem] md:min-h-[24rem] border-2 border-dashed rounded-3xl cursor-pointer transition-all overflow-hidden p-6 ${
        isDragActive 
          ? "border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]" 
          : "border-white/20 bg-black/20 hover:bg-white/5 hover:border-purple-500/50"
      } ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
    >
      <div className="flex flex-col items-center justify-center text-center z-10 max-w-full">
        <div className={`p-4 rounded-full mb-4 transition-colors ${isDragActive ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-400'}`}>
          {icon}
        </div>
        <p className="mb-2 text-sm text-gray-300 md:text-base px-2">
          <span className="font-semibold text-white">Click to upload</span>, drag and drop, or <span className="font-semibold text-white">paste</span>
        </p>
        <p className="text-xs text-gray-500 font-medium tracking-wide max-w-sm px-4 balance">
          {description}
        </p>
      </div>
      <input 
        type="file" 
        className="hidden" 
        accept={accept} 
        onChange={handleFileChange} 
        disabled={disabled}
        multiple={multiple}
      />
    </label>
  )
}
