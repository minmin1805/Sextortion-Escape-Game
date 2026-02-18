import React from 'react'
import remove2Image from '../assets/GamePage/remove2.png'
import lightbulbImage from '../assets/GamePage/lightbulbicon.png'

function AbilityDisplay() {
  return (
    <div className='flex flex-col justify-center items-center gap-3'>
      <p className='text-3xl text-white font-bold'>Abilities</p>

      <button className='flex items-center justify-center bg-amber-100 rounded-2xl border border-black py-2 px-2'>
        <img src={lightbulbImage} className='h-10'/>
         Hint(1)</button>

      <button className='flex items-center justify-center bg-[#ddecff] rounded-2xl border border-black py-2 px-2'>
        <img src={remove2Image} className='h-10'/>
        Remove 2 (2)</button>
    </div>
  )
}

export default AbilityDisplay
