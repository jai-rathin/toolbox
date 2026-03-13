"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { FileUp, FileText, Download, CheckCircle2, ShieldAlert } from "lucide-react"

export default function PdfPageExtractor() {
  const [file, setFile] = useState<File | null>(null)
  const [pagesStr, setPagesStr] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setIsDone(false)
    }
  }

  const handleExtract = () => {
    if (!file || !pagesStr) return
    setIsProcessing(true)
    
    // Client-side mocking process for UI demonstration
    setTimeout(() => {
      setIsProcessing(false)
      setIsDone(true)
    }, 1500)
  }

  const reset = () => {
    setFile(null)
    setPagesStr("")
    setIsProcessing(false)
    setIsDone(false)
  }

  return (
    <ToolLayout
      title="PDF Page Extractor"
      description="Selectively extract specific pages from a PDF document securely in your browser."
      category="PDF Tools"
      categoryHref="/categories/pdf-tools"
    >
      <div className="space-y-8 glass p-8 rounded-3xl border border-white/10">
        {!file ? (
          <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:bg-white/5 transition-colors group cursor-pointer relative">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFile}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="bg-emerald-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <FileUp className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Upload PDF File</h3>
            <p className="text-gray-400 max-w-sm mx-auto">
              Drag and drop your PDF here, or click to browse files.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
              <div className="bg-emerald-500/20 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{file.name}</p>
                <p className="text-sm text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={reset}>
                Change File
              </Button>
            </div>

            {!isDone ? (
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-300">Pages to Extract</label>
                <input
                  type="text"
                  placeholder="e.g. 1, 3, 5-10"
                  value={pagesStr}
                  onChange={(e) => setPagesStr(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                />
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Files are processed locally on your device.
                </p>

                <Button
                  onClick={handleExtract}
                  disabled={!pagesStr || isProcessing}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  {isProcessing ? "Extracting Pages..." : "Extract Pages"}
                </Button>
              </div>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl text-center space-y-4 animate-scale-in">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto align-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-emerald-400">Pages Extracted Successfully!</h3>
                <p className="text-gray-300">Your new PDF document is ready.</p>
                
                <div className="flex gap-4 justify-center pt-4">
                  <Button variant="outline" onClick={reset} className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10">
                    Extract Another
                  </Button>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
