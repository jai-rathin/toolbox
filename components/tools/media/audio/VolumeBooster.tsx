"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, Music, RefreshCw, Loader2, Volume2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"

export default function VolumeBooster() {
  const [audioSrc, setAudioSrc] = useState<string | null>(null)
  const [fileName, setFileName] = useState("audio")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  
  const [volumeLevel, setVolumeLevel] = useState(2.0) // 1.0 is normal, 2.0 is 200%
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

  const boostAudio = async () => {
    if (!audioFile || !isLoaded) return
    setIsProcessing(true)
    setProgress(0)
    setResultSrc(null)

    const ffmpeg = ffmpegRef.current
    const ext = audioFile.name.split('.').pop() || 'mp3'
    const inputName = `input.${ext}`
    const outputExt = audioFile.type.startsWith("video/") ? "mp3" : ext
    const outputName = `output.${outputExt}`

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(audioFile))
      
      // FFmpeg command to adjust volume
      const args = [
          "-i", inputName,
          "-filter:a", `volume=${volumeLevel}`,
          "-vn", // Drop video stream to return only audio
          outputName
      ]

      await ffmpeg.exec(args)

      const data = await ffmpeg.readFile(outputName)
      const dataBlob = new Blob([new Uint8Array(data as any)], { type: `audio/${outputExt}` })
      const url = URL.createObjectURL(dataBlob)
      
      setResultSrc(url)
    } catch (err) {
      console.error(err)
      alert("Error boosting audio. Try a standard MP3 or WAV file.")
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
          description="MP3, WAV, OGG" 
          accept="audio/*,video/*" 
          icon={<Volume2 className="w-8 h-8" />} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 <Volume2 className="w-4 h-4 text-purple-400" /> Volume Booster
              </h3>
              
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center text-sm">
                   <Label className="text-gray-300">Boost Level</Label>
                   <span className="text-purple-400 font-mono bg-purple-500/10 px-2 py-0.5 rounded">{Math.round(volumeLevel * 100)}%</span>
                </div>
                <input 
                  type="range" min="0.1" max="5.0" step="0.1" 
                  value={volumeLevel} 
                  onChange={(e) => setVolumeLevel(parseFloat(e.target.value))} 
                  className="w-full accent-purple-500"
                  disabled={isProcessing}
                />
                <div className="flex justify-between text-xs text-gray-500 font-medium px-1">
                  <span>Quieter</span>
                  <span>Normal</span>
                  <span className="text-red-400">Louder</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              {!resultSrc ? (
                <Button 
                   onClick={boostAudio} 
                   disabled={isProcessing || !isLoaded}
                   className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                      Boosting... {Math.round(progress)}%
                    </>
                  ) : !isLoaded ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                      Initializing FFmpeg...
                    </>
                  ) : (
                    "Apply Volume Boost"
                  )}
                </Button>
              ) : (
                <Button 
                   onClick={() => {
                     const link = document.createElement("a")
                     const ext = audioFile?.name.split('.').pop() || "mp3"
                     const outExt = audioFile?.type.startsWith("video/") ? "mp3" : ext
                     link.download = `${fileName}-boosted.${outExt}`
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
                   setVolumeLevel(2.0)
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
                 
                 <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 transition-transform hover:scale-105">
                     <Volume2 className={`w-12 h-12 text-purple-400 ${isProcessing ? 'animate-pulse' : ''}`} />
                 </div>
                 
                 <div className="w-full space-y-2">
                     <h4 className="text-sm font-medium text-gray-400 pl-2">
                        {resultSrc ? "Boosted Result" : "Original View"}
                     </h4>
                     <audio 
                       src={resultSrc || audioSrc} 
                       controls 
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
