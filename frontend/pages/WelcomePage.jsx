import React from 'react'
import logo from '../src/assets/WelcomePage/logo.png';
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

function WelcomePage() {

    const [username, setUserName] = useState("");

    const navigate = useNavigate();

    const handleContinue = () => {
        navigate('/instructions')
    };

  return (
    <div className='bg-[#b885f6] min-h-screen flex flex-col items-center justify-center'>
        <div className='w-[50%]'>
            <img src={logo} />
        </div>

        <div className='flex flex-col items-center justify-center bg-[#f2f9fe] p-5 rounded-2xl mt-5'>

            <p className='text-3xl font-bold'>Enter your name...</p>

            <input 
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                placeholder="Enter your name here"
                className='border text-center w-full px-25 py-2 mt-4 bg-white border-black'
            />

            <button className='py-2 px-5 bg-[#1858be] mt-5 rounded-2xl text-white font-bold text-2xl' onClick={(e) => {handleContinue()}}>
                Start the Game
            </button>
        </div>
    </div>
  )
}

export default WelcomePage
