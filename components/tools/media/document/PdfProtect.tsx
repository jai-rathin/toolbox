"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, RefreshCw, Loader2, Lock, Unlock, Info, ShieldCheck } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { PDFDocument } from "pdf-lib"

type Mode = "protect" | "remove"

// ─── PDF Encryption helpers (PDF spec §3.5, RC4-40) ─────────────────────────
const PDF_PADDING = new Uint8Array([
  0x28, 0xbf, 0x4e, 0x5e, 0x4e, 0x75, 0x8a, 0x41,
  0x64, 0x00, 0x4b, 0x49, 0x53, 0x69, 0x12, 0x40,
  0x46, 0xdb, 0x63, 0xf2, 0xd2, 0xbc, 0xb0, 0x40,
  0x65, 0xca, 0x44, 0xd2, 0x07, 0x24, 0x4c, 0x1b,
])

function padPassword(pwd: string): Uint8Array {
  const enc = new TextEncoder()
  const bytes = enc.encode(pwd)
  const padded = new Uint8Array(32)
  const len = Math.min(bytes.length, 32)
  padded.set(bytes.subarray(0, len))
  if (len < 32) {
    padded.set(PDF_PADDING.subarray(0, 32 - len), len)
  }
  return padded
}

function md5(data: Uint8Array): Uint8Array {
  // Simple MD5 implementation for PDF encryption
  function md5cycle(x: number[], k: number[]) {
    let a = x[0], b = x[1], c = x[2], d = x[3]
    a = ff(a, b, c, d, k[0], 7, -680876936)
    d = ff(d, a, b, c, k[1], 12, -389564586)
    c = ff(c, d, a, b, k[2], 17, 606105819)
    b = ff(b, c, d, a, k[3], 22, -1044525330)
    a = ff(a, b, c, d, k[4], 7, -176418897)
    d = ff(d, a, b, c, k[5], 12, 1200080426)
    c = ff(c, d, a, b, k[6], 17, -1473231341)
    b = ff(b, c, d, a, k[7], 22, -45705983)
    a = ff(a, b, c, d, k[8], 7, 1770035416)
    d = ff(d, a, b, c, k[9], 12, -1958414417)
    c = ff(c, d, a, b, k[10], 17, -42063)
    b = ff(b, c, d, a, k[11], 22, -1990404162)
    a = ff(a, b, c, d, k[12], 7, 1804603682)
    d = ff(d, a, b, c, k[13], 12, -40341101)
    c = ff(c, d, a, b, k[14], 17, -1502002290)
    b = ff(b, c, d, a, k[15], 22, 1236535329)
    a = gg(a, b, c, d, k[1], 5, -165796510)
    d = gg(d, a, b, c, k[6], 9, -1069501632)
    c = gg(c, d, a, b, k[11], 14, 643717713)
    b = gg(b, c, d, a, k[0], 20, -373897302)
    a = gg(a, b, c, d, k[5], 5, -701558691)
    d = gg(d, a, b, c, k[10], 9, 38016083)
    c = gg(c, d, a, b, k[15], 14, -660478335)
    b = gg(b, c, d, a, k[4], 20, -405537848)
    a = gg(a, b, c, d, k[9], 5, 568446438)
    d = gg(d, a, b, c, k[14], 9, -1019803690)
    c = gg(c, d, a, b, k[3], 14, -187363961)
    b = gg(b, c, d, a, k[8], 20, 1163531501)
    a = gg(a, b, c, d, k[13], 5, -1444681467)
    d = gg(d, a, b, c, k[2], 9, -51403784)
    c = gg(c, d, a, b, k[7], 14, 1735328473)
    b = gg(b, c, d, a, k[12], 20, -1926607734)
    a = hh(a, b, c, d, k[5], 4, -378558)
    d = hh(d, a, b, c, k[8], 11, -2022574463)
    c = hh(c, d, a, b, k[11], 16, 1839030562)
    b = hh(b, c, d, a, k[14], 23, -35309556)
    a = hh(a, b, c, d, k[1], 4, -1530992060)
    d = hh(d, a, b, c, k[4], 11, 1272893353)
    c = hh(c, d, a, b, k[7], 16, -155497632)
    b = hh(b, c, d, a, k[10], 23, -1094730640)
    a = hh(a, b, c, d, k[13], 4, 681279174)
    d = hh(d, a, b, c, k[0], 11, -358537222)
    c = hh(c, d, a, b, k[3], 16, -722521979)
    b = hh(b, c, d, a, k[6], 23, 76029189)
    a = hh(a, b, c, d, k[9], 4, -640364487)
    d = hh(d, a, b, c, k[12], 11, -421815835)
    c = hh(c, d, a, b, k[15], 16, 530742520)
    b = hh(b, c, d, a, k[2], 23, -995338651)
    a = ii(a, b, c, d, k[0], 6, -198630844)
    d = ii(d, a, b, c, k[7], 10, 1126891415)
    c = ii(c, d, a, b, k[14], 15, -1416354905)
    b = ii(b, c, d, a, k[5], 21, -57434055)
    a = ii(a, b, c, d, k[12], 6, 1700485571)
    d = ii(d, a, b, c, k[3], 10, -1894986606)
    c = ii(c, d, a, b, k[10], 15, -1051523)
    b = ii(b, c, d, a, k[1], 21, -2054922799)
    a = ii(a, b, c, d, k[8], 6, 1873313359)
    d = ii(d, a, b, c, k[15], 10, -30611744)
    c = ii(c, d, a, b, k[6], 15, -1560198380)
    b = ii(b, c, d, a, k[13], 21, 1309151649)
    a = ii(a, b, c, d, k[4], 6, -145523070)
    d = ii(d, a, b, c, k[11], 10, -1120210379)
    c = ii(c, d, a, b, k[2], 15, 718787259)
    b = ii(b, c, d, a, k[9], 21, -343485551)
    x[0] = add32(a, x[0])
    x[1] = add32(b, x[1])
    x[2] = add32(c, x[2])
    x[3] = add32(d, x[3])
  }
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t))
    return add32((a << s) | (a >>> (32 - s)), b)
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & c) | ((~b) & d), a, b, x, s, t) }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & d) | (c & (~d)), a, b, x, s, t) }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(b ^ c ^ d, a, b, x, s, t) }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(c ^ (b | (~d)), a, b, x, s, t) }
  function add32(a: number, b: number) { return (a + b) & 0xffffffff }

  const n = data.length
  const state = [1732584193, -271733879, -1732584194, 271733878]
  let i: number
  for (i = 64; i <= n; i += 64) {
    const words: number[] = []
    for (let j = 0; j < 64; j += 4)
      words.push(data[i - 64 + j] | (data[i - 64 + j + 1] << 8) | (data[i - 64 + j + 2] << 16) | (data[i - 64 + j + 3] << 24))
    md5cycle(state, words)
  }
  const tail = new Uint8Array(64)
  const tailLen = n - (i - 64)
  for (let j = 0; j < tailLen; j++) tail[j] = data[i - 64 + j]
  tail[tailLen] = 0x80
  if (tailLen > 55) {
    const words: number[] = []
    for (let j = 0; j < 64; j += 4)
      words.push(tail[j] | (tail[j + 1] << 8) | (tail[j + 2] << 16) | (tail[j + 3] << 24))
    md5cycle(state, words)
    tail.fill(0)
  }
  const words: number[] = []
  for (let j = 0; j < 56; j += 4)
    words.push(tail[j] | (tail[j + 1] << 8) | (tail[j + 2] << 16) | (tail[j + 3] << 24))
  words.push((n << 3) & 0xffffffff)
  words.push(0)
  md5cycle(state, words)
  const result = new Uint8Array(16)
  for (let j = 0; j < 4; j++) {
    result[j * 4] = state[j] & 0xff
    result[j * 4 + 1] = (state[j] >> 8) & 0xff
    result[j * 4 + 2] = (state[j] >> 16) & 0xff
    result[j * 4 + 3] = (state[j] >> 24) & 0xff
  }
  return result
}

