import React from 'react'
import ChoiceBox from '../components/ChoiceBox'

function AnswersDisplay() {

    const answerstubs = [
        { id: 1, color: '#E74C3C', letter: 'A', text: 'Pay them the $100' },
        { id: 2, color: '#F1C40F', letter: 'B', text: 'Tell a trusted adult and report it' },
        { id: 3, color: '#3498DB', letter: 'C', text: 'Delete the app and hope they forget' },
        { id: 4, color: '#27AE60', letter: 'D', text: 'Threaten to report them' },
    ]


  return (
    <div className='flex flex-col justify-center items-center mt-5'>
      <h1 className='text-4xl font-bold text-white'>What should you do?</h1>

      <div className='grid grid-cols-2 gap-x-15 gap-y-7 mt-7'>
        {answerstubs.map((eachAnswer) => (
            <ChoiceBox key={eachAnswer.id} color={eachAnswer.color} letter={eachAnswer.letter} text={eachAnswer.text} />
        ))}

      </div>
    </div>
  )
}

export default AnswersDisplay
