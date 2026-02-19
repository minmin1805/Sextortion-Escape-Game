import React from "react";
import logo from "../assets/WelcomePage/logo.png";

function GameBanner({ currentScenarioIndex = 0, totalScenarios = 10, score = 0 }) {
  return (
    <div className="bg-[#020744] w-full h-20 flex justify-between items-center">
      <img src={logo} className="h-[95%] ml-10" alt="logo" />

      <div className="text-3xl text-white font-bold">
        <p>Question: {currentScenarioIndex + 1}/{totalScenarios}</p>
      </div>

      <div className="text-3xl text-white mr-10 font-bold">
        <p>Score: {score} pts</p>
      </div>
    </div>
  );
}

export default GameBanner
