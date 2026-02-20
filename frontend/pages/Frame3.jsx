import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../src/assets/background/backgroundwithphone.png";
import textoverlay from "../src/assets/Frame3/textoverlay2.png";
import { motion } from "motion/react";
import { FaLongArrowAltRight } from "react-icons/fa";

function Frame3() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/welcome");
  };

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col py-10 items-center justify-center"
    >
      <motion.img
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        src={textoverlay}
        alt="textoverlay"
        className=" absolute top-[53%] left-[53%] transform -translate-x-1/2 -translate-y-1/2 scale-90"
      />

      <motion.button
        onClick={() => {
          handleContinue();
        }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-10 right-10 bg-[#8B5CF6] text-white px-4 py-2 rounded-md flex items-center gap-2"
      >
        <FaLongArrowAltRight />
        Continue
      </motion.button>
    </div>
  );
}

export default Frame3;
