"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, Music, RefreshCw, Loader2, Scissors } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"

export default function AudioCutter() {
  const [audioSrc, setAudioSrc] = useState<string | null>(null)
  const [fileName, setFileName] = useState("audio")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(10)
  const [duration, setDuration] = useState(0)

  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultSrc, setResultSrc] = useState<string | null>(null)

  const [isLoaded, setIsLoaded] = useState(false)
  const ffmpegRef = useRef(new FFmpeg())
  const audioRef = useRef<HTMLAudioElement>(null)

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
    if (!file.type.startsWith("audio/") && !file.type.startsWith("video/")) {
       alert("Please upload a valid audio or video file.")
       return
    }
    const url = URL.createObjectURL(file)
    setAudioSrc(url)
    setAudioFile(file)
    setResultSrc(null)
    const nameExt = file.name.lastIndexOf(".")
    setFileName(nameExt > 0 ? file.name.substring(0, nameExt) : file.name)
  }

  const handleLoadedMetadata = () => {
      if (audioRef.current) {
          const d = Math.floor(audioRef.current.duration)
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

  const cutAudio = async () => {
    if (!audioFile || !isLoaded) return
    setIsProcessing(true)
    setProgress(0)
    setResultSrc(null)

    const ffmpeg = ffmpegRef.current
    const ext = audioFile.name.split('.').pop() || 'mp3'
    const inputName = `input.${ext}`
    // If it's a video file being extracted, explicitly output mp3. Otherwise keep native.
    const outputExt = audioFile.type.startsWith("video/") ? "mp3" : ext
    const outputName = `output.${outputExt}`

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(audioFile))
      
      const args = [
          "-ss", startTime.toString(),
          "-to", endTime.toString(),
          "-i", inputName,
          "-vn", // Drop video stream
          "-c:a", "copy", // Copy audio stream for identical quality and fast speed
          outputName
      ]

      await ffmpeg.exec(args)

      const data = await ffmpeg.readFile(outputName)
      const dataBlob = new Blob([(data as Uint8Array).buffer], { type: `audio/${outputExt}` })
      const url = URL.createObjectURL(dataBlob)
      
      setResultSrc(url)
    } catch (err) {
      console.error(err)
      alert("Error cutting audio. The stream might need re-encoding or format is unsupported for direct copy.")
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!audioSrc ? (
        <FileUploader 
          onUpload={handleUpload} 
          description="MP3, WAV, OGG (or extract from Video)" 
          accept="audio/*,video/*" 
          icon={<Music className="w-8 h-8" />} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 <Scissors className="w-4 h-4 text-purple-400" /> Audio Cutter
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
                      if (audioRef.current) audioRef.current.currentTime = val
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
                      if (audioRef.current) audioRef.current.currentTime = val
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
                   onClick={cutAudio} 
                   disabled={isProcessing || !isLoaded}
                   className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                      Cutting... {Math.round(progress)}%
                    </>
                  ) : !isLoaded ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                      Initializing FFmpeg...
                    </>
                  ) : (
                    "Cut Audio"
                  )}
                </Button>
              ) : (
                <Button 
                   onClick={() => {
                     const link = document.createElement("a")
                     const ext = audioFile.name.split('.').pop() || "mp3"
                     const outExt = videoFile?.type.startsWith("video/") ? "mp3" : ext
                     link.download = `${fileName}-trimmed.${outExt}`
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
                   setAudioSrc(null)
                   setResultSrc(null)
                   setAudioFile(null)
                 }} 
                 variant="ghost" 
                 className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-12"
                 disabled={isProcessing}
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </Button>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col items-center justify-center bg-black/20 border border-white/10 rounded-3xl p-8 min-h-[400px]">
             <div className="w-full max-w-md flex flex-col items-center justify-center gap-6">
                 
                 <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                     <Scissors className="w-12 h-12 text-purple-400" />
                 </div>
                 
                 <div className="w-full space-y-2">
                     <h4 className="text-sm font-medium text-gray-400 pl-2">
                        {resultSrc ? "Trimmed Result" : "Original View"}
                     </h4>
                     <audio 
                       ref={audioRef}
                       src={resultSrc || audioSrc} 
                       controls 
                       onLoadedMetadata={handleLoadedMetadata}
                       className="w-full"
                     />
                 </div>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
