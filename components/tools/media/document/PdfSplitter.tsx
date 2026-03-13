"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, FileText, RefreshCw, Loader2, Scissors } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { PDFDocument } from "pdf-lib"

export default function PdfSplitter() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState("document")
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  
  const [totalPages, setTotalPages] = useState(0)
  const [startPage, setStartPage] = useState(1)
  const [endPage, setEndPage] = useState(1)

  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
       alert("Please upload a valid PDF file.")
       return
    }
    
    // Read PDF to get actual page count
    try {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const pages = pdf.getPageCount()
        
        setTotalPages(pages)
        setEndPage(pages)
        setStartPage(1)
        
        const url = URL.createObjectURL(file)
        setPdfUrl(url)
        setPdfFile(file)
        setResultUrl(null)
        const nameExt = file.name.lastIndexOf(".")
        setFileName(nameExt > 0 ? file.name.substring(0, nameExt) : file.name)
    } catch (e) {
        alert("Failed to read PDF. It might be encrypted.")
    }
  }

  const splitPdf = async () => {
    if (!pdfFile || startPage > endPage || startPage < 1 || endPage > totalPages) return
    setIsProcessing(true)
    setResultUrl(null)

    try {
      const arrayBuffer = await pdfFile.arrayBuffer()
      const srcPdf = await PDFDocument.load(arrayBuffer)
      const dstPdf = await PDFDocument.create()

      // Pages in pdf-lib are 0-indexed
      const indicesToCopy = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage - 1 + i)
      
      const copiedPages = await dstPdf.copyPages(srcPdf, indicesToCopy)
      copiedPages.forEach((page) => {
         dstPdf.addPage(page)
      })

      const dstPdfBytes = await dstPdf.save()
      const blob = new Blob([dstPdfBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      
      setResultUrl(url)
    } catch (err) {
      console.error(err)
      alert("Error extracting pages. Corrupted or encrypted file might be included.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!pdfUrl ? (
        <FileUploader 
          onUpload={handleUpload} 
          description="Upload a PDF (No server uploads, processed in browser)" 
          accept="application/pdf" 
          icon={<FileText className="w-8 h-8" />} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 <Scissors className="w-4 h-4 text-purple-400" /> PDF Splitter
              </h3>
              
              <p className="text-gray-400 text-sm">Total Pages: <strong className="text-white">{totalPages}</strong></p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-2">
                   <Label className="text-gray-300">Start Page</Label>
                   <input 
                     type="number" 
                     min="1" 
                     max={endPage} 
                     value={startPage} 
                     onChange={(e) => setStartPage(parseInt(e.target.value) || 1)} 
                     className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white"
                     disabled={isProcessing}
                   />
                </div>
                <div className="space-y-2">
                   <Label className="text-gray-300">End Page</Label>
                   <input 
                     type="number" 
                     min={startPage} 
                     max={totalPages} 
                     value={endPage} 
                     onChange={(e) => setEndPage(parseInt(e.target.value) || totalPages)} 
                     className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white"
                     disabled={isProcessing}
                   />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              {!resultUrl ? (
                <Button 
                   onClick={splitPdf} 
                   disabled={isProcessing}
                   className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                      Extracting...
                    </>
                  ) : (
                    `Extract Pages ${startPage}-${endPage}`
                  )}
                </Button>
              ) : (
                <Button 
                   onClick={() => {
                     const link = document.createElement("a")
                     link.download = `${fileName}-pages-${startPage}-${endPage}.pdf`
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
                    {resultUrl ? "Extracted Document Result" : "Original Document Preview"}
                 </h4>
                 
                 {/* Standard browser PDF viewer embed */}
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
