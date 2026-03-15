"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, RefreshCw, Info, Calendar, User, Hash, FileType, HardDrive } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { PDFDocument } from "pdf-lib"

interface PdfMeta {
  title: string | undefined
  author: string | undefined
  subject: string | undefined
  creator: string | undefined
  producer: string | undefined
  creationDate: Date | undefined
  modificationDate: Date | undefined
  pageCount: number
  fileSize: number
  fileName: string
}

export default function PdfMetadataViewer() {
  const [meta, setMeta] = useState<PdfMeta | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf") { alert("Please upload a valid PDF file."); return }
    try {
      const ab = await file.arrayBuffer()
      const pdf = await PDFDocument.load(ab, { ignoreEncryption: true })
      setMeta({
        title: pdf.getTitle(),
        author: pdf.getAuthor(),
        subject: pdf.getSubject(),
        creator: pdf.getCreator(),
        producer: pdf.getProducer(),
        creationDate: pdf.getCreationDate(),
        modificationDate: pdf.getModificationDate(),
        pageCount: pdf.getPageCount(),
        fileSize: file.size,
        fileName: file.name,
      })
      setPdfUrl(URL.createObjectURL(file))
    } catch {
      alert("Failed to read PDF metadata. The file may be encrypted.")
    }
  }

  const formatDate = (d: Date | undefined) => {
    if (!d) return "—"
    try { return d.toLocaleString() } catch { return "—" }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const startOver = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    setMeta(null); setPdfUrl(null)
  }

  const rows: { icon: React.ReactNode; label: string; value: string }[] = meta ? [
    { icon: <FileText className="w-4 h-4" />, label: "File Name", value: meta.fileName },
    { icon: <HardDrive className="w-4 h-4" />, label: "File Size", value: formatSize(meta.fileSize) },
    { icon: <Hash className="w-4 h-4" />, label: "Pages", value: String(meta.pageCount) },
    { icon: <FileType className="w-4 h-4" />, label: "Title", value: meta.title || "—" },
    { icon: <User className="w-4 h-4" />, label: "Author", value: meta.author || "—" },
    { icon: <Info className="w-4 h-4" />, label: "Subject", value: meta.subject || "—" },
    { icon: <Info className="w-4 h-4" />, label: "Creator", value: meta.creator || "—" },
    { icon: <Info className="w-4 h-4" />, label: "Producer", value: meta.producer || "—" },
    { icon: <Calendar className="w-4 h-4" />, label: "Created", value: formatDate(meta.creationDate) },
    { icon: <Calendar className="w-4 h-4" />, label: "Modified", value: formatDate(meta.modificationDate) },
  ] : []

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!meta ? (
        <FileUploader onUpload={handleUpload} description="Upload a PDF to view its metadata" accept="application/pdf" icon={<Info className="w-8 h-8" />} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            <div className="space-y-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-400" /> PDF Metadata
              </h3>
            </div>

            <div className="space-y-1 pt-4 border-t border-white/5">
              {rows.map((row, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="text-gray-500 shrink-0">{row.icon}</div>
                  <span className="text-sm text-gray-400 w-24 shrink-0">{row.label}</span>
                  <span className="text-sm text-white font-medium truncate flex-1">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10">
              <Button onClick={startOver} variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-10">
                <RefreshCw className="w-4 h-4 mr-2" /> Upload Another
              </Button>
            </div>
          </div>

          <div className="md:col-span-7 bg-black/20 border border-white/10 rounded-3xl p-4 min-h-[400px]">
            <div className="w-full h-[600px] flex flex-col gap-4">
              <h4 className="text-sm font-medium text-gray-400 pl-2">Document Preview</h4>
              <iframe src={pdfUrl!} className="w-full h-full rounded-xl bg-white/5 border border-white/10" title="PDF Preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
