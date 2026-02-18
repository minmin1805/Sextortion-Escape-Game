import React from "react";
import correctImage from "../assets/CorrectPopup/correctimage.png";
import lightbulbImage from "../assets/GamePage/lightbulbicon.png";
import { FaLongArrowAltRight } from "react-icons/fa";

function CorrectPopup({ toggleCorrectPopup }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-50">
      <div className="bg-[#ddecff] h-auto w-[40%] rounded-2xl border border-black p-2 overflow-y-auto">
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl   overflow-hidden">
          <div className="flex items-center  bg-[#017407] border w-full h-full gap-2 p-1">
            <img src={correctImage} alt="correct image" className="w-[18%]" />
            <h1 className="text-4xl font-bold text-white">Correct!</h1>
          </div>

          <div className='flex flex-col items-center justify-center mt-2'>
            <h1 className="text-4xl ">+750 points!</h1>
          </div>

          <div className='h-0.5 bg-[#2e0f53] w-[90%] mt-2 mb-2'></div>


          <div className='flex flex-col items-center justify-center mt-2'>
            <h1 className="text-4xl ">Best Choice!</h1>
            <p className="text-center"> Sextortion works by making you feel ashamed and isolated. By telling a trusted adult, you remove the shame and power the blackmailer has over you. </p>
          </div>

          <div className='h-0.5 bg-[#2e0f53] w-[90%] mt-2 mb-2'></div>

          <div className='flex flex-col items-center justify-center mt-2'>
            <h1 className="text-4xl ">How This Defeats Sextortion?
            </h1>
            <ul>
            <li>Blackmailers depend on your shame to keep you silent</li>
            <li>They're counting on you being too embarrassed to tell</li>
            <li>Speaking up breaks their control over you</li>

            </ul>
          </div>

          <div className='flex flex-col items-center justify-center mt-2'>
            <h1 className="text-4xl ">Next Steps:</h1>
            <ol>
            <li>1.Tell a trusted adult what happened</li>
            <li>2.Delete the app and block the blackmailer</li>
            <li>Report the blackmailer to the police</li>
            </ol>
          </div>

          <div className='bg-[#a5ccff] flex items-center justify-center mt-2 mb-2 w-[70%] gap-2 p-1 rounded-2xl'>
            <img src={lightbulbImage} alt="lightbulb image" className="w-[18%] " />
            <p className="text-center text-[15px]">Adults understand you're a VICTIM. They want to HELP, not punish.
            </p>
          </div>

          <button
            className="bg-[#9d51fb] text-white px-4 py-4 rounded-2xl h-[30px] mt-3 mb-5 flex items-center justify-center gap-2"
            onClick={toggleCorrectPopup}
          >
            Next Question <FaLongArrowAltRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CorrectPopup;
