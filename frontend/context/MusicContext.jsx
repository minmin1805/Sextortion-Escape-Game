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

  const setActiveTrack = useCallback((track) => {
    if (track !== 'intro' && track !== 'game') return
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.src = SOURCES[track]
      audio.load()
    }
    setActiveTrackState(track)
    setIsPlaying((was) => {
      if (!was) return false
      if (audio) {
        audio.volume = VOLUME
        audio.play().catch(() => {})
      }
      return true
    })
  }, [])

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.volume = VOLUME
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }, [isPlaying])

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
    audio.play().then(() => setIsPlaying(true)).catch(() => {})
  }, [activeTrack, isPlaying])

  const pauseMusic = useCallback(() => {
    const audio = audioRef.current
    if (audio) audio.pause()
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
