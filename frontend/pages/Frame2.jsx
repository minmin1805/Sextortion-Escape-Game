import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../src/assets/background/cosmicbackground.png";
import { FaLongArrowAltRight } from "react-icons/fa";
import { AnimatedHighlightText } from "@/components/AnimatedHighlightText";

const LINE1 = "What would YOU do in 30 seconds?";
const LINE2 = "This is sextortion. You're about to learn how to ESCAPE it";

const LINE1_HIGHLIGHTS = [
  { word: "YOU", className: "text-yellow-400 font-bold" },
  { word: "30 seconds", className: "text-yellow-400 font-bold" },
];
const LINE2_HIGHLIGHTS = [
  { word: "sextortion", className: "text-red-400 font-bold" },
  { word: "ESCAPE", className: "text-[#a3dffd] font-bold" },
];

function Frame2() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/frame3");
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col py-10 items-center justify-center "
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-5 max-w-3xl px-4">
        <AnimatedHighlightText
          text={LINE1}
          highlights={LINE1_HIGHLIGHTS}
          className="text-white text-4xl font-bold text-center"
        />
        <AnimatedHighlightText
          text={LINE2}
          highlights={LINE2_HIGHLIGHTS}
          className="text-white text-4xl font-bold text-center"
        />
      </div>

      <button
        onClick={handleContinue}
        className="absolute bottom-10 right-10 bg-[#8B5CF6] text-white px-4 py-2 rounded-md flex items-center gap-2"
      >
        Continue <FaLongArrowAltRight />
      </button>
    </div>
  );
}

export default Frame2;
