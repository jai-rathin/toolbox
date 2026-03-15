"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, FileText, RefreshCw, Loader2, Lock, Unlock, Info, ShieldCheck } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { PDFDocument } from "pdf-lib"

type Mode = "protect" | "remove"

export default function PdfProtect() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState("document")
  const [totalPages, setTotalPages] = useState(0)

  const [mode, setMode] = useState<Mode>("protect")
  const [userPassword, setUserPassword] = useState("")
  const [ownerPassword, setOwnerPassword] = useState("")
  const [unlockPassword, setUnlockPassword] = useState("")

  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [statusMsg, setStatusMsg] = useState("")

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf") { alert("Please upload a valid PDF file."); return }
    try {
      const ab = await file.arrayBuffer()
      const pdf = await PDFDocument.load(ab, { ignoreEncryption: true })
      setTotalPages(pdf.getPageCount())
      setPdfFile(file)
      setPdfUrl(URL.createObjectURL(file))
      setResultUrl(null)
      setStatusMsg("")
      const dot = file.name.lastIndexOf(".")
      setFileName(dot > 0 ? file.name.substring(0, dot) : file.name)
    } catch { alert("Failed to read PDF.") }
  }

  const protectPdf = async () => {
    if (!pdfFile || !userPassword.trim()) return
    setIsProcessing(true)
    setResultUrl(null)
    setStatusMsg("")
    try {
      const ab = await pdfFile.arrayBuffer()
      const pdfDoc = await PDFDocument.load(ab, { ignoreEncryption: true })
      const pdfAny: any = pdfDoc
      pdfAny.encrypt({
        userPassword: userPassword,
        ownerPassword: ownerPassword || userPassword,
        permissions: {
          printing: "highQuality",
          modifying: false,
          copying: false,
          annotating: false,
          fillingForms: true,
          contentAccessibility: true,
          documentAssembly: false,
        },
      })
      const bytes = await pdfDoc.save()
      const blob = new Blob([bytes as any], { type: "application/pdf" })
      setResultUrl(URL.createObjectURL(blob))
      setStatusMsg("PDF encrypted successfully!")
    } catch (err) {
      console.error(err)
      alert("Error encrypting PDF. The file may already be encrypted or corrupted.")
    } finally { setIsProcessing(false) }
  }

  const removePdfProtection = async () => {
    if (!pdfFile) return
    setIsProcessing(true)
    setResultUrl(null)
    setStatusMsg("")
    try {
      const ab = await pdfFile.arrayBuffer()
      const pdf = await PDFDocument.load(ab, {
        ignoreEncryption: true,
      })

      // Save without encryption — re-creates the PDF structure without password
      const bytes = await pdf.save()
      const blob = new Blob([bytes as any], { type: "application/pdf" })
      setResultUrl(URL.createObjectURL(blob))
      setStatusMsg("Password protection removed (if the PDF was not heavily encrypted).")
    } catch (err) {
      console.error(err)
      alert("Cannot remove protection. The PDF might use strong encryption that requires the correct password.")
    } finally { setIsProcessing(false) }
  }

  const startOver = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setPdfFile(null); setPdfUrl(null); setResultUrl(null); setStatusMsg("")
    setUserPassword(""); setOwnerPassword(""); setUnlockPassword("")
    setTotalPages(0)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!pdfUrl ? (
        <FileUploader onUpload={handleUpload} description="Upload a PDF to add or remove password protection" accept="application/pdf" icon={<ShieldCheck className="w-8 h-8" />} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            <div className="space-y-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" /> PDF Protection
              </h3>
              {totalPages > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 rounded-lg px-3 py-2">
                  <Info className="w-3.5 h-3.5" />
                  <span>{fileName}.pdf · {totalPages} page{totalPages > 1 ? "s" : ""}</span>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              {/* Mode toggle */}
              <div className="flex gap-2">
                <button onClick={() => setMode("protect")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === "protect" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"}`}>
                  <Lock className="w-3.5 h-3.5" /> Protect
                </button>
                <button onClick={() => setMode("remove")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === "remove" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"}`}>
                  <Unlock className="w-3.5 h-3.5" /> Remove
                </button>
              </div>

              {mode === "protect" ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-gray-300 text-xs uppercase tracking-wider">User Password (required)</Label>
                    <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white text-sm outline-none focus:border-purple-500/50" placeholder="Password to open PDF" disabled={isProcessing} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-300 text-xs uppercase tracking-wider">Owner Password (optional)</Label>
                    <input type="password" value={ownerPassword} onChange={(e) => setOwnerPassword(e.target.value)} className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-white text-sm outline-none focus:border-purple-500/50" placeholder="Password for full access" disabled={isProcessing} />
                    <p className="text-xs text-gray-500">If empty, same as user password</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-xs text-amber-300">This will attempt to re-save the PDF without encryption. Works for lightly protected PDFs.</p>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              {statusMsg && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-300">{statusMsg}</div>
              )}

              {!resultUrl ? (
                <Button
                  onClick={mode === "protect" ? protectPdf : removePdfProtection}
                  disabled={isProcessing || (mode === "protect" && !userPassword.trim())}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12"
                >
                  {isProcessing ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>) : mode === "protect" ? (<><Lock className="w-4 h-4 mr-2" /> Encrypt PDF</>) : (<><Unlock className="w-4 h-4 mr-2" /> Remove Protection</>)}
                </Button>
              ) : (
                <Button onClick={() => { const a = document.createElement("a"); a.download = `${fileName}-${mode === "protect" ? "protected" : "unlocked"}.pdf`; a.href = resultUrl; a.click() }} className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 h-12">
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
              )}
              <Button onClick={startOver} variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-10" disabled={isProcessing}>
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </Button>
            </div>
          </div>

          <div className="md:col-span-8 bg-black/20 border border-white/10 rounded-3xl p-4 min-h-[400px]">
            <div className="w-full h-[600px] flex flex-col gap-4">
              <h4 className="text-sm font-medium text-gray-400 pl-2">{resultUrl ? (mode === "protect" ? "Protected PDF" : "Unlocked PDF") : "Original PDF"}</h4>
              <iframe src={resultUrl || pdfUrl!} className="w-full h-full rounded-xl bg-white/5 border border-white/10" title="PDF Preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
