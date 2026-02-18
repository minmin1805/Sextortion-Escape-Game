import React from 'react'
import GameHeader from '../src/components/GameBanner'
import AbilityDisplay from '../src/components/AbilityDisplay'
import ClockDisplay from '../src/components/ClockDisplay'
import QuestionDisplay from '../src/components/QuestionDisplay'
import AnswersDisplay from '../src/components/AnswersDisplay'
import CorrectPopup from '../src/components/CorrectPopup'
import IncorrectPopup from '../src/components/IncorrectPopup'
import { useState } from 'react'

function GamePage() {
    const [correctPopup, setCorrectPopup] = useState(false);
    const [incorrectPopup, setIncorrectPopup] = useState(false);

    const toggleCorrectPopup = () => {
        setCorrectPopup(!correctPopup);
    }

    const toggleIncorrectPopup = () => {
        setIncorrectPopup(!incorrectPopup);
    }
    
  return (
    <div className='bg-[#8B5CF6] min-h-screen min-w-screen flex flex-col items-center'>

        {correctPopup && <CorrectPopup toggleCorrectPopup={toggleCorrectPopup}/>}
        {incorrectPopup && <IncorrectPopup toggleIncorrectPopup={toggleIncorrectPopup}/>}

        <GameHeader />

        <div className='flex flex-row w-full justify-center gap-15 mt-15'>

            <AbilityDisplay />
            <QuestionDisplay />
            <ClockDisplay />
        </div>

        <div className='flex flex-row gap-10 mt-10'>
        <button onClick={toggleCorrectPopup} className='bg-white text-black px-4 py-2 rounded-2xl h-[30px]'>toggle correct popup</button>
        <button onClick={toggleIncorrectPopup} className='bg-white text-black px-4 py-2 rounded-2xl h-[30px]'>toggle incorrect popup</button>
        </div>

        <div className='mt-10'>
            <AnswersDisplay />
        </div>
    </div>
  )
}

export default GamePage
