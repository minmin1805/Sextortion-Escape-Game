import WelcomePage from '../pages/WelcomePage'
import ContentWarningPage from '../pages/ContentWarningPage'
import Frame1 from '../pages/Frame1'
import Frame2 from '../pages/Frame2'
import Frame3 from '../pages/Frame3'
import InstructionPage from '../pages/InstructionPage'
import GamePage from '../pages/GamePage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EndgamePage from '../pages/EndgamePage'
import { GameProvider } from '../context/GameContext'
import { MusicProvider } from '../context/MusicContext'
import { SoundProvider, useSounds } from '../context/SoundContext'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import MusicToggleButton from './components/MusicToggleButton'

const GAME_ROUTES = ['/frame1', '/frame2', '/frame3']

function AppContent() {
  const { playClickSound, playButtonClickSound } = useSounds()
  const location = useLocation()
  const showMusicToggle = GAME_ROUTES.includes(location.pathname)

  useEffect(() => {
    const handleGlobalClick = (ev) => {
      if (ev.target.closest('[data-skip-global-click-sound]')) return
      if (ev.target.closest('button, [role="button"]')) {
        playButtonClickSound()
      } else {
        playClickSound()
      }
    }
    document.addEventListener('click', handleGlobalClick, true)
    return () => document.removeEventListener('click', handleGlobalClick, true)
  }, [playClickSound, playButtonClickSound])

  return (
    <>
      {showMusicToggle && <MusicToggleButton />}
      <Routes>
      <Route path='/' element={<ContentWarningPage />} />
        <Route path='/welcome' element={<WelcomePage />} />
        <Route path='/frame1' element={<Frame1 />} />
        <Route path='/frame2' element={<Frame2 />} />
        <Route path='/frame3' element={<Frame3 />} />
        <Route path='/game' element={<GamePage />} />
        <Route path='/instructions' element={<InstructionPage />} />
        <Route path='/endgame' element={<EndgamePage />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <GameProvider>
      <MusicProvider>
        <SoundProvider>
          <Router>
            <AppContent />
          </Router>
        </SoundProvider>
      </MusicProvider>
    </GameProvider>
  )
}

export default App
