import React from "react";
import correctImage from "../assets/CorrectPopup/correctimage.png";
import lightbulbImage from "../assets/GamePage/lightbulbicon.png";
import { FaLongArrowAltRight } from "react-icons/fa";

function CorrectPopup({ feedback, points, onContinue }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-3">
      {/* Card fills most of the screen on phone and scrolls if content is tall */}
      <div className="bg-[#ddecff] w-full max-w-md md:max-w-2xl max-h-[90vh] rounded-2xl border border-black p-3 sm:p-4 overflow-y-auto">
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl overflow-y-auto">
          {/* Header */}
          <div className="flex items-center bg-[#017407] border w-full gap-2 p-2 sm:p-3">
            <img src={correctImage} alt="correct image" className="w-[18%] max-w-[64px]" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Correct!</h1>
          </div>

          {/* Points */}
          <div className="flex flex-col items-center justify-center mt-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl">+{points ?? 0} points!</h1>
          </div>

          <div className="h-0.5 bg-[#2e0f53] w-[90%] mt-3 mb-3" />

          {/* Reason */}
          <div className="flex flex-col items-center justify-center mt-1 px-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl">Best Choice!</h1>
            <p className="text-center text-sm sm:text-base mt-2">
              {feedback?.reason ?? "You made the right choice."}
            </p>
          </div>

          <div className="h-0.5 bg-[#2e0f53] w-[90%] mt-3 mb-3" />

          {/* How this defeats sextortion */}
          {Array.isArray(feedback?.howThisDefeats) && feedback.howThisDefeats.length > 0 && (
            <>
              <div className="flex flex-col items-center justify-center mt-1 px-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl">How This Defeats Sextortion?</h1>
                <ul className="list-disc text-left text-sm sm:text-base mt-2">
                  {feedback.howThisDefeats.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="h-0.5 bg-[#2e0f53] w-[90%] mt-3 mb-3" />
            </>
          )}

          {/* Next steps */}
          {Array.isArray(feedback?.nextSteps) && feedback.nextSteps.length > 0 && (
            <>
              <div className="flex flex-col items-center justify-center mt-1 px-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl">Next Steps:</h1>
                <ol className="list-decimal text-left text-sm sm:text-base mt-2">
                  {feedback.nextSteps.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              </div>
              <div className="h-0.5 bg-[#2e0f53] w-[90%] mt-3 mb-3" />
            </>
          )}

          {/* The Truth */}
          {(feedback?.theTruth ?? "") && (
            <div className="bg-[#a5ccff] flex items-center justify-center mt-2 mb-3 w-[80%] gap-2 p-2 rounded-2xl">
              <img src={lightbulbImage} alt="lightbulb" className="w-[16%] max-w-[56px]" />
              <p className="text-center text-xs sm:text-sm md:text-[15px]">{feedback.theTruth}</p>
            </div>
          )}

          {/* Button */}
          <button
            className="bg-[#9d51fb] text-white px-4 py-3 sm:py-4 rounded-2xl mt-3 mb-5 flex items-center justify-center gap-2 text-base sm:text-lg"
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
