import React from "react";
import safetyScholarBadgeImage from '../assets/EndgamePage/safetyscholarbadgeimage.png'
import safetyScholarTitle from '../assets/EndgamePage/safetyscholartitle.png'

export default function ScoreDisplay() {
  return (
    <div className="bg-[#ddecff] rounded-2xl p-5 flex flex-col items-center justify-center w-full h-[75%]">
      <div className="bg-white flex flex-col items-center justify-center overflow-hidden w-full h-full rounded-2xl">
        <div className="bg-[#e92727] w-full h-[50px] flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">YOUR SCORE</h1>
        </div>

        <h1 className="text-4xl mt-2">1000 Points</h1>

        <div className="h-0.5 bg-[#2e0f53] w-[90%] mt-2 mb-2"></div>

        <img
          src={safetyScholarBadgeImage}
          alt="safety scholar badge image"
          className="w-[50%]"
        />

        <h2 className="text-3xl mt-2">Correct: 7/10</h2>

        <img
          src={safetyScholarTitle}
          alt="safety scholar title"
          className="w-[50%] mt-4 mb-3"
        />
      </div>
    </div>
  );
}
