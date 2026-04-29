import React from "react";
import clockImage from "../assets/GamePage/clockicon.png";

function ClockDisplay({ timeRemaining = 0 }) {
  return (
    <div className="bg-[#ddecff] rounded-2xl px-2 py-1 flex mt-3 sm:mt-6 max-h-[60px]">
      <div className="bg-[#6babff] flex items-center justify-center py-1 gap-2 px-3 rounded-2xl">
        <img src={clockImage} className="h-7 sm:h-9 md:h-9 lg:h-8" alt="clock" />
        <p className="text-base sm:text-lg md:text-lg lg:text-base font-bold">
          {timeRemaining} seconds
        </p>
      </div>
    </div>
  );
}

export default ClockDisplay