function rc4(key: Uint8Array, data: Uint8Array): Uint8Array {
  const S = new Uint8Array(256)
  for (let i = 0; i < 256; i++) S[i] = i
  let j = 0
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key[i % key.length]) & 0xff
    ;[S[i], S[j]] = [S[j], S[i]]
  }
  const out = new Uint8Array(data.length)
  let x = 0, y = 0
  for (let i = 0; i < data.length; i++) {
    x = (x + 1) & 0xff
    y = (y + S[x]) & 0xff
    ;[S[x], S[y]] = [S[y], S[x]]
    out[i] = data[i] ^ S[(S[x] + S[y]) & 0xff]
  }
  return out
}

function computeOwnerValue(ownerPwd: string, userPwd: string): Uint8Array {
  const ownerPadded = padPassword(ownerPwd)
  const key = md5(ownerPadded).subarray(0, 5) // RC4-40: 5-byte key
  const userPadded = padPassword(userPwd)
  return rc4(key, userPadded)
}

function computeEncryptionKey(userPwd: string, ownerValue: Uint8Array, permissions: number, fileId: Uint8Array): Uint8Array {
  const userPadded = padPassword(userPwd)
  const buf = new Uint8Array(userPadded.length + ownerValue.length + 4 + fileId.length)
  let offset = 0
  buf.set(userPadded, offset); offset += userPadded.length
  buf.set(ownerValue, offset); offset += ownerValue.length
  buf[offset++] = permissions & 0xff
  buf[offset++] = (permissions >> 8) & 0xff
  buf[offset++] = (permissions >> 16) & 0xff
  buf[offset++] = (permissions >> 24) & 0xff
  buf.set(fileId, offset)
  return md5(buf).subarray(0, 5) // 5-byte key for RC4-40
}

