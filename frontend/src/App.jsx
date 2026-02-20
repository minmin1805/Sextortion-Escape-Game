import WelcomePage from '../pages/WelcomePage'
import Frame1 from '../pages/Frame1'
import Frame2 from '../pages/Frame2'
import Frame3 from '../pages/Frame3'
import InstructionPage from '../pages/InstructionPage'
import GamePage from '../pages/GamePage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EndgamePage from '../pages/EndgamePage'
import { GameProvider } from '../context/GameContext'

function App() {
  return (
    <GameProvider>
    <Router>
      <Routes>
        <Route path='/' element={<Frame1 />} />
        <Route path='/welcome' element={<WelcomePage />} />
        <Route path='/frame1' element={<Frame1 />} />
        <Route path='/frame2' element={<Frame2 />} />
        <Route path='/frame3' element={<Frame3 />} />
        <Route path='/game' element={<GamePage />} />
        <Route path='/instructions' element={<InstructionPage />} />
        <Route path='/endgame' element={<EndgamePage />} />
      </Routes>
    </Router>
    </GameProvider>
  )
}

export default App
