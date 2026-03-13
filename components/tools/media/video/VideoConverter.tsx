"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, Video, RefreshCw, Loader2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"

export default function VideoConverter() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [fileName, setFileName] = useState("video")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  
  const [targetFormat, setTargetFormat] = useState<"mp4" | "webm" | "mov">("mp4")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultSrc, setResultSrc] = useState<string | null>(null)

  const [isLoaded, setIsLoaded] = useState(false)
  const ffmpegRef = useRef(new FFmpeg())

  useEffect(() => {
    const load = async () => {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd"
      const ffmpeg = ffmpegRef.current
      
      ffmpeg.on("progress", ({ progress }) => {
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
        setIsLoaded(true)
      }
    }
    load()
  }, [])

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

  const convertVideo = async () => {
    if (!videoFile || !isLoaded) return
    setIsProcessing(true)
    setProgress(0)
    setResultSrc(null)

    const ffmpeg = ffmpegRef.current
    const ext = videoFile.name.split('.').pop() || 'mp4'
    const inputName = `input.${ext}`
    const outputName = `output.${targetFormat}`

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(videoFile))
      
      // FFmpeg command for format conversion
      // Keep qualities decent and processing fast
      const args = ["-i", inputName]
      if (targetFormat === "webm") {
          args.push("-c:v", "libvpx-vp9", "-c:a", "libopus")
      } else if (targetFormat === "mov") {
          args.push("-c:v", "libx264", "-preset", "ultrafast")
      } else {
          // mp4 default
          args.push("-c:v", "libx264", "-c:a", "aac", "-preset", "ultrafast")
      }
      args.push(outputName)

      await ffmpeg.exec(args)

      const data = await ffmpeg.readFile(outputName)
      let mimeType = `video/${targetFormat}`
      if (targetFormat === "mov") mimeType = "video/quicktime"

      const dataBlob = new Blob([(data as Uint8Array).buffer], { type: mimeType })
      const url = URL.createObjectURL(dataBlob)
      
      setResultSrc(url)
    } catch (err) {
      console.error(err)
      alert("Error converting video. The file might be corrupted or unsupported.")
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!videoSrc ? (
        <FileUploader 
          onUpload={handleUpload} 
          description="MP4, WebM, MOV, AVI" 
          accept="video/*" 
          icon={<Video className="w-8 h-8" />} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 <Video className="w-4 h-4 text-purple-400" /> Video Converter
              </h3>
              
              <div className="space-y-2 pt-2">
                <Label className="text-gray-300 text-sm">Target Format</Label>
                <select 
                  value={targetFormat} 
                  onChange={(e) => setTargetFormat(e.target.value as any)}
                  className="w-full h-12 bg-white/5 text-gray-200 border border-white/10 rounded-xl px-3 outline-none focus:ring-1 focus:ring-purple-500 font-medium"
                  disabled={isProcessing}
                >
                  <option value="mp4" className="bg-gray-900">MP4 (Widely Supported)</option>
                  <option value="webm" className="bg-gray-900">WebM (Optimized Web)</option>
                  <option value="mov" className="bg-gray-900">MOV (Apple Format)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              {!resultSrc ? (
                <Button 
                   onClick={convertVideo} 
                   disabled={isProcessing || !isLoaded}
                   className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                      Converting... {Math.round(progress)}%
                    </>
                  ) : !isLoaded ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                      Initializing FFmpeg...
                    </>
                  ) : (
                    `Convert to ${targetFormat.toUpperCase()}`
                  )}
                </Button>
              ) : (
                <Button 
                   onClick={() => {
                     const link = document.createElement("a")
                     link.download = `${fileName}.${targetFormat}`
                     link.href = resultSrc
                     link.click()
                   }} 
                   className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 h-12"
                >
                  <Download className="w-4 h-4 mr-2" /> Download Result
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
                 disabled={isProcessing}
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </Button>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col items-center justify-center bg-black/20 border border-white/10 rounded-3xl p-4 min-h-[400px] overflow-hidden">
             <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                 <h4 className="text-sm font-medium text-gray-400">
                    {resultSrc ? `Converted Result (${targetFormat.toUpperCase()})` : "Original File Preview"}
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
