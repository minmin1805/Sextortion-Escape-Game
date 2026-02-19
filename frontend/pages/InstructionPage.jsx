import React from 'react'
import { useNavigate } from 'react-router-dom'

function InstructionPage() {

  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/game');
  }
  return (
    <div>
      <h1>Instructions</h1>
      <button className='bg-[#ddecff] text-blue-900 px-4 py-2 rounded-md text-xl font-bold flex items-center gap-2' onClick={handleStartGame}>Start Game</button>
    </div>
  )
}


export default InstructionPage
