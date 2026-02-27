import React from "react";
import clockImage from "../assets/GamePage/clockicon.png";

function ClockDisplay({ timeRemaining = 0 }) {
  return (
    <div className="bg-[#ddecff] rounded-2xl px-2 py-1 flex mt-3 sm:mt-6">
      <div className="bg-[#6babff] flex items-center justify-center py-1 gap-2 px-3 rounded-2xl">
        <img src={clockImage} className="h-7 sm:h-9 md:h-11" alt="clock" />
        <p className="text-base sm:text-lg md:text-2xl font-bold">
          {timeRemaining} seconds
        </p>
      </div>
    </div>
  );
}

export default ClockDisplay
