import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../src/assets/background/cosmicbackground.png";
import { FaLongArrowAltRight } from "react-icons/fa";

function Frame2() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col py-10"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-white text-4xl font-bold text-center max-w-2xl">
          What would <span className="text-yellow-400 font-bold">YOU</span> do in <span className="text-yellow-400 font-bold">30 seconds</span>? 
        </p>
        <p className="text-white text-4xl font-bold text-center max-w-2xl mt-5">
          This is <span className="text-red-400 font-bold">sextortion</span>. You’re about to learn how to <span className="text-[#a3dffd] font-bold">ESCAPE</span> it
        </p>
      </div>

      <button className='absolute bottom-10 right-10 bg-[#8B5CF6] text-white px-4 py-2 rounded-md flex items-center gap-2'>
        Continue <FaLongArrowAltRight />
      </button>
    </div>
  );
}

export default Frame2;
