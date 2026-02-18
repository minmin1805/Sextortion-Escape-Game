import React from "react";
import backgroundImage from "../src/assets/background/cosmicbackground.png";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


function Frame1() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/frame2");
  };
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-between py-10"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex-1 flex items-center justify-center px-4">
        <h1 className="text-white text-4xl font-bold text-center">
          Every day, hundreds of teens receive a threatening message...
        </h1>
      </div>
      <button onClick={handleContinue} className="bg-[#8B5CF6] text-white px-4 py-2 rounded-md absolute bottom-10 right-10 flex items-center gap-2">
        Continue <FaLongArrowAltRight />
      </button>
    </div>
  );
}

export default Frame1;
