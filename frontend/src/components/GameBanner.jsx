import React from "react";
import logo from "../assets/WelcomePage/logo.png";

function GameBanner({ currentScenarioIndex = 0, totalScenarios = 10, score = 0 }) {
  return (
    <div className="bg-[#020744] w-full h-14 sm:h-16 md:h-18 lg:h-20 flex items-center justify-between px-3 sm:px-6 md:px-10">
      <div className="flex items-center gap-2 sm:gap-3">
        <img src={logo} className="h-10 sm:h-12 md:h-14 lg:h-20 max-h-[95%]" alt="logo" />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-bold text-center">
          Question: {currentScenarioIndex + 1}/{totalScenarios}
        </p>
      </div>

      <div className="flex items-center justify-end">
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-bold mr-1 sm:mr-2 md:mr-4">
          Score: {score} pts
        </p>
      </div>
    </div>
  );
}

export default GameBanner
