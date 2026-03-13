"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, Video, RefreshCw, Loader2, Image as ImageIcon } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"

export default function VideoToGif() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [fileName, setFileName] = useState("video")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  
  const [fps, setFps] = useState(10)
  const [width, setWidth] = useState(480)

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

  const convertToGif = async () => {
    if (!videoFile || !isLoaded) return
    setIsProcessing(true)
    setProgress(0)
    setResultSrc(null)

    const ffmpeg = ffmpegRef.current
    const ext = videoFile.name.split('.').pop() || 'mp4'
    const inputName = `input.${ext}`
    const outputName = `output.gif`

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(videoFile))
      
      // FFmpeg command to convert to GIF
      // Uses a generic web-optimized palette and scale filter for GIFs
      const args = [
          "-i", inputName,
          "-vf", `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
          "-loop", "0",
          outputName
      ]

      await ffmpeg.exec(args)

      const data = await ffmpeg.readFile(outputName)
      const dataBlob = new Blob([(data as Uint8Array).buffer], { type: "image/gif" })
      const url = URL.createObjectURL(dataBlob)
      
      setResultSrc(url)
    } catch (err) {
      console.error(err)
      alert("Error converting to GIF. Your video might be too long or unsupported.")
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
          description="MP4, WebM, MOV (Max 10-15s recommended for GIFs)" 
          accept="video/*" 
          icon={<Video className="w-8 h-8" />} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 <ImageIcon className="w-4 h-4 text-purple-400" /> Video to GIF
              </h3>
              
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                   <div className="flex justify-between items-center text-sm">
                     <Label className="text-gray-300">Frames Per Second (FPS)</Label>
                     <span className="text-purple-400 font-mono">{fps}</span>
                   </div>
                   <input 
                     type="range" min="5" max="30" step="1" 
                     value={fps} 
                     onChange={(e) => setFps(parseInt(e.target.value))} 
                     className="w-full accent-purple-500"
                     disabled={isProcessing}
                   />
                   <p className="text-xs text-gray-500">Lower FPS = smaller file, choppy motion.</p>
                </div>
                
                <div className="space-y-2 pt-2 border-t border-white/10">
                   <div className="flex justify-between items-center text-sm mt-4">
                     <Label className="text-gray-300">Max Width</Label>
                     <span className="text-purple-400 font-mono">{width}px</span>
                   </div>
                   <input 
                     type="range" min="200" max="800" step="10" 
                     value={width} 
                     onChange={(e) => setWidth(parseInt(e.target.value))} 
                     className="w-full accent-purple-500"
                     disabled={isProcessing}
                   />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              {!resultSrc ? (
                <Button 
                   onClick={convertToGif} 
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
                    `Convert to GIF`
                  )}
                </Button>
              ) : (
                <Button 
                   onClick={() => {
                     const link = document.createElement("a")
                     link.download = `${fileName}.gif`
                     link.href = resultSrc
                     link.click()
                   }} 
                   className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 h-12"
                >
                  <Download className="w-4 h-4 mr-2" /> Download GIF
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

          <div className="md:col-span-8 flex flex-col items-center justify-center bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVQ4T2P8////fwY8gHGgHkUDGIa1YBg1gIiKBsKxBhFVSYy1YBg1gIiKBsKxBhEAhP1wIemq4iAAAAAASUVORK5CYII=')] border border-white/10 rounded-3xl p-4 min-h-[400px] overflow-hidden">
             <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                 <h4 className="text-sm font-medium text-gray-800 bg-white/80 px-3 py-1 rounded-full shadow-sm">
                    {resultSrc ? "Final GIF Result" : "Original Video Preview"}
                 </h4>
                 
                 {resultSrc ? (
                    <img 
                      src={resultSrc} 
                      className="max-w-full max-h-[50vh] rounded-xl shadow-2xl"
                    />
                 ) : (
                    <video 
                      src={videoSrc} 
                      controls 
                      className="max-w-full max-h-[50vh] rounded-xl shadow-2xl bg-black"
                    />
                 )}
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
