import React from "react";
import ChoiceBox from "../components/ChoiceBox";

const OPTION_COLORS = ["#E74C3C", "#F1C40F", "#3498DB", "#27AE60"];

function AnswersDisplay({ options = [], onSelectAnswer, disabled }) {
  return (
    <div className="flex flex-col justify-center items-center mt-5">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center">
        Your Decision
      </h1>

      {/* On very small screens, stack answers; use two columns on wider screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-10 gap-y-5 md:gap-y-7 mt-5 md:mt-7 w-full px-3 sm:px-0">
        {(options || []).map((opt, index) => (
          <ChoiceBox
            key={opt.id}
            color={OPTION_COLORS[index % OPTION_COLORS.length]}
            letter={opt.id}
            text={opt.text}
            onClick={disabled ? undefined : () => onSelectAnswer?.(opt.id, opt.text)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

export default AnswersDisplay
