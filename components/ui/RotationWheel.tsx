"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { RotateCw } from "lucide-react"

interface RotationWheelProps {
  value: number // strictly between -180 and 180 or 0 to 360, but typically dealing with standard degrees. Let's output 0 to 359 or -180 to 180. We'll use 0 to 359 internally and can output standard degrees.
  onChange: (degrees: number) => void
  onReset: () => void
  size?: number
}

// Keep it between -180 to 180 or similar. We will just pass out 0-359 or continuous angles.
// Actually rotation in degrees works well from -180 to 180 in most apps.
export function RotationWheel({ value, onChange, onReset, size = 200 }: RotationWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  // Normalize angle to 0-360 for wheel display, maybe map back to -180/180
  const displayAngle = ((value % 360) + 360) % 360

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    updateAngle(e.clientX, e.clientY)
    // Capture pointer to allow dragging outside the element
    if (containerRef.current) {
        containerRef.current.setPointerCapture(e.pointerId)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    updateAngle(e.clientX, e.clientY)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false
    if (containerRef.current) {
        containerRef.current.releasePointerCapture(e.pointerId)
    }
  }

  const updateAngle = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Calculate angle in radians
    const dx = clientX - centerX
    const dy = clientY - centerY
    let radians = Math.atan2(dy, dx)
    
    // Convert to degrees
    let degrees = radians * (180 / Math.PI)
    // Shift so 0 is at top (standard design for rotation wheels usually has 0 at top or at right)
    // Let's keep 0 at Top:
    degrees += 90
    
    // Normalize to 0-359
    if (degrees < 0) degrees += 360
    
    // Round to nearest integer for snapping feel or leave exact for smooth
    degrees = Math.round(degrees)
    
    // Convert 181-359 range back to -179 to -1 for easier UX? Or just pass 0-359.
    // Standard image editors often show -45, 45, etc.
    let finalDegree = degrees > 180 ? degrees - 360 : degrees
    
    onChange(finalDegree)
  }, [onChange])

  // Generate tick marks
  const ticks = []
  for (let i = 0; i < 72; i++) {
    const isMajor = i % 9 === 0 // every 45 degrees
    ticks.push(
      <div 
        key={i}
        className={`absolute top-0 left-1/2 -translate-x-1/2 origin-bottom ${isMajor ? 'h-3 w-1 bg-white/60' : 'h-2 w-0.5 bg-white/20'}`}
        style={{ transform: `rotate(${i * 5}deg)`, height: size / 2 }}
      >
        <div className={`w-full ${isMajor ? 'h-3 bg-white/60' : 'h-2 bg-white/20'} rounded-full`}></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      <div 
        ref={containerRef}
        className="relative rounded-full border-[6px] border-white/5 bg-black/40 touch-none cursor-pointer group shadow-2xl"
        style={{ width: size, height: size }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Ticks container */}
        <div className="absolute inset-2">
            {ticks}
        </div>

        {/* Center dot/hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/10 rounded-full"></div>

        {/* The active rotating indicator */}
        <div 
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex justify-center origin-center transition-transform duration-75"
          style={{ transform: `rotate(${value}deg)` }}
        >
          {/* Knob */}
          <div className="w-5 h-5 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)] border-2 border-white -mt-2.5"></div>
          {/* Line pointing to center */}
          <div className="absolute top-3 w-0.5 h-1/2 bg-cyan-500/50"></div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-3xl font-mono text-cyan-400 font-bold min-w-[3ch] text-center">
          {value > 0 ? `+${value}` : value}°
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl transition-colors font-medium border border-white/10"
        >
          <RotateCw className="w-4 h-4" /> Reset
        </button>
      </div>
    </div>
  )
}