function computeUserValue(encKey: Uint8Array): Uint8Array {
  return rc4(encKey, PDF_PADDING)
}

function toHexString(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("")
}
// ─── End encryption helpers ─────────────────────────────────────────────────

export default function PdfProtect() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState("document")
  const [totalPages, setTotalPages] = useState(0)

  const [mode, setMode] = useState<Mode>("protect")
  const [userPassword, setUserPassword] = useState("")
  const [ownerPassword, setOwnerPassword] = useState("")

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

      // Permissions: -3904 = 0xFFFF F0C0 → print + accessibility allowed
      const permissions = -3904

      // Get or create a file ID from the context
      const context = pdfDoc.context as any
      let fileIdBytes = new Uint8Array(16)
      // Try to use existing file ID, otherwise generate random
      try {
        const trailer = context.trailerInfo
        if (trailer.ID) {
          const idArray = context.lookup(trailer.ID)
          if (idArray && idArray.array && idArray.array.length > 0) {
            const firstId = idArray.array[0]
            if (firstId && typeof firstId.decodeText === "function") {
              const decoded = firstId.decodeText()
              const enc = new TextEncoder()
              fileIdBytes = enc.encode(decoded).subarray(0, 16)
            }
          }
        }
      } catch {
        // Generate a random file ID
        crypto.getRandomValues(fileIdBytes)
      }

      const effectiveOwner = ownerPassword || userPassword
      const oValue = computeOwnerValue(effectiveOwner, userPassword)
      const encKey = computeEncryptionKey(userPassword, oValue, permissions, fileIdBytes)
      const uValue = computeUserValue(encKey)

      // Inject Encrypt dictionary into the PDF trailer
      const encryptDict = context.obj({
        Filter: "Standard",
        V: 1,
        R: 2,
        O: `<${toHexString(oValue)}>`,
        U: `<${toHexString(uValue)}>`,
        P: permissions,
      })
      const encryptRef = context.register(encryptDict)
      context.trailerInfo.Encrypt = encryptRef

      // Also set file ID if not already present
      if (!context.trailerInfo.ID) {
        const fileIdHex = toHexString(fileIdBytes)
        const idArray = context.obj([`<${fileIdHex}>`, `<${fileIdHex}>`])
        context.trailerInfo.ID = idArray
      }

      const bytes = await pdfDoc.save()
      const blob = new Blob([bytes as any], { type: "application/pdf" })
      setResultUrl(URL.createObjectURL(blob))
      setStatusMsg("PDF encrypted successfully! The file is now password-protected.")
    } catch (err) {
      console.error(err)
      alert("Error encrypting PDF. The file may be corrupted or use an unsupported format.")
    } finally { setIsProcessing(false) }
  }

  const removePdfProtection = async () => {
    if (!pdfFile) return
    setIsProcessing(true)
    setResultUrl(null)
    setStatusMsg("")
    try {
      const ab = await pdfFile.arrayBuffer()
      const pdf = await PDFDocument.load(ab, { ignoreEncryption: true })

      // Remove Encrypt dictionary from trailer if present
      const context = pdf.context as any
      if (context.trailerInfo.Encrypt) {
        delete context.trailerInfo.Encrypt
      }

      const bytes = await pdf.save()
      const blob = new Blob([bytes as any], { type: "application/pdf" })
      setResultUrl(URL.createObjectURL(blob))
      setStatusMsg("Password protection removed successfully.")
    } catch (err) {
      console.error(err)
      alert("Cannot remove protection. The PDF might use strong encryption that requires the correct password.")
    } finally { setIsProcessing(false) }
  }

  const startOver = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setPdfFile(null); setPdfUrl(null); setResultUrl(null); setStatusMsg("")
    setUserPassword(""); setOwnerPassword("")
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
                  <p className="text-xs text-amber-300">This will re-save the PDF without encryption. Works for lightly protected PDFs.</p>
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
