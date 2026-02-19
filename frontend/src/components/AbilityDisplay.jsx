import React, { useState } from "react";
import remove2Image from "../assets/GamePage/remove2.png";
import lightbulbImage from "../assets/GamePage/lightbulbicon.png";
import { useGame } from "../../context/GameContext";

function AbilityDisplay() {
  const { useHint, useRemoveTwo, hintUsed, removeTwoUsed, currentScenario } = useGame();
  const [showHintModal, setShowHintModal] = useState(false);

  const onHintClick = () => {
    const atLimit = useHint();
    if (atLimit !== false) {
      setShowHintModal(true);
    }
  };

  const hintText = currentScenario?.hint ?? "No hint for this scenario.";
  const hintDisabled = hintUsed >= 1;
  const removeTwoDisabled = removeTwoUsed >= 2;
  const removeTwoRemaining = Math.max(0, 2 - removeTwoUsed);

  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <p className="text-3xl text-white font-bold">Abilities</p>

      <button
        type="button"
        onClick={onHintClick}
        disabled={hintDisabled}
        className={`flex items-center justify-center rounded-2xl border border-black py-2 px-2 text-2xl font-bold gap-2 ${
          hintDisabled ? "bg-gray-300 cursor-not-allowed opacity-60" : "bg-amber-100 hover:opacity-90"
        }`}
      >
        <img src={lightbulbImage} className="h-10" alt="hint" />
        Hint (1)
      </button>

      <button
        type="button"
        onClick={() => useRemoveTwo()}
        disabled={removeTwoDisabled}
        className={`flex items-center justify-center rounded-2xl border border-black py-2 px-2 text-2xl font-bold gap-2 ${
          removeTwoDisabled ? "bg-gray-300 cursor-not-allowed opacity-60" : "bg-[#ddecff] hover:opacity-90"
        }`}
      >
        <img src={remove2Image} className="h-10" alt="remove 2" />
        Remove 2 ({removeTwoRemaining})
      </button>

      {showHintModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowHintModal(false)}>
          <div
            className="bg-[#ddecff] rounded-2xl border-2 border-black p-6 max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-3">
              <img src={lightbulbImage} className="h-8" alt="hint" />
              <h3 className="text-xl font-bold text-[#2e0f53]">Hint</h3>
            </div>
            <p className="text-black mb-4">{hintText}</p>
            <button
              type="button"
              onClick={() => setShowHintModal(false)}
              className="w-full bg-[#9d51fb] text-white py-2 rounded-xl font-bold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AbilityDisplay
