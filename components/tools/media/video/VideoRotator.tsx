"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, Video, RefreshCw, Loader2, RotateCw } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"

export default function VideoRotator() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [fileName, setFileName] = useState("video")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  
  const [rotation, setRotation] = useState<"90" | "180" | "270">("90")

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

  const rotateVideo = async () => {
    if (!videoFile || !isLoaded) return
    setIsProcessing(true)
    setProgress(0)
    setResultSrc(null)

    const ffmpeg = ffmpegRef.current
    const ext = videoFile.name.split('.').pop() || 'mp4'
    const inputName = `input.${ext}`
    const outputName = `output.mp4` // Normalize to mp4 output

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(videoFile))
      
      // FFmpeg transpose filter
      // 1 = 90Clockwise, 2 = 90CounterClockwise, 3 = 90Clockwise and Vertical Flip
      // 0 = 90CounterClockwise and Vertical Flip
      // To get 180, we transpose twice 'transpose=2,transpose=2' or just transpose=1,transpose=1
      let transposeFilter = ""
      if (rotation === "90") transposeFilter = "transpose=1"
      if (rotation === "180") transposeFilter = "transpose=1,transpose=1"
      if (rotation === "270") transposeFilter = "transpose=2"

      const args = [
          "-i", inputName,
          "-vf", transposeFilter,
          "-c:a", "copy",
          outputName
      ]

      await ffmpeg.exec(args)

      const data = await ffmpeg.readFile(outputName)
      const dataBlob = new Blob([(data as Uint8Array).buffer], { type: "video/mp4" })
      const url = URL.createObjectURL(dataBlob)
      
      setResultSrc(url)
    } catch (err) {
      console.error(err)
      alert("Error rotating video. Unsupported format or codec.")
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
          description="MP4, WebM, MOV, AVI (Max 50MB Recommeded)" 
          accept="video/*" 
          icon={<Video className="w-8 h-8" />} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 <RotateCw className="w-4 h-4 text-purple-400" /> Video Rotator
              </h3>
              
              <div className="space-y-2 pt-2">
                <Label className="text-gray-300 text-sm">Rotation Angle</Label>
                <div className="grid grid-cols-3 gap-2">
                   <button 
                     onClick={() => setRotation("90")} 
                     className={`h-12 text-sm font-medium rounded-xl transition-colors ${rotation === "90" ? "bg-purple-500 text-white shadow" : "bg-white/5 text-gray-400 hover:text-white"}`}
                   >90°</button>
                   <button 
                     onClick={() => setRotation("180")} 
                     className={`h-12 text-sm font-medium rounded-xl transition-colors ${rotation === "180" ? "bg-purple-500 text-white shadow" : "bg-white/5 text-gray-400 hover:text-white"}`}
                   >180°</button>
                   <button 
                     onClick={() => setRotation("270")} 
                     className={`h-12 text-sm font-medium rounded-xl transition-colors ${rotation === "270" ? "bg-purple-500 text-white shadow" : "bg-white/5 text-gray-400 hover:text-white"}`}
                   >270°</button>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              {!resultSrc ? (
                <Button 
                   onClick={rotateVideo} 
                   disabled={isProcessing || !isLoaded}
                   className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                      Rotating... {Math.round(progress)}%
                    </>
                  ) : !isLoaded ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                      Initializing FFmpeg...
                    </>
                  ) : (
                    `Rotate ${rotation}°`
                  )}
                </Button>
              ) : (
                <Button 
                   onClick={() => {
                     const link = document.createElement("a")
                     link.download = `${fileName}-rotated.mp4`
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

          <div className="md:col-span-7 flex flex-col items-center justify-center bg-black/20 border border-white/10 rounded-3xl p-4 min-h-[400px] overflow-hidden">
             <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                 <h4 className="text-sm font-medium text-gray-400">
                    {resultSrc ? "Rotated Result" : "Original View"}
                 </h4>
                 
                 <div className="relative max-h-[50vh] flex items-center justify-center">
                    <video 
                      src={resultSrc || videoSrc} 
                      controls 
                      className="max-w-full max-h-full rounded-xl shadow-2xl bg-black"
                      // Visual CSS rotation before FFmpeg processes it completely
                      style={!resultSrc ? { transform: `rotate(${rotation}deg)` } : {}}
                    />
                 </div>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
