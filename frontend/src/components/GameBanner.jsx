import React from 'react'
import logo from '../assets/WelcomePage/logo.png'

function GameBanner() {
  return (
    <div className='bg-[#020744] w-full h-20 flex justify-between items-center'>
      <img src={logo} className=' h-[95%] ml-10'/>

      <div className='text-3xl text-white font-bold'>
        <p>Question: 3/10</p>
      </div>

      <div className='text-3xl text-white mr-10 font-bold'>
        <p>Score: 2500 pts</p>
      </div>
    </div>
  )
}

export default GameBanner
