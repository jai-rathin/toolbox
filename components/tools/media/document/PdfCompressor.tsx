"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileText, RefreshCw, Loader2, Archive } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { PDFDocument } from "pdf-lib"

export default function PdfCompressor() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState("document")
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState(0)
  const [newSize, setNewSize] = useState(0)

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
       alert("Please upload a valid PDF file.")
       return
    }
    setOriginalSize(file.size)
    const url = URL.createObjectURL(file)
    setPdfUrl(url)
    setPdfFile(file)
    setResultUrl(null)
    const nameExt = file.name.lastIndexOf(".")
    setFileName(nameExt > 0 ? file.name.substring(0, nameExt) : file.name)
  }

  const formatSize = (bytes: number) => {
      if (bytes === 0) return "0 B"
      const k = 1024
      const sizes = ["B", "KB", "MB", "GB"]
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const compressPdf = async () => {
    if (!pdfFile) return
    setIsProcessing(true)
    setResultUrl(null)

    try {
      const arrayBuffer = await pdfFile.arrayBuffer()
      // Load the PDF ignoring streams if possible, reducing the object tree
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
      
      // Basic optimization handled by save engine (removes unreferenced objects)
      // Removes metadata overhead, and ensures objects are cleanly rewritten
      pdf.setTitle("")
      pdf.setAuthor("")
      pdf.setSubject("")
      pdf.setKeywords([])
      pdf.setProducer("")
      pdf.setCreator("")

      const dstPdfBytes = await pdf.save({ useObjectStreams: true })
      
      setNewSize(dstPdfBytes.length)
      
      const blob = new Blob([dstPdfBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      
      setResultUrl(url)
    } catch (err) {
      console.error(err)
      alert("Error compressing PDF. Corrupted or securely encrypted file.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!pdfUrl ? (
        <FileUploader 
          onUpload={handleUpload} 
          description="Upload a PDF (Processed entirely in your browser)" 
          accept="application/pdf" 
          icon={<Archive className="w-8 h-8" />} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 <Archive className="w-4 h-4 text-purple-400" /> PDF Compressor
              </h3>
              
              <p className="text-gray-400 text-sm">
                 Compress PDF structure instantly. For heavy image PDFs, external image compression might yield better results.
              </p>
              
              {resultUrl && (
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mt-4 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-400">Original Size:</span>
                         <span className="text-white font-mono">{formatSize(originalSize)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-400">Compressed Size:</span>
                         <span className="text-green-400 font-mono font-bold">{formatSize(newSize)}</span>
                      </div>
                      {originalSize > 0 && (
                          <div className="text-center text-xs font-semibold text-purple-300 mt-2">
                              {originalSize > newSize ? `Saved ${Math.round((1 - (newSize / originalSize)) * 100)}% Space!` : `Optimized Format Standardized`}
                          </div>
                      )}
                  </div>
              )}
              
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              {!resultUrl ? (
                <Button 
                   onClick={compressPdf} 
                   disabled={isProcessing}
                   className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                      Optimizing...
                    </>
                  ) : (
                    `Compress Document`
                  )}
                </Button>
              ) : (
                <Button 
                   onClick={() => {
                     const link = document.createElement("a")
                     link.download = `${fileName}-compressed.pdf`
                     link.href = resultUrl
                     link.click()
                   }} 
                   className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 h-12"
                >
                  <Download className="w-4 h-4 mr-2" /> Download Document
                </Button>
              )}
              <Button 
                 onClick={() => {
                   setPdfUrl(null)
                   setResultUrl(null)
                   setPdfFile(null)
                 }} 
                 variant="ghost" 
                 className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-12"
                 disabled={isProcessing}
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </Button>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col items-center justify-center bg-black/20 border border-white/10 rounded-3xl p-4 min-h-[400px]">
             <div className="w-full h-[600px] flex flex-col gap-4">
                 <h4 className="text-sm font-medium text-gray-400 pl-2">
                    {resultUrl ? "Compressed Document Result" : "Original Document Preview"}
                 </h4>
                 
                 <iframe 
                   src={resultUrl || pdfUrl} 
                   className="w-full h-full rounded-xl bg-white/5 border border-white/10"
                   title="PDF Preview"
                 />
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
