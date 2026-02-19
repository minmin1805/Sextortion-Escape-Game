import React from "react";
import ChoiceBox from "../components/ChoiceBox";

const OPTION_COLORS = ["#E74C3C", "#F1C40F", "#3498DB", "#27AE60"];

function AnswersDisplay({ options = [], onSelectAnswer }) {
  return (
    <div className="flex flex-col justify-center items-center mt-5">
      <h1 className="text-4xl font-bold text-white">What should you do?</h1>

      <div className="grid grid-cols-2 gap-x-15 gap-y-7 mt-7">
        {(options || []).map((opt, index) => (
          <ChoiceBox
            key={opt.id}
            color={OPTION_COLORS[index % OPTION_COLORS.length]}
            letter={opt.id}
            text={opt.text}
            onClick={() => onSelectAnswer?.(opt.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default AnswersDisplay
