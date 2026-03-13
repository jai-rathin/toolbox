"use client"

import { useState, useRef } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Music, Upload, Download, RefreshCw, FileAudio } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"

export default function VideoToAudio() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [outputFormat, setOutputFormat] = useState<"mp3" | "wav">("mp3")

  const handleProcess = async () => {
    if (!file) return
    setIsProcessing(true)
    
    try {
      // In a real browser FFmpeg environment, we'd load FFmpeg.wasm here.
      // Since video to audio requires heavy processing, we'll simulate the interface
      // and if ffmpeg is available in window we could use it, but for next.js
      // we'll rely on the standardized FileUploader and basic logic.
      // Below is the mock processing logic simulating extraction.
      
      const { FFmpeg } = await import("@ffmpeg/ffmpeg")
      const { fetchFile } = await import("@ffmpeg/util")
      
      const ffmpeg = new FFmpeg()
      await ffmpeg.load()
      
      await ffmpeg.writeFile("input", await fetchFile(file))
      
      // Extract audio
      const outputFilename = `output.${outputFormat}`
      await ffmpeg.exec(["-i", "input", "-vn", "-acodec", outputFormat === "mp3" ? "libmp3lame" : "pcm_s16le", outputFilename])
      
      const data = await ffmpeg.readFile(outputFilename)
      const url = URL.createObjectURL(new Blob([data as unknown as BlobPart], { type: `audio/${outputFormat}` }))
      
      setAudioUrl(url)
    } catch (err) {
      console.error(err)
      alert("Error extracting audio. Ensure you're on a supported browser.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setAudioUrl(null)
    setIsProcessing(false)
  }

  return (
    <ToolLayout
      title="Video to Audio"
      description="Extract high-quality audio tracks (MP3 or WAV) directly from your video files in the browser."
      category="Audio Tools"
      categoryHref="/tools?category=audio"
    >
      <div className="space-y-6">
        {!audioUrl ? (
          <>
            <div className="glass p-6 rounded-2xl border border-white/10">
              <FileUploader
                accept="video/*"
                onUpload={setFile}
              />
              {file && (
                <div className="mt-4 flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm font-medium text-gray-200">{file.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 bg-black/20 p-1.5 rounded-xl border border-white/5">
                {(["mp3", "wav"] as const).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setOutputFormat(fmt)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      outputFormat === fmt 
                        ? "bg-cyan-500 text-white shadow-lg" 
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    .{fmt.toUpperCase()}
                  </button>
                ))}
              </div>

              <Button
                onClick={handleProcess}
                disabled={!file || isProcessing}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 h-10 rounded-xl"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileAudio className="w-4 h-4 mr-2" />
                )}
                {isProcessing ? "Extracting Audio..." : "Extract Audio"}
              </Button>
            </div>
          </>
        ) : (
          <div className="glass p-8 rounded-2xl border border-cyan-500/20 text-center space-y-6 animate-scale-in">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-cyan-400" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Extraction Complete!</h3>
              <p className="text-gray-400 text-sm">Your audio has been successfully extracted.</p>
            </div>

            <audio controls src={audioUrl} className="w-full max-w-md mx-auto" />

            <div className="flex items-center justify-center gap-4 pt-4">
              <Button onClick={handleReset} variant="outline" className="border-white/10 text-white hover:bg-white/5 h-10 px-6 rounded-xl">
                Start Over
              </Button>
              <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white h-10 px-8 rounded-xl shadow-lg">
                <a href={audioUrl} download={`extracted_audio.${outputFormat}`}>
                  <Download className="w-4 h-4 mr-2" />
                  Download {outputFormat.toUpperCase()}
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
