import React from "react";
import { useGame } from "../../context/GameContext";
// Badge images – add more imports when you have assets for each tier
import safetyScholarBadgeImage from "../assets/EndgamePage/safetyscholarbadgeimage.png";
import safetyScholarTitleImage from "../assets/EndgamePage/safetyscholartitle.png";
import sextortionExpertBadgeImage from "../assets/EndgamePage/sextortionexpertbadgeimage.png";
import sextortionExpertTitleImage from "../assets/EndgamePage/sextortionexperttitleimage.png";
import learningDefenderBadgeImage from "../assets/EndgamePage/learningdefenderbadgeimage.png";
import learningDefenderTitleImage from "../assets/EndgamePage/learningdefendertitleimage.png";
// Only these 3 tiers – use score to pick badge (and thus image)
function getBadgeForScore(score) {
  if (score >= 8000) return "Sextortion Expert";
  if (score >= 5000) return "Safety Scholar";
  if (score >= 2500) return "Learning Defender";
  return "Learning Defender"; // below 2500 still shows lowest tier
}

// Map badge name → image(s). Only these 3.
const BADGE_IMAGES = {
  "Sextortion Expert": { badge: sextortionExpertBadgeImage, title: sextortionExpertTitleImage },
  "Safety Scholar": { badge: safetyScholarBadgeImage, title: safetyScholarTitleImage },
  "Learning Defender": { badge: learningDefenderBadgeImage, title: learningDefenderTitleImage },
};

export default function ScoreDisplay() {
  const { score, correctAnswers, totalScenarios } = useGame();
  const badge = getBadgeForScore(score ?? 0);
  const images = BADGE_IMAGES[badge] ?? BADGE_IMAGES["Learning Defender"];

  return (
    <div className="bg-[#ddecff] rounded-2xl p-5 flex flex-col items-center justify-center w-full h-[75%]">
      <div className="bg-white flex flex-col items-center justify-center overflow-hidden w-full h-full rounded-2xl">
        <div className="bg-[#e92727] w-full h-[50px] flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">YOUR SCORE</h1>
        </div>

        <h1 className="text-4xl mt-2">{score ?? 0} Points</h1>

        <div className="h-0.5 bg-[#2e0f53] w-[90%] mt-2 mb-2"></div>

        {images?.badge && (
          <img
            src={images.badge}
            alt={`${badge ?? "Badge"} badge`}
            className="w-[250px]"
          />
        )}

        <h2 className="text-3xl mt-2">
          Correct: {correctAnswers ?? 0}/{totalScenarios ?? 10}
        </h2>

        {images?.title && (
          <img
            src={images.title}
            alt={`${badge ?? "Badge"} title`}
            className="w-[300px] mt-4 mb-3"
          />
        )}
      </div>
    </div>
  );
}
