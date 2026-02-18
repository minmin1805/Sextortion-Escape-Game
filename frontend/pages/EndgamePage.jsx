import React from "react";
import logo from "../src/assets/WelcomePage/logo.png";
import ScoreDisplay from "../src/components/ScoreDisplay";
import LeaderBoard from "../src/components/LeaderBoard";
import { IoMdDownload } from "react-icons/io";


function EndgamePage() {
  return (
    <div className="flex flex-col  h-screen bg-[#8B5CF6] min-w-screen items-center justify-center">
      <img src={logo} alt="logo" className="w-[300px] fixed top-5 left-5" />

      <div className="flex items-center justify-center w-[90%] gap-5 mt-20">
        <div>
          <ScoreDisplay />
        </div>

        <div className="w-[55%]">
          <LeaderBoard />
        </div>

        
      </div>

      <div className='flex mt-12 gap-40'>

        <button className='bg-[#ddecff] text-blue-900 px-4 py-2 rounded-md text-xl font-bold flex items-center gap-2'><IoMdDownload />Download Safety Checklist!</button>
        <button className='bg-[#ddecff] text-blue-900 px-4 py-2 rounded-md text-xl font-bold'>Exit To Main Menu</button>
      </div>
    </div>
  );
}

export default EndgamePage;
