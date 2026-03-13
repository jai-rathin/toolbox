"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, Video, RefreshCw, Loader2, Scissors } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"

export default function VideoTrimmer() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [fileName, setFileName] = useState("video")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(10)
  const [duration, setDuration] = useState(0)

  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultSrc, setResultSrc] = useState<string | null>(null)

  const [isLoaded, setIsLoaded] = useState(false)
  const ffmpegRef = useRef(new FFmpeg())
  const videoRef = useRef<HTMLVideoElement>(null)

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

  const handleLoadedMetadata = () => {
      if (videoRef.current) {
          const d = Math.floor(videoRef.current.duration)
          setDuration(d)
          setEndTime(d)
          setStartTime(0)
      }
  }

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
       const m = Math.floor(seconds / 60).toString().padStart(2, "0")
       const s = Math.floor(seconds % 60).toString().padStart(2, "0")
       return `${m}:${s}`
  }

  const trimVideo = async () => {
    if (!videoFile || !isLoaded) return
    setIsProcessing(true)
    setProgress(0)
    setResultSrc(null)

    const ffmpeg = ffmpegRef.current
    const ext = videoFile.name.split('.').pop() || 'mp4'
    const inputName = `input.${ext}`
    const outputName = `output.${ext}` 

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(videoFile))
      
      // FFmpeg command to trim
      // Using -ss before -i is faster because it seeks the input, but we also specify -t for duration or -to for end time
      const args = [
          "-ss", startTime.toString(),
          "-to", endTime.toString(),
          "-i", inputName,
          "-c", "copy", // Try to copy stream without re-encoding, extremely fast.
          outputName
      ]

      await ffmpeg.exec(args)

      const data = await ffmpeg.readFile(outputName)
      const dataBlob = new Blob([(data as Uint8Array).buffer], { type: videoFile.type })
      const url = URL.createObjectURL(dataBlob)
      
      setResultSrc(url)
    } catch (err) {
      console.error(err)
      alert("Error trimming video. Stream copying might not be supported for this codec locally.")
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
          <div className="md:col-span-5 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 <Scissors className="w-4 h-4 text-purple-400" /> Video Trimmer
              </h3>
              
              <div className="space-y-4 pt-2 bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex justify-between items-center text-sm mb-1">
                   <Label className="text-gray-300">Start Time</Label>
                   <span className="text-purple-400 font-mono bg-purple-500/10 px-2 py-0.5 rounded">{formatTime(startTime)}</span>
                </div>
                <input 
                  type="range" min="0" max={Math.max(0, endTime - 1)} step="1" 
                  value={startTime} 
                  onChange={(e) => {
                      const val = parseInt(e.target.value)
                      setStartTime(val)
                      if (videoRef.current) videoRef.current.currentTime = val
                  }} 
                  className="w-full accent-purple-500"
                  disabled={isProcessing}
                />
                
                <div className="flex justify-between items-center text-sm pt-2 mb-1 border-t border-white/5 mt-4">
                   <Label className="text-gray-300">End Time</Label>
                   <span className="text-purple-400 font-mono bg-purple-500/10 px-2 py-0.5 rounded">{formatTime(endTime)}</span>
                </div>
                <input 
                  type="range" min={startTime + 1} max={duration} step="1" 
                  value={endTime} 
                  onChange={(e) => {
                      const val = parseInt(e.target.value)
                      setEndTime(val)
                      if (videoRef.current) videoRef.current.currentTime = val
                  }} 
                  className="w-full accent-purple-500"
                  disabled={isProcessing}
                />
              </div>

              <div className="text-center text-sm text-gray-400 font-medium">
                 Trimmed Duration: <span className="text-white">{formatTime(endTime - startTime)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              {!resultSrc ? (
                <Button 
                   onClick={trimVideo} 
                   disabled={isProcessing || !isLoaded}
                   className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                      Trimming... {Math.round(progress)}%
                    </>
                  ) : !isLoaded ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                      Initializing FFmpeg...
                    </>
                  ) : (
                    "Trim Video"
                  )}
                </Button>
              ) : (
                <Button 
                   onClick={() => {
                     const link = document.createElement("a")
                     const ext = videoFile.name.split('.').pop() || "mp4"
                     link.download = `${fileName}-trimmed.${ext}`
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
                    {resultSrc ? "Trimmed Result" : "Original View"}
                 </h4>
                 {/* Video bounds for trimming */}
                 <video 
                   ref={videoRef}
                   src={resultSrc || videoSrc} 
                   controls 
                   onLoadedMetadata={handleLoadedMetadata}
                   className="max-w-full max-h-[50vh] rounded-xl shadow-2xl bg-black"
                 />
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
