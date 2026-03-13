"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, Music, RefreshCw, Loader2, Plus, GripVertical, Trash2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"

interface AudioTrack {
  id: string;
  file: File;
  name: string;
}

export default function AudioJoiner() {
  const [tracks, setTracks] = useState<AudioTrack[]>([])
  
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
    
    setTracks(prev => [...prev, {
       id: Math.random().toString(36).substring(7),
       file,
       name: file.name
    }])
  }

  const removeTrack = (id: string) => {
    setTracks(prev => prev.filter(t => t.id !== id))
  }

  const moveTrack = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newTracks = [...tracks]
      const temp = newTracks[index - 1]
      newTracks[index - 1] = newTracks[index]
      newTracks[index] = temp
      setTracks(newTracks)
    } else if (direction === 'down' && index < tracks.length - 1) {
      const newTracks = [...tracks]
      const temp = newTracks[index + 1]
      newTracks[index + 1] = newTracks[index]
      newTracks[index] = temp
      setTracks(newTracks)
    }
  }

  const joinAudio = async () => {
    if (tracks.length < 2 || !isLoaded) return
    setIsProcessing(true)
    setProgress(0)
    setResultSrc(null)

    const ffmpeg = ffmpegRef.current
    const outputName = `joined_output.mp3`

    try {
      const inputArgs: string[] = []
      let filterComplexStr = ""
      
      // Load all files into FFmpeg in-memory system
      for (let i = 0; i < tracks.length; i++) {
         const track = tracks[i]
         const ext = track.file.name.split('.').pop() || 'mp3'
         const inputName = `input_${i}.${ext}`
         
         await ffmpeg.writeFile(inputName, await fetchFile(track.file))
         inputArgs.push("-i", inputName)
         
         filterComplexStr += `[${i}:a]`
      }
      
      filterComplexStr += `concat=n=${tracks.length}:v=0:a=1[outa]`

      const args = [
          ...inputArgs,
          "-filter_complex", filterComplexStr,
          "-map", "[outa]",
          "-c:a", "libmp3lame",
          "-q:a", "2",
          outputName
      ]

      await ffmpeg.exec(args)

      const data = await ffmpeg.readFile(outputName)
      const dataBlob = new Blob([new Uint8Array(data as any)], { type: "audio/mp3" })
      const url = URL.createObjectURL(dataBlob)
      
      setResultSrc(url)
    } catch (err) {
      console.error(err)
      alert("Error joining audio. Formats might be corrupt.")
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-6 p-6 bg-black/20 border border-white/10 rounded-3xl h-fit">
          
          <div className="space-y-4 pt-2">
            <h3 className="font-semibold text-white flex items-center gap-2">
               <Plus className="w-5 h-5 text-purple-400" /> Audio Joiner
            </h3>
            <p className="text-sm text-gray-400">Combine multiple audio tracks chronologically.</p>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            {!resultSrc ? (
              <Button 
                 onClick={joinAudio} 
                 disabled={isProcessing || !isLoaded || tracks.length < 2}
                 className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 h-12"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                    Merging... {Math.round(progress)}%
                  </>
                ) : !isLoaded ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                    Initializing...
                  </>
                ) : tracks.length < 2 ? (
                  "Add at least 2 tracks"
                ) : (
                  `Merge ${tracks.length} Tracks`
                )}
              </Button>
            ) : (
              <Button 
                 onClick={() => {
                   const link = document.createElement("a")
                   link.download = `joined-audio.mp3`
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
                 setTracks([])
                 setResultSrc(null)
               }} 
               variant="ghost" 
               className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-12"
               disabled={isProcessing}
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Clear All Tracks
            </Button>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col gap-4 bg-black/20 border border-white/10 rounded-3xl p-6 min-h-[400px]">
           <h4 className="text-sm font-medium text-gray-400 mb-2">Track Sequence</h4>
           
           {!resultSrc && (
               <div className="h-48 border-2 border-dashed border-white/10 rounded-xl hover:border-purple-500/50 transition-colors bg-white/5 relative mb-4">
                  <FileUploader 
                    onUpload={handleUpload} 
                    description="Drop another track here" 
                    icon={<Music className="w-6 h-6" />}
                    accept="audio/*,video/*"
                  />
               </div>
           )}

           {resultSrc && (
               <div className="w-full space-y-2 mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                 <h4 className="text-sm font-semibold text-purple-300">Merged Result</h4>
                 <audio src={resultSrc} controls className="w-full" />
               </div>
           )}

           <div className="space-y-2 flex-1 overflow-y-auto pr-2">
             {tracks.map((track, index) => (
               <div key={track.id} className="flex gap-3 items-center bg-gray-900 border border-white/5 p-3 rounded-xl shadow-sm">
                 <div className="flex flex-col gap-1 text-gray-500">
                   <button onClick={() => moveTrack(index, 'up')} disabled={index === 0} className="hover:text-purple-400 disabled:opacity-30">▲</button>
                   <button onClick={() => moveTrack(index, 'down')} disabled={index === tracks.length - 1} className="hover:text-purple-400 disabled:opacity-30">▼</button>
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm text-gray-200 truncate font-medium">{index + 1}. {track.name}</p>
                   <p className="text-xs text-gray-500">{(track.file.size / 1024 / 1024).toFixed(2)} MB</p>
                 </div>
                 <Button onClick={() => removeTrack(track.id)} variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/20 hover:text-red-300 shrink-0">
                   <Trash2 className="w-4 h-4" />
                 </Button>
               </div>
             ))}
             {tracks.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">No tracks added yet.</div>
             )}
           </div>
        </div>
      </div>
    </div>
  )
}
