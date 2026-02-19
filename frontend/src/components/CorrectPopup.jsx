import React from "react";
import correctImage from "../assets/CorrectPopup/correctimage.png";
import lightbulbImage from "../assets/GamePage/lightbulbicon.png";
import { FaLongArrowAltRight } from "react-icons/fa";

function CorrectPopup({ feedback, points, onContinue }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-50">
      <div className="bg-[#ddecff] h-auto w-[40%] rounded-2xl border border-black p-2 overflow-y-auto">
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl   overflow-hidden">
          <div className="flex items-center  bg-[#017407] border w-full h-full gap-2 p-1">
            <img src={correctImage} alt="correct image" className="w-[18%]" />
            <h1 className="text-4xl font-bold text-white">Correct!</h1>
          </div>

          <div className="flex flex-col items-center justify-center mt-2">
            <h1 className="text-4xl">+{points ?? 0} points!</h1>
          </div>

          <div className='h-0.5 bg-[#2e0f53] w-[90%] mt-2 mb-2'></div>


          <div className='flex flex-col items-center justify-center mt-2'>
            <h1 className="text-4xl ">Best Choice!</h1>
            <p className="text-center">{feedback?.reason ?? "You made the right choice."}</p>
          </div>

          <div className='h-0.5 bg-[#2e0f53] w-[90%] mt-2 mb-2'></div>

          {Array.isArray(feedback?.howThisDefeats) && feedback.howThisDefeats.length > 0 && (
            <>
              <div className='flex flex-col items-center justify-center mt-2'>
                <h1 className="text-4xl ">How This Defeats Sextortion?</h1>
                <ul className="list-disc text-left">
                  {feedback.howThisDefeats.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className='h-0.5 bg-[#2e0f53] w-[90%] mt-2 mb-2'></div>
            </>
          )}

          {Array.isArray(feedback?.nextSteps) && feedback.nextSteps.length > 0 && (
            <>
              <div className='flex flex-col items-center justify-center mt-2'>
                <h1 className="text-4xl ">Next Steps:</h1>
                <ol className="list-decimal text-left">
                  {feedback.nextSteps.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              </div>
              <div className='h-0.5 bg-[#2e0f53] w-[90%] mt-2 mb-2'></div>
            </>
          )}

          {(feedback?.theTruth ?? "") && (
            <div className='bg-[#a5ccff] flex items-center justify-center mt-2 mb-2 w-[70%] gap-2 p-1 rounded-2xl'>
              <img src={lightbulbImage} alt="lightbulb" className="w-[18%]" />
              <p className="text-center text-[15px]">{feedback.theTruth}</p>
            </div>
          )}

          <button
            className="bg-[#9d51fb] text-white px-4 py-4 rounded-2xl h-[30px] mt-3 mb-5 flex items-center justify-center gap-2"
            onClick={onContinue}
          >
            Next Question <FaLongArrowAltRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CorrectPopup;
