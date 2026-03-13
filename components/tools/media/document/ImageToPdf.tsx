"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, FileText, RefreshCw, Loader2, Image as ImageIcon, Plus, GripVertical, Trash2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { PDFDocument } from "pdf-lib"

interface ImageFile {
  id: string;
  file: File;
  name: string;
  url: string;
}

export default function ImageToPdf() {
  const [images, setImages] = useState<ImageFile[]>([])
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)

  const handleUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
       alert("Please upload a valid image file.")
       return
    }
    
    setImages(prev => [...prev, {
       id: Math.random().toString(36).substring(7),
       file,
       name: file.name,
       url: URL.createObjectURL(file)
    }])
  }

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(t => t.id !== id))
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newImgs = [...images]
      const temp = newImgs[index - 1]
      newImgs[index - 1] = newImgs[index]
      newImgs[index] = temp
      setImages(newImgs)
    } else if (direction === 'down' && index < images.length - 1) {
      const newImgs = [...images]
      const temp = newImgs[index + 1]
      newImgs[index + 1] = newImgs[index]
      newImgs[index] = temp
      setImages(newImgs)
    }
  }

  const generatePdf = async () => {
    if (images.length === 0) return
    setIsProcessing(true)
    setResultUrl(null)

    try {
      const pdfDoc = await PDFDocument.create()

      for (const imgItem of images) {
        const imageBytes = await imgItem.file.arrayBuffer()
        
        let pdfImage;
        if (imgItem.file.type === "image/jpeg" || imgItem.file.type === "image/jpg") {
            pdfImage = await pdfDoc.embedJpg(imageBytes)
        } else if (imgItem.file.type === "image/png") {
            pdfImage = await pdfDoc.embedPng(imageBytes)
        } else {
            alert(`Unsupported image type: ${imgItem.file.type}. Only JPG and PNG are fully supported natively. Skipping ${imgItem.name}...`)
            continue
        }

        const dims = pdfImage.scale(1)
        const page = pdfDoc.addPage([dims.width, dims.height])
        
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: dims.width,
          height: dims.height,
        })
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      
      setResultUrl(url)
    } catch (err) {
      console.error(err)
      alert("Error generating PDF. Some images might be corrupted or unsupported.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
          
          <div className="space-y-4 pt-2">
            <h3 className="font-semibold text-white flex items-center gap-2">
               <ImageIcon className="w-5 h-5 text-purple-400" /> Image to PDF
            </h3>
            <p className="text-sm text-gray-400">Convert JPG and PNG images into a PDF document.</p>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            {!resultUrl ? (
              <Button 
                 onClick={generatePdf} 
                 disabled={isProcessing || images.length === 0}
                 className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                    Generating PDF...
                  </>
                ) : images.length === 0 ? (
                  "Add images to start"
                ) : (
                  `Create PDF (${images.length} pages)`
                )}
              </Button>
            ) : (
              <Button 
                 onClick={() => {
                   const link = document.createElement("a")
                   link.download = `images-to-pdf.pdf`
                   link.href = resultUrl
                   link.click()
                 }} 
                 className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 h-12"
              >
                <Download className="w-4 h-4 mr-2" /> Download PDF Result
              </Button>
            )}
            <Button 
               onClick={() => {
                 setImages([])
                 setResultUrl(null)
               }} 
               variant="ghost" 
               className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-12"
               disabled={isProcessing}
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Clear All
            </Button>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col gap-4 bg-black/20 border border-white/10 rounded-3xl p-6 min-h-[400px]">
           <h4 className="text-sm font-medium text-gray-400 mb-2">Image Sequence</h4>
           
           {!resultUrl && (
               <div className="h-48 border-2 border-dashed border-white/10 rounded-xl hover:border-purple-500/50 transition-colors bg-white/5 relative mb-4">
                  <FileUploader 
                    onUpload={handleUpload} 
                    description="Drop JPG or PNG images here" 
                    icon={<ImageIcon className="w-6 h-6" />}
                    accept="image/*"
                  />
               </div>
           )}

           {resultUrl && (
               <div className="w-full space-y-2 mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                 <h4 className="text-sm font-semibold text-purple-300">Generated PDF Preview</h4>
                 <iframe src={resultUrl} className="w-full h-96 rounded bg-white shadow-inner" />
               </div>
           )}

           <div className="space-y-2 flex-1 overflow-y-auto pr-2">
             {images.map((img, index) => (
               <div key={img.id} className="flex gap-4 items-center bg-gray-900 border border-white/5 p-3 rounded-xl shadow-sm">
                 <div className="flex flex-col gap-1 text-gray-500">
                   <button onClick={() => moveImage(index, 'up')} disabled={index === 0} className="hover:text-purple-400 disabled:opacity-30">▲</button>
                   <button onClick={() => moveImage(index, 'down')} disabled={index === images.length - 1} className="hover:text-purple-400 disabled:opacity-30">▼</button>
                 </div>
                 
                 <img src={img.url} alt="Preview" className="w-16 h-16 object-cover rounded shadow-md bg-black" />
                 
                 <div className="flex-1 min-w-0">
                   <p className="text-sm text-gray-200 truncate font-medium">Page {index + 1}. {img.name}</p>
                   <p className="text-xs text-gray-500">{(img.file.size / 1024 / 1024).toFixed(2)} MB</p>
                 </div>
                 <Button onClick={() => removeImage(img.id)} variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/20 hover:text-red-300 shrink-0">
                   <Trash2 className="w-4 h-4" />
                 </Button>
               </div>
             ))}
             {images.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">No images added yet.</div>
             )}
           </div>
        </div>
      </div>
    </div>
  )
}
