import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";

function ContentWarningPage() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/frame1");
  };

  return (
    <div className="min-h-screen w-full bg-[#1a0a2e] flex flex-col items-center justify-center px-6 py-10">
      <div className="max-w-2xl w-full bg-[#2d1b4e]/80 rounded-2xl border-2 border-amber-500/50 p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl" aria-hidden>⚠️</span>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-400">
            Content Warning
          </h1>
        </div>
        <p className="text-white text-lg leading-relaxed mb-4">
          This experience deals with <strong className="text-amber-200">sensitive topics</strong> related to
          sextortion and online safety. Some content may include references to{" "}
          <strong className="text-amber-200">suicide, self-harm, or emotional distress</strong> that
          could be upsetting.
        </p>
        <p className="text-white text-base leading-relaxed mb-6">
          The material is presented for <strong>educational purposes</strong> to help young people
          recognize and respond to sextortion. Viewer discretion is advised. If you or someone you
          know is in crisis, please reach out to a trusted adult or a crisis helpline.
        </p>
        <button
          onClick={handleContinue}
          className="w-full sm:w-auto bg-[#8B5CF6] hover:bg-[#7c4ed4] text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          I understand, continue
          <FaLongArrowAltRight />
        </button>
      </div>
    </div>
  );
}

export default ContentWarningPage;
