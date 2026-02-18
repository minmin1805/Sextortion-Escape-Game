import React from 'react'
import clockImage from '../assets/GamePage/clockicon.png'

function ClockDisplay() {
  return (
    <div className='bg-[#ddecff] rounded-2xl p-2 flex h-[50%] mt-10'>
        <div className='bg-[#6babff] flex items-center justify-center py-1 gap-2 px-2 rounded-2xl'>
            <img src={clockImage} className='h-11'/>
            <p className='text-2xl font-bold'>23 seconds</p>
        </div>

    </div>
  )
}

export default ClockDisplay
