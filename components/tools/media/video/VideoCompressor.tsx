"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, Video, RefreshCw, Loader2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"

export default function VideoCompressor() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [fileName, setFileName] = useState("video")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  
  const [compressionValue, setCompressionValue] = useState(28) // CRF value (18-51, lower is better quality, higher is more compression)
  const [isCompressing, setIsCompressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultSrc, setResultSrc] = useState<string | null>(null)
  const [resultFileName, setResultFileName] = useState("")

  const [isLoaded, setIsLoaded] = useState(false)
  const ffmpegRef = useRef(new FFmpeg())

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd"
    const ffmpeg = ffmpegRef.current
    
    ffmpeg.on("progress", ({ progress, time }) => {
      setProgress(progress * 100)
    })

    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      })
      setIsLoaded(true)
    } catch (e) {
      console.error("FFMPEG load error:", e)
      // Fallback for some dev environments
      setIsLoaded(true)
    }
  }

  const handleUpload = (file: File) => {
    if (!file.type.startsWith("video/")) {
       alert("Please upload a valid video file.")
       return
    }
    const url = URL.createObjectURL(file)
    setVideoSrc(url)
    setVideoFile(file)
    setResultSrc(null)
    const nameExt = file.name.lastIndexOf(".")
    setFileName(nameExt > 0 ? file.name.substring(0, nameExt) : file.name)
  }

  const compressVideo = async () => {
    if (!videoFile || !isLoaded) return
    setIsCompressing(true)
    setProgress(0)
    setResultSrc(null)

    const ffmpeg = ffmpegRef.current
    const ext = videoFile.name.split('.').pop() || 'mp4'
    const inputName = `input.${ext}`
    const outputName = `output.mp4` // Always output mp4 for consistency and good compression

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(videoFile))
      
      // FFmpeg command for compression using libx264 and CRF
      // CRF 28 is standard good compression, preset ultrafast for browser execution
      await ffmpeg.exec([
        "-i", inputName,
        "-vcodec", "libx264",
        "-crf", compressionValue.toString(),
        "-preset", "ultrafast",
        outputName
      ])

      const data = await ffmpeg.readFile(outputName)
      const dataBlob = new Blob([new Uint8Array(data as any)], { type: "video/mp4" })
      const url = URL.createObjectURL(dataBlob)
      
      setResultSrc(url)
      setResultFileName(`${fileName}-compressed.mp4`)
    } catch (err) {
      console.error(err)
      alert("Error shrinking video. Please try again.")
    } finally {
      setIsCompressing(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!videoSrc ? (
        <FileUploader 
          onUpload={handleUpload} 
          description="MP4, WebM, MOV (Max 50MB recommended for browser)" 
          accept="video/*" 
          icon={<Video className="w-8 h-8" />} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 <Video className="w-4 h-4 text-purple-400" /> Video Compressor
              </h3>
              
              <div className="space-y-2 pt-4">
                <div className="flex justify-between items-center text-sm">
                  <Label className="text-gray-300">Compression Level</Label>
                  <span className="text-purple-400 font-mono">
                    {compressionValue <= 23 ? "High Quality" : compressionValue <= 32 ? "Balanced" : "Max Shrink"}
                  </span>
                </div>
                {/* CRF Range: 18 (near lossless) to 51 (worst). We clamp to 18-40 to remain usable */}
                <input 
                  type="range" min="18" max="40" step="1" 
                  value={compressionValue} 
                  onChange={(e) => setCompressionValue(parseInt(e.target.value))} 
                  className="w-full accent-purple-500"
                  disabled={isCompressing || !isLoaded}
                />
                <div className="flex justify-between text-xs text-gray-500 px-1 pt-1">
                  <span>Better Quality</span>
                  <span>Smaller File</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              {!resultSrc ? (
                <Button 
                   onClick={compressVideo} 
                   disabled={isCompressing || !isLoaded}
                   className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12"
                >
                  {isCompressing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                      Compressing... {Math.round(progress)}%
                    </>
                  ) : !isLoaded ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                      Loading FFmpeg Engine...
                    </>
                  ) : (
                    "Compress Video"
                  )}
                </Button>
              ) : (
                <Button 
                   onClick={() => {
                     const link = document.createElement("a")
                     link.download = resultFileName
                     link.href = resultSrc
                     link.click()
                   }} 
                   className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 h-12"
                >
                  <Download className="w-4 h-4 mr-2" /> Download Compressed
                </Button>
              )}
              <Button 
                 onClick={() => {
                   setVideoSrc(null)
                   setResultSrc(null)
                   setVideoFile(null)
                 }} 
                 variant="ghost" 
                 className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-12"
                 disabled={isCompressing}
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </Button>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col items-center justify-center bg-black/20 border border-white/10 rounded-3xl p-4 min-h-[400px] overflow-hidden">
             <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                 <h4 className="text-sm font-medium text-gray-400">
                    {resultSrc ? "Compressed Result" : "Original File"}
                 </h4>
                 <video 
                   src={resultSrc || videoSrc} 
                   controls 
                   className="max-w-full max-h-[50vh] rounded-xl shadow-2xl bg-black"
                 />
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
