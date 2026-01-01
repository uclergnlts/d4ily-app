"use client"

import { Button } from "@/components/ui/button"
import { Music2, Play, Pause } from "lucide-react"
import type { Digest } from "@/lib/digest-data"
import { useState, useRef, useEffect } from "react"
import Link from 'next/link'

interface PodcastSimpleProps {
  digest?: Digest
}

export function PodcastSimple({ digest }: PodcastSimpleProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Use the digest provided, or return null if no audio possible.
  // We need at least an audio_url to play, or spotify_url to link.

  if (!digest) return null

  // If there is no specific audio title, use digest title.
  // Assuming digest has audio_url if this component is used.
  // If not, maybe we just show generic "Daily Podcast"?

  const hasAudio = !!digest.audio_url
  const hasSpotify = !!digest.spotify_url

  // If neither logic exists, maybe hide?
  if (!hasAudio && !hasSpotify) return null

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Handle audio end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, []);

  return (
    <section className="bg-neutral-900 dark:bg-neutral-950 py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 flex items-center justify-center relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 opacity-20">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full border-2 border-white"
                    style={{
                      width: `${(i + 1) * 20}%`,
                      height: `${(i + 1) * 20}%`,
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ))}
              </div>
              <Music2 className={`w-16 h-16 text-white relative z-10 ${isPlaying ? 'animate-pulse' : ''}`} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 text-green-500 text-sm font-semibold mb-2 justify-center md:justify-start">
              <span className={`w-2 h-2 rounded-full bg-green-500 ${isPlaying ? 'animate-ping' : ''}`} />
              PODCAST • {digest.digest_date}
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">{digest.title || "Günün Özeti"}</h2>
            <p className="text-neutral-400 mb-6 line-clamp-2">
              {digest.intro || "Gündemin derinliklerine dalarken kulaklarınızla takip edin. Uzmanların analizleri artık sizinle."}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              {hasAudio && (
                <>
                  <audio ref={audioRef} src={digest.audio_url} className="hidden" />
                  <Button
                    onClick={togglePlay}
                    className="bg-white hover:bg-gray-100 text-black font-semibold transition-colors rounded-full px-6"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                    {isPlaying ? "Durdur" : "Dinle"}
                  </Button>
                </>
              )}

              <Button asChild className="bg-[#872EC4] hover:bg-[#9F3BD6] text-white font-semibold transition-colors rounded-full px-6 arrow-transparent">
                <Link href="https://podcasts.apple.com/us/podcast/yapay-g%C3%BCndem/id1862696373" target="_blank">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.5 12.5c0-5.799-4.701-10.5-10.5-10.5s-10.5 4.701-10.5 10.5c0 2.68 1.002 5.127 2.657 7l-1.657 1.5c-2.071-2.288-3.329-5.263-3.329-8.5 0-7.076 5.286-12.871 12.061-13.431.144-.012.292-.019.44-.019 7.423 0 13.5 6.077 13.5 13.5 0 3.237-1.258 6.212-3.329 8.5l-1.657-1.5c1.655-1.873 2.657-4.32 2.657-7zm-10.5-6.5c-3.584 0-6.5 2.916-6.5 6.5s2.916 6.5 6.5 6.5 6.5-2.916 6.5-6.5-2.916-6.5-6.5-6.5zm0 11c-2.481 0-4.5-2.019-4.5-4.5s2.019-4.5 4.5-4.5 4.5 2.019 4.5 4.5-2.019 4.5-4.5 4.5zm0-2.5c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z" />
                  </svg>
                  Apple Podcast'te Dinle
                </Link>
              </Button>

              <Button asChild className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold transition-colors rounded-full px-6 border-transparent">
                <Link href={digest.spotify_url || "https://open.spotify.com/show/1zytVKv9PQmGuKGhWLEzfU?si=MBqabxj9QreCHYYCTtdw9g"} target="_blank">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                  Spotify'da Dinle
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
