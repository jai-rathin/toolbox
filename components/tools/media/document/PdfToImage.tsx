"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, FileText, RefreshCw, Loader2, Image as ImageIcon } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"

interface ExtractedImage {
  id: string;
  url: string;
  pageNumber: number;
}

export default function PdfToImage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState("document")
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [images, setImages] = useState<ExtractedImage[]>([])
  
  const [quality, setQuality] = useState(2) // Scale factor (1 = normal, 2 = high quality)
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/png")

  const handleUpload = (file: File) => {
    if (file.type !== "application/pdf") {
       alert("Please upload a valid PDF file.")
       return
    }
    const url = URL.createObjectURL(file)
    setPdfUrl(url)
    setPdfFile(file)
    setImages([])
    const nameExt = file.name.lastIndexOf(".")
    setFileName(nameExt > 0 ? file.name.substring(0, nameExt) : file.name)
  }

  const convertToImages = async () => {
    if (!pdfFile) return
    setIsProcessing(true)
    setImages([])

    try {
      const pdfjsLib = await import("pdfjs-dist")
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

      const arrayBuffer = await pdfFile.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      
      const extractedImgs: ExtractedImage[] = []
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum)
          const viewport = page.getViewport({ scale: quality })
          
          const canvas = document.createElement("canvas")
          const context = canvas.getContext("2d")
          
          if (!context) continue
          
          canvas.height = viewport.height
          canvas.width = viewport.width
          
          const renderContext: any = {
              canvasContext: context,
              viewport: viewport
          }
          
          await page.render(renderContext).promise
          const dataUrl = canvas.toDataURL(format, 1.0)
          
          extractedImgs.push({
              id: Math.random().toString(36).substring(7),
              url: dataUrl,
              pageNumber: pageNum
          })
      }

      setImages(extractedImgs)
    } catch (err) {
      console.error(err)
      alert("Error extracting images. The PDF might be corrupted or severely locked.")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadAll = () => {
    // Basic multi-download approach for client side
    images.forEach((img, i) => {
        setTimeout(() => {
            const link = document.createElement("a")
            const ext = format === "image/jpeg" ? "jpg" : "png"
            link.download = `${fileName}-page-${img.pageNumber}.${ext}`
            link.href = img.url
            link.click()
        }, i * 300) // Stagger downloads to prevent browser blocking
    })
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!pdfUrl ? (
        <FileUploader 
          onUpload={handleUpload} 
          description="Upload a PDF to extract pages as Images" 
          accept="application/pdf" 
          icon={<FileText className="w-8 h-8" />} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 <ImageIcon className="w-4 h-4 text-purple-400" /> PDF to Image
              </h3>
              
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="space-y-2">
                   <Label className="text-gray-300">Extraction Quality</Label>
                   <select 
                     value={quality} 
                     onChange={(e) => setQuality(parseFloat(e.target.value))}
                     className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white outline-none"
                     disabled={isProcessing}
                   >
                     <option value="1" className="bg-gray-900">Standard (1x)</option>
                     <option value="2" className="bg-gray-900">High Resolution (2x)</option>
                     <option value="3" className="bg-gray-900">Ultra (3x)</option>
                   </select>
                </div>
                
                <div className="space-y-2">
                   <Label className="text-gray-300">Image Format</Label>
                   <select 
                     value={format} 
                     onChange={(e) => setFormat(e.target.value as any)}
                     className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white outline-none"
                     disabled={isProcessing}
                   >
                     <option value="image/png" className="bg-gray-900">PNG (Lossless)</option>
                     <option value="image/jpeg" className="bg-gray-900">JPG (Smaller)</option>
                   </select>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              {images.length === 0 ? (
                <Button 
                   onClick={convertToImages} 
                   disabled={isProcessing}
                   className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                      Extracting Pages...
                    </>
                  ) : (
                    "Convert to Images"
                  )}
                </Button>
              ) : (
                <Button 
                   onClick={downloadAll} 
                   className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 h-12"
                >
                  <Download className="w-4 h-4 mr-2" /> Download All ({images.length})
                </Button>
              )}
              <Button 
                 onClick={() => {
                   setPdfUrl(null)
                   setPdfFile(null)
                   setImages([])
                 }} 
                 variant="ghost" 
                 className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-12"
                 disabled={isProcessing}
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </Button>
            </div>
          </div>

          <div className="md:col-span-8 bg-black/20 border border-white/10 rounded-3xl p-6 min-h-[400px]">
             <h4 className="text-sm font-medium text-gray-400 mb-4">
                {images.length > 0 ? `Extracted Images (${images.length} pages)` : "Original PDF Preview"}
             </h4>
             
             {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 pb-4">
                   {images.map(img => (
                      <div key={img.id} className="group relative flex flex-col gap-2 p-2 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/50 transition-colors">
                         <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded shadow">
                            Page {img.pageNumber}
                         </div>
                         <img src={img.url} alt={`Page ${img.pageNumber}`} className="w-full aspect-[1/1.4] object-contain bg-white rounded-lg shadow-inner" />
                         <Button 
                           onClick={() => {
                              const link = document.createElement("a")
                              const ext = format === "image/jpeg" ? "jpg" : "png"
                              link.download = `${fileName}-page-${img.pageNumber}.${ext}`
                              link.href = img.url
                              link.click()
                           }}
                           size="sm"
                           className="w-full bg-white/10 hover:bg-purple-500 text-white"
                         >
                            <Download className="w-3 h-3 mr-2" /> Save
                         </Button>
                      </div>
                   ))}
                </div>
             ) : (
                <div className="w-full h-[600px]">
                   <iframe 
                     src={pdfUrl} 
                     className="w-full h-full rounded-xl bg-white/5 border border-white/10"
                     title="PDF Preview"
                   />
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  )
}
