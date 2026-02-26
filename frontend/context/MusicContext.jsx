import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react'
import introMusicSrc from '../src/assets/Sound/introframemusic.mp3'
import gameMusicSrc from '../src/assets/Sound/gamemusic.mp3'

const MusicContext = createContext(null)

const VOLUME = 0.4

const SOURCES = { intro: introMusicSrc, game: gameMusicSrc }

export function MusicProvider({ children }) {
  const audioRef = useRef(null)
  const [activeTrack, setActiveTrackState] = useState('intro')
  const [isPlaying, setIsPlaying] = useState(true)

  // Single source of truth: keep audio in sync with isPlaying (fixes toggle needing 3 clicks)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.volume = VOLUME
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [isPlaying])

  const setActiveTrack = useCallback((track) => {
    if (track !== 'intro' && track !== 'game') return
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.src = SOURCES[track]
      audio.load()
    }
    setActiveTrackState(track)
    // Don't set isPlaying here – let sync effect handle play so toggle state stays correct
  }, [])

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current
    setIsPlaying((prev) => {
      const next = !prev
      if (audio) {
        if (next) {
          audio.volume = VOLUME
          audio.play().catch(() => {})
        } else {
          audio.pause()
        }
      }
      return next
    })
  }, [])

  const startMusic = useCallback((trackOverride) => {
    const track = trackOverride === 'intro' || trackOverride === 'game' ? trackOverride : activeTrack
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.src = SOURCES[track]
    audio.load()
    setActiveTrackState(track)
    if (!isPlaying) return
    audio.volume = VOLUME
    audio.play().catch(() => {})
    // Don't set isPlaying here – sync effect and toggle are the only source of truth (avoids 3-click bug)
  }, [activeTrack, isPlaying])

  const pauseMusic = useCallback(() => {
    const audio = audioRef.current
    if (audio) audio.pause()
    // Don't set isPlaying to false – keeps "music on" as default when leaving content warning
  }, [])

  const value = { isPlaying, toggleMusic, startMusic, setActiveTrack, pauseMusic }

  return (
    <MusicContext.Provider value={value}>
      <audio ref={audioRef} src={introMusicSrc} loop preload="auto" aria-hidden />
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used inside MusicProvider')
  return ctx
}
