import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../src/assets/background/backgroundwithphone.png";
import textoverlay from "../src/assets/Frame3/textoverlay4.png";
import phoneSoundSrc from "../src/assets/Sound/phonesound.mp3";
import { motion } from "motion/react";
import { FaLongArrowAltRight } from "react-icons/fa";

const PHONE_SOUND_DELAY_MS = 1000;
const TEXT_OVERLAY_DELAY_S = 2.5;

function Frame3() {
  const navigate = useNavigate();

  useEffect(() => {
    const audio = new Audio(phoneSoundSrc);
    const t = setTimeout(() => {
      audio.volume = 0.7;
      audio.play().catch(() => {});
    }, PHONE_SOUND_DELAY_MS);
    return () => {
      clearTimeout(t);
      audio.pause();
    };
  }, []);

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
        transition={{ duration: 1, delay: TEXT_OVERLAY_DELAY_S }}
        src={textoverlay}
        alt="textoverlay"
        className="h-[35%] w-[35%] absolute top-[47%] left-[53%] transform -translate-x-1/2 -translate-y-1/2 scale-90"
      />

      <motion.button
        onClick={() => {
          handleContinue();
        }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: TEXT_OVERLAY_DELAY_S + 0.5 }}
        className="fixed bottom-4 right-3 bg-[#8B5CF6] text-white px-2 py-1 rounded-md flex items-center gap-2"
      >
        <FaLongArrowAltRight />
        Continue
      </motion.button>
    </div>
  );
}

export default Frame3;
