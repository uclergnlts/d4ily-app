"use client"

import { useEffect, useRef } from "react"

interface AudioWaveVisualizerProps {
  isPlaying: boolean
  color?: string
}

export function AudioWaveVisualizer({ isPlaying, color = "#000000" }: AudioWaveVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const barCount = 40
    const barWidth = width / barCount
    let animationId: number

    const bars = Array.from({ length: barCount }, () => Math.random())

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      bars.forEach((bar, index) => {
        if (isPlaying) {
          bars[index] = Math.max(0.1, Math.min(1, bar + (Math.random() - 0.5) * 0.3))
        } else {
          bars[index] = Math.max(0.1, bar * 0.95)
        }

        const barHeight = bars[index] * height * 0.8
        const x = index * barWidth
        const y = (height - barHeight) / 2

        ctx.fillStyle = color
        ctx.fillRect(x + barWidth * 0.2, y, barWidth * 0.6, barHeight)
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isPlaying, color])

  return <canvas ref={canvasRef} width={400} height={60} className="h-full w-full" />
}
