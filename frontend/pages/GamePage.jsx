import React from 'react'
import GameHeader from '../src/components/GameBanner'
import AbilityDisplay from '../src/components/AbilityDisplay'
import ClockDisplay from '../src/components/ClockDisplay'
import QuestionDisplay from '../src/components/QuestionDisplay'

function GamePage() {
  return (
    <div className='bg-[#8B5CF6] min-h-screen min-w-screen flex flex-col items-center'>
        
        <GameHeader />

        <div className='flex flex-row w-full justify-center'>

            <AbilityDisplay />
            <QuestionDisplay />
            <ClockDisplay />
        </div>
    </div>
  )
}

export default GamePage
