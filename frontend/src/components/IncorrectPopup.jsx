import React from "react";
import { IoClose } from "react-icons/io5";
import plusImage from "../assets/IncorrectPage/plusimage.png";
import { FaLongArrowAltRight } from "react-icons/fa";
import statsimage from '../assets/IncorrectPage/statsimage.png';

function IncorrectPopup({ feedback, points, onContinue }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center px-3">
      {/* Card fills most of the screen on phone and scrolls if content is tall */}
      <div className="bg-[#ddecff] w-full max-w-md md:max-w-2xl max-h-[90vh] p-3 sm:p-4 rounded-2xl overflow-y-auto">
        <div className="flex flex-col bg-white w-full justify-center items-center rounded-2xl overflow-y-auto">
          {/* Header */}
          <div className="bg-[#e92727] flex items-center w-full px-2 sm:px-3 py-2">
            <IoClose className="w-10 h-10 sm:w-14 sm:h-14 md:w-[90px] md:h-[90px]" color="white" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white ml-2">INCORRECT</h1>
          </div>

          {/* Points */}
          <div className="flex flex-col items-center justify-center mt-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl">{points ?? 0} Points</h1>
          </div>

          <div className="h-0.5 bg-[#2e0f53] w-[90%] mt-3 mb-3" />

          {/* Title + reason */}
          <div className="flex flex-col items-center justify-center mt-1 px-3">
            <h1 className="text-2xl sm:text-3xl font-semibold text-center">
              {feedback?.title ?? "Incorrect"}
            </h1>
            <p className="text-sm sm:text-base mt-2 text-center w-[90%]">
              {feedback?.reason ?? ""}
            </p>
          </div>

          <div className="h-0.5 bg-[#2e0f53] w-[90%] mt-3 mb-3" />

          {/* Consequences */}
          {(feedback?.consequence ?? "") && (
            <div className="flex flex-col items-center justify-center mt-1 px-3">
              <h1 className="text-2xl sm:text-3xl font-semibold">Consequences</h1>
              <p className="text-sm sm:text-base mt-2 text-center w-[90%]">
                {feedback.consequence}
              </p>
            </div>
          )}

          {/* Do this instead */}
          {(feedback?.doThisInstead ?? "") && (
            <>
              <div className="h-0.5 bg-[#2e0f53] w-[90%] mt-3 mb-3" />
              <div className="flex flex-col bg-gray-200 rounded-2xl w-[90%] overflow-hidden">
                <div className="bg-[#008243] w-full h-[32px] sm:h-[35px] flex gap-2 items-center pl-3">
                  <img src={plusImage} alt="plus" className="w-[7%] max-w-[32px]" />
                  <h1 className="text-sm sm:text-lg font-semibold text-white text-left">
                    Do this instead:
                  </h1>
                </div>
                <p className="text-xs sm:text-[13px] m-2">{feedback.doThisInstead}</p>
              </div>
            </>
          )}

          {/* Fact */}
          {(feedback?.fact ?? "") && (
            <div className="bg-red-200 w-[80%] sm:w-[60%] flex items-center rounded-xl border border-black mt-3 p-2 gap-2">
              <img src={statsimage} alt="stats" className="w-[14%] max-w-[40px]" />
              <p className="text-xs sm:text-[13px]">Fact: {feedback.fact}</p>
            </div>
          )}

          {/* Button */}
          <button
            className="bg-[#9d51fb] text-white px-4 py-3 sm:py-4 rounded-2xl mt-5 mb-5 flex items-center justify-center gap-2 text-base sm:text-lg"
            onClick={onContinue}
          >
            Next Question <FaLongArrowAltRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncorrectPopup;
