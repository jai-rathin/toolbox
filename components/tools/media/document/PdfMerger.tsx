"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileText, RefreshCw, Loader2, Plus, GripVertical, Trash2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { PDFDocument } from "pdf-lib"

interface PdfFile {
  id: string;
  file: File;
  name: string;
}

export default function PdfMerger() {
  const [pdfs, setPdfs] = useState<PdfFile[]>([])
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)

  const handleUpload = (file: File) => {
    if (file.type !== "application/pdf") {
       alert("Please upload a valid PDF file.")
       return
    }
    
    setPdfs(prev => [...prev, {
       id: Math.random().toString(36).substring(7),
       file,
       name: file.name
    }])
  }

  const removePdf = (id: string) => {
    setPdfs(prev => prev.filter(t => t.id !== id))
  }

  const movePdf = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newPdfs = [...pdfs]
      const temp = newPdfs[index - 1]
      newPdfs[index - 1] = newPdfs[index]
      newPdfs[index] = temp
      setPdfs(newPdfs)
    } else if (direction === 'down' && index < pdfs.length - 1) {
      const newPdfs = [...pdfs]
      const temp = newPdfs[index + 1]
      newPdfs[index + 1] = newPdfs[index]
      newPdfs[index] = temp
      setPdfs(newPdfs)
    }
  }

  const mergePdfs = async () => {
    if (pdfs.length < 2) return
    setIsProcessing(true)
    setResultUrl(null)

    try {
      const mergedPdf = await PDFDocument.create()

      for (const pdfItem of pdfs) {
        const arrayBuffer = await pdfItem.file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => {
           mergedPdf.addPage(page)
        })
      }

      const mergedPdfFile = await mergedPdf.save()
      const blob = new Blob([mergedPdfFile as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      
      setResultUrl(url)
    } catch (err) {
      console.error(err)
      alert("Error merging PDFs. Corrupted or encrypted file might be included.")
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
               <Plus className="w-5 h-5 text-purple-400" /> PDF Merger
            </h3>
            <p className="text-sm text-gray-400">Combine multiple PDF files sequentially into a single document.</p>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            {!resultUrl ? (
              <Button 
                 onClick={mergePdfs} 
                 disabled={isProcessing || pdfs.length < 2}
                 className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                    Merging PDFs...
                  </>
                ) : pdfs.length < 2 ? (
                  "Add at least 2 PDFs"
                ) : (
                  `Merge ${pdfs.length} PDFs`
                )}
              </Button>
            ) : (
              <Button 
                 onClick={() => {
                   const link = document.createElement("a")
                   link.download = `merged-document.pdf`
                   link.href = resultUrl
                   link.click()
                 }} 
                 className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 h-12"
              >
                <Download className="w-4 h-4 mr-2" /> Download Merged PDF
              </Button>
            )}
            <Button 
               onClick={() => {
                 setPdfs([])
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
           <h4 className="text-sm font-medium text-gray-400 mb-2">PDF Sequence</h4>
           
           {!resultUrl && (
               <div className="h-48 border-2 border-dashed border-white/10 rounded-xl hover:border-purple-500/50 transition-colors bg-white/5 relative mb-4">
                  <FileUploader 
                    onUpload={handleUpload} 
                    description="Drop another PDF here" 
                    icon={<FileText className="w-6 h-6" />}
                    accept="application/pdf"
                  />
               </div>
           )}

           {resultUrl && (
               <div className="w-full space-y-2 mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                 <h4 className="text-sm font-semibold text-purple-300">Merged PDF Preview</h4>
                 <iframe src={resultUrl} className="w-full h-96 rounded bg-white shadow-inner" />
               </div>
           )}

           <div className="space-y-2 flex-1 overflow-y-auto pr-2">
             {pdfs.map((pdf, index) => (
               <div key={pdf.id} className="flex gap-3 items-center bg-gray-900 border border-white/5 p-3 rounded-xl shadow-sm">
                 <div className="flex flex-col gap-1 text-gray-500">
                   <button onClick={() => movePdf(index, 'up')} disabled={index === 0} className="hover:text-purple-400 disabled:opacity-30">▲</button>
                   <button onClick={() => movePdf(index, 'down')} disabled={index === pdfs.length - 1} className="hover:text-purple-400 disabled:opacity-30">▼</button>
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm text-gray-200 truncate font-medium">{index + 1}. {pdf.name}</p>
                   <p className="text-xs text-gray-500">{(pdf.file.size / 1024 / 1024).toFixed(2)} MB</p>
                 </div>
                 <Button onClick={() => removePdf(pdf.id)} variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/20 hover:text-red-300 shrink-0">
                   <Trash2 className="w-4 h-4" />
                 </Button>
               </div>
             ))}
             {pdfs.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">No PDFs added yet.</div>
             )}
           </div>
        </div>
      </div>
    </div>
  )
}
