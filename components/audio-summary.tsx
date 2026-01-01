"use client"

import type React from "react"
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Music } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"

interface AudioSummaryProps {
  audioUrl?: string | null
  audioStatus?: string
  duration?: number
  date?: string
  spotifyUrl?: string | null
}

interface PodcastEpisode {
  title: string
  audioUrl: string
  pubDate: string
  description: string
  duration?: string
  image?: string
}

interface PodcastChannel {
  title: string
  image?: string
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return mins + ":" + (secs < 10 ? "0" : "") + secs
}

function normalizeToYMD(input?: string): string | null {
  if (!input) return null
  const s = String(input).split("?")[0].trim()

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s

  const d = new Date(s)
  if (!Number.isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10)
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)

  return null
}

const DEFAULT_SPOTIFY_URL = "https://open.spotify.com/show/1zytVKv9PQmGuKGhWLEzfU?si=d72b6680d2bd4af1"

export default function AudioSummary({ date, spotifyUrl }: AudioSummaryProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null)
  const [channel, setChannel] = useState<PodcastChannel | null>(null)
  const [loading, setLoading] = useState(true)
  const podcastRef = useRef<HTMLAudioElement>(null)

  const finalSpotifyUrl = spotifyUrl || DEFAULT_SPOTIFY_URL

  useEffect(() => {
    const cleanDate = normalizeToYMD(date)

    if (!cleanDate) {
      setLoading(false)
      setHasError(false)
      setEpisode(null)
      return
    }

    setLoading(true)
    setHasError(false)

    const controller = new AbortController()

    const fetchEpisode = async () => {
      try {
        const cacheBuster = `${Date.now()}-${Math.random().toString(36).slice(2)}`
        const url = `/api/anchor-rss?date=${encodeURIComponent(cleanDate)}&_t=${cacheBuster}`
        const response = await fetch(url, {
          signal: controller.signal,
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        })

        if (response.status === 404) {
          setEpisode(null)
          setHasError(false)
          return
        }

        const data = await response.json().catch(() => ({}))

        if (data?.channel) setChannel(data.channel)

        if (!response.ok) {
          throw new Error("RSS feed fetch failed")
        }

        if (data?.success && data?.episode) {
          setEpisode(data.episode)
          setHasError(false)
        } else {
          setEpisode(null)
          setHasError(false)
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return
        setHasError(true)
        setEpisode(null)
      } finally {
        setLoading(false)
      }
    }

    fetchEpisode()

    return () => controller.abort()
  }, [date])

  useEffect(() => {
    const podcast = podcastRef.current
    if (!podcast || !episode) return

    setIsLoaded(false)
    setHasError(false)
    setCurrentTime(0)
    setAudioDuration(0)

    const handleLoadedMetadata = () => {
      setAudioDuration(podcast.duration || 0)
      setIsLoaded(true)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(podcast.currentTime || 0)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleError = () => {
      setHasError(true)
      setIsPlaying(false)
    }

    const handleCanPlay = () => {
      setIsLoaded(true)
    }

    podcast.addEventListener("loadedmetadata", handleLoadedMetadata)
    podcast.addEventListener("timeupdate", handleTimeUpdate)
    podcast.addEventListener("ended", handleEnded)
    podcast.addEventListener("error", handleError)
    podcast.addEventListener("canplay", handleCanPlay)

    podcast.load()

    return () => {
      podcast.removeEventListener("loadedmetadata", handleLoadedMetadata)
      podcast.removeEventListener("timeupdate", handleTimeUpdate)
      podcast.removeEventListener("ended", handleEnded)
      podcast.removeEventListener("error", handleError)
      podcast.removeEventListener("canplay", handleCanPlay)
    }
  }, [episode])

  const togglePlay = () => {
    const podcast = podcastRef.current
    if (!podcast || !episode) return

    if (isPlaying) {
      podcast.pause()
      setIsPlaying(false)
    } else {
      podcast
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setHasError(true)
          setIsPlaying(false)
        })
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const podcast = podcastRef.current
    if (!podcast) return

    const time = Number.parseFloat(e.target.value)
    podcast.currentTime = time
    setCurrentTime(time)
  }

  const skipForward = () => {
    const podcast = podcastRef.current
    if (!podcast) return
    podcast.currentTime = Math.min((podcast.currentTime || 0) + 15, audioDuration || 0)
  }

  const skipBackward = () => {
    const podcast = podcastRef.current
    if (!podcast) return
    podcast.currentTime = Math.max((podcast.currentTime || 0) - 15, 0)
  }

  const coverImage = episode?.image || channel?.image

  // LOADING UI
  if (loading) {
    return (
      <div id="audio-summary-container" className="mx-auto max-w-3xl px-4 py-6">
        <div className="overflow-hidden rounded-2xl bg-zinc-900 p-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-zinc-800 overflow-hidden">
              <Music className="h-7 w-7 animate-pulse text-zinc-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="h-4 w-32 bg-zinc-700 rounded animate-pulse" />
              <div className="mt-2 h-3 w-24 bg-zinc-800 rounded animate-pulse" />
            </div>
            <div className="h-4 w-10 bg-zinc-700 rounded animate-pulse" />
          </div>

          <div className="mt-6 flex items-center justify-center gap-6">
            <Shuffle className="h-4 w-4 text-zinc-600" />
            <SkipBack className="h-5 w-5 text-zinc-600" />
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-700 animate-pulse">
              <Play className="h-5 w-5 text-zinc-500 ml-0.5" />
            </div>
            <SkipForward className="h-5 w-5 text-zinc-600" />
            <Repeat className="h-4 w-4 text-zinc-600" />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-zinc-500 w-10 text-right">0:00</span>
            <div className="flex-1 h-1 bg-zinc-700 rounded-full" />
            <span className="text-xs text-zinc-500 w-10">0:00</span>
          </div>
        </div>
      </div>
    )
  }

  // No episode but Spotify exists -> Spotify button card
  if (!episode && spotifyUrl) {
    return (
      <div id="audio-summary-container" className="mx-auto max-w-3xl px-4 py-6">
        <div className="overflow-hidden rounded-2xl bg-zinc-900 p-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#1DB954] to-[#169c46]">
              {coverImage ? (
                <Image
                  src={coverImage || "/placeholder.svg"}
                  alt="Podcast kapak görseli"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Music className="h-7 w-7 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">Günlük Podcast</h3>
              <p className="text-sm text-zinc-400 flex items-center gap-1.5">
                <span className="inline-flex h-4 w-4 rounded-full bg-[#1DB954] items-center justify-center">
                  <Volume2 className="h-2.5 w-2.5 text-white" />
                </span>
                D4ily Popcast
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6">
            <Shuffle className="h-4 w-4 text-zinc-600" />
            <SkipBack className="h-5 w-5 text-zinc-500" />
            <a
              href={finalSpotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1DB954] transition-transform hover:scale-105"
              aria-label="Spotify'da oynat"
            >
              <Play className="h-5 w-5 text-black ml-0.5" fill="black" />
            </a>
            <SkipForward className="h-5 w-5 text-zinc-500" />
            <Repeat className="h-4 w-4 text-zinc-600" />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-zinc-500 w-10 text-right">0:00</span>
            <div className="flex-1 h-1 bg-zinc-700 rounded-full" />
            <span className="text-xs text-zinc-500 w-10">0:00</span>
          </div>

          <div className="mt-4 flex justify-center">
            <a
              href={finalSpotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#1DB954] hover:underline"
            >
              Spotify&apos;da aç ve takip et
            </a>
          </div>
        </div>
      </div>
    )
  }

  // No episode -> "not ready" card (or error)
  if (!episode) {
    return (
      <div id="audio-summary-container" className="mx-auto max-w-3xl px-4 py-6">
        <div className="overflow-hidden rounded-2xl bg-zinc-900 p-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-zinc-800">
              {coverImage ? (
                <Image
                  src={coverImage || "/placeholder.svg"}
                  alt="Podcast kapak görseli"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Music className="h-7 w-7 text-zinc-500" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">Günlük Podcast</h3>
              <p className={`text-sm ${hasError ? "text-red-300" : "text-zinc-500"}`}>
                {hasError ? "Popcast yüklenemedi" : "Henüz hazırlanmadı"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6">
            <Shuffle className="h-4 w-4 text-zinc-700" />
            <SkipBack className="h-5 w-5 text-zinc-700" />
            <a
              href={finalSpotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1DB954] transition-transform hover:scale-105"
              aria-label="Spotify'da dinle"
            >
              <Play className="h-5 w-5 text-black ml-0.5" fill="black" />
            </a>
            <SkipForward className="h-5 w-5 text-zinc-700" />
            <Repeat className="h-4 w-4 text-zinc-700" />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-zinc-600 w-10 text-right">0:00</span>
            <div className="flex-1 h-1 bg-zinc-800 rounded-full" />
            <span className="text-xs text-zinc-600 w-10">0:00</span>
          </div>

          <div className="mt-4 flex justify-center">
            <a
              href={finalSpotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#1DB954] hover:underline"
            >
              Spotify&apos;da dinle
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Episode exists -> player
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="overflow-hidden rounded-2xl bg-zinc-900 p-5 shadow-xl">
        <audio
          ref={podcastRef}
          src={episode.audioUrl}
          preload="metadata"
          playsInline
          aria-label="Günlük podcast özeti"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            disabled={!isLoaded || hasError}
            className="group relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-zinc-700 to-zinc-800 transition-transform hover:scale-105 disabled:hover:scale-100"
            aria-label={isPlaying ? "Duraklat" : "Oynat"}
          >
            {coverImage ? (
              <>
                <Image
                  src={coverImage || "/placeholder.svg"}
                  alt="Podcast kapak görseli"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-white" />
                  ) : (
                    <Play className="h-6 w-6 text-white ml-0.5" />
                  )}
                </div>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white ml-0.5" />}
              </div>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{episode.title || "Günlük Podcast"}</h3>
            <p className="text-sm text-zinc-400 truncate">
              {episode.description ? (
                <span className="line-clamp-1">{episode.description.substring(0, 60)}...</span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span className="inline-flex h-4 w-4 rounded-full bg-[#1DB954] items-center justify-center">
                    <Volume2 className="h-2.5 w-2.5 text-white" />
                  </span>
                  D4ily Popcast
                </span>
              )}
            </p>
          </div>

          <span className="hidden md:block text-xs text-zinc-500">D4ily AI</span>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6">
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors" aria-label="Karıştır">
            <Shuffle className="h-4 w-4" />
          </button>

          <button
            onClick={skipBackward}
            disabled={!isLoaded || hasError}
            className="text-zinc-400 hover:text-white transition-colors disabled:text-zinc-700"
            aria-label="15 saniye geri"
          >
            <SkipBack className="h-5 w-5" />
          </button>

          <button
            onClick={togglePlay}
            disabled={!isLoaded || hasError}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white transition-transform hover:scale-105 disabled:bg-zinc-700 disabled:hover:scale-100"
            aria-label={isPlaying ? "Duraklat" : "Oynat"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-black" fill="black" />
            ) : (
              <Play className="h-5 w-5 text-black ml-0.5" fill="black" />
            )}
          </button>

          <button
            onClick={skipForward}
            disabled={!isLoaded || hasError}
            className="text-zinc-400 hover:text-white transition-colors disabled:text-zinc-700"
            aria-label="15 saniye ileri"
          >
            <SkipForward className="h-5 w-5" />
          </button>

          <button className="text-zinc-500 hover:text-zinc-300 transition-colors" aria-label="Tekrarla">
            <Repeat className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
          <div className="flex-1 relative">
            <input
              type="range"
              min={0}
              max={audioDuration || 100}
              value={currentTime}
              onChange={handleSeek}
              disabled={!isLoaded || hasError}
              aria-label="İlerleme çubuğu"
              className="w-full h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer disabled:cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:opacity-0 hover:[&::-webkit-slider-thumb]:opacity-100 [&::-webkit-slider-thumb]:transition-opacity"
              style={{
                background:
                  audioDuration > 0
                    ? `linear-gradient(to right, #ffffff ${(currentTime / audioDuration) * 100}%, #3f3f46 ${(currentTime / audioDuration) * 100}%)`
                    : "#3f3f46",
              }}
            />
          </div>
          <span className="text-xs text-zinc-400 w-10 tabular-nums">{formatTime(audioDuration || 0)}</span>
        </div>

        <div className="mt-5 flex justify-center">
          <a
            href={finalSpotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#1DB954] px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-[#1ed760] hover:scale-105"
          >
            <Music className="h-4 w-4" />
            <span>Spotify&apos;da Dinle!</span>
          </a>
        </div>
      </div>
    </div>
  )
}
