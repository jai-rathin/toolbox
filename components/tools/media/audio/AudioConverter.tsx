"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, Music, RefreshCw, Loader2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"

export default function AudioConverter() {
  const [audioSrc, setAudioSrc] = useState<string | null>(null)
  const [fileName, setFileName] = useState("audio")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  
  const [targetFormat, setTargetFormat] = useState<"mp3" | "wav" | "ogg">("mp3")
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

  const convertAudio = async () => {
    if (!audioFile || !isLoaded) return
    setIsProcessing(true)
    setProgress(0)
    setResultSrc(null)

    const ffmpeg = ffmpegRef.current
    const ext = audioFile.name.split('.').pop() || 'mp3'
    const inputName = `input.${ext}`
    const outputName = `output.${targetFormat}`

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(audioFile))
      
      // FFmpeg command to extract/convert audio
      const args = ["-i", inputName, "-vn"] // -vn drops video completely if it's a video file
      
      if (targetFormat === "mp3") {
          args.push("-c:a", "libmp3lame", "-q:a", "2") // VBR high quality
      } else if (targetFormat === "ogg") {
          args.push("-c:a", "libvorbis", "-q:a", "5") // Equivalent high quality
      } else {
          // wav is uncompressed
          args.push("-c:a", "pcm_s16le")
      }
      
      args.push(outputName)

      await ffmpeg.exec(args)

      const data = await ffmpeg.readFile(outputName)
      const dataBlob = new Blob([(data as Uint8Array).buffer], { type: `audio/${targetFormat}` })
      const url = URL.createObjectURL(dataBlob)
      
      setResultSrc(url)
    } catch (err) {
      console.error(err)
      alert("Error converting audio. File might be unsupported.")
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
          description="MP3, WAV, OGG, or extract from Video" 
          accept="audio/*,video/*" 
          icon={<Music className="w-8 h-8" />} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
            
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 <Music className="w-4 h-4 text-purple-400" /> Audio Converter
              </h3>
              
              <div className="space-y-2 pt-2">
                <Label className="text-gray-300 text-sm">Target Format</Label>
                <select 
                  value={targetFormat} 
                  onChange={(e) => setTargetFormat(e.target.value as any)}
                  className="w-full h-12 bg-white/5 text-gray-200 border border-white/10 rounded-xl px-3 outline-none focus:ring-1 focus:ring-purple-500 font-medium"
                  disabled={isProcessing}
                >
                  <option value="mp3" className="bg-gray-900">MP3 (Widely Supported)</option>
                  <option value="wav" className="bg-gray-900">WAV (Uncompressed Quality)</option>
                  <option value="ogg" className="bg-gray-900">OGG (Open Standard)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              {!resultSrc ? (
                <Button 
                   onClick={convertAudio} 
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

          <div className="md:col-span-8 flex flex-col items-center justify-center bg-black/20 border border-white/10 rounded-3xl p-8 min-h-[400px]">
             <div className="w-full max-w-md flex flex-col items-center justify-center gap-6">
                 
                 <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                     <Music className="w-12 h-12 text-purple-400" />
                 </div>
                 
                 <div className="w-full space-y-2">
                     <h4 className="text-sm font-medium text-gray-400 pl-2">
                        {resultSrc ? "Converted Audio" : "Original Audio"}
                     </h4>
                     <audio 
                       src={resultSrc || audioSrc} 
                       controls 
                       className="w-full"
                     />
                 </div>
                 
                 {resultSrc && (
                     <div className="w-full space-y-2 pt-6 opacity-70 border-t border-white/5">
                         <h4 className="text-sm font-medium text-gray-400 pl-2">
                            Original Input
                         </h4>
                         <audio 
                           src={audioSrc} 
                           controls 
                           className="w-full h-8"
                         />
                     </div>
                 )}

             </div>
          </div>
        </div>
      )}
    </div>
  )
}
