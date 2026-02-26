import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";
import logo from "../src/assets/InstructionPage/logo.png";
import backgroundImage from "../src/assets/InstructionPage/background.png";
import lightbulbImage from "../src/assets/InstructionPage/lightbulb.png";
import alertImage from "../src/assets/InstructionPage/alert.png";
import gameruleImage from "../src/assets/InstructionPage/gamerule.png";
import correctImage from "../src/assets/InstructionPage/correct.png";

const cardStyle = {
  background: "linear-gradient(145deg, #f5f3ff 0%, #fce7f3 50%, #ede9fe 100%)",
};
const cardClass =
  "rounded-2xl p-6 shadow-xl border-2 border-white/30 min-h-[140px] flex flex-col";

function InstructionPage() {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/game");
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      
      {/* Background - cosmic dark purple */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 35%, #1a0a2e 100%)",
        }}
      />
      <div
        className="fixed inset-0 -z-10 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 90% 60% at 50% 0%, #8B5CF6 0%, transparent 55%)",
        }}
      />
      <div className="fixed inset-0 -z-10 opacity-40" aria-hidden>
        <div className="absolute top-[15%] left-[10%] w-1 h-1 rounded-full bg-white" />
        <div className="absolute top-[25%] right-[15%] w-1 h-1 rounded-full bg-white" />
        <div className="absolute top-[40%] left-[20%] w-0.5 h-0.5 rounded-full bg-white" />
        <div className="absolute top-[55%] right-[8%] w-1 h-1 rounded-full bg-white" />
        <div className="absolute top-[70%] left-[15%] w-0.5 h-0.5 rounded-full bg-white" />
        <div className="absolute top-[85%] right-[20%] w-1 h-1 rounded-full bg-white" />
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-12 pb-20">
        {/* Header: logo placeholder + title + subtitle */}
        <header className="text-center mb-10">
          <div className="flex justify-center items-center">
            {" "}
            <img src={logo} alt="" className="w-35 h-35 mx-auto" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Before You Play
          </h1>
          <p className="text-white text-2xl">
            Learn how to recognize sextortion and make safer choices under
            pressure.
          </p>
        </header>

        {/* Block 1 - Full width: What is sextortion? */}
        <section className={`${cardClass} mb-6`} style={cardStyle}>
          <div className="flex items-start gap-4">
            <div
              className="shrink-0 w-14 h-14 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center"
              aria-hidden
            >
              {/* Icon placeholder - replace with your image/icon */}
              <span className="text-[#7c3aed] text-xl font-bold">1</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold text-[#2d1b4e] mb-2 mt-2">
                What is sextortion?
              </h2>
              <p className="text-[#374151] leading-relaxed text-2xl">
                Sextortion is when someone threatens to share your private
                images unless you pay or send more photos. It is a crime. And if
                this happens, it is <strong>not your fault</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Block 2 - Full width: How does it happen? */}
        <section className={`${cardClass} mb-6`} style={cardStyle}>
          <div className="flex items-start gap-4">
            <div
              className="shrink-0 w-14 h-14 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center"
              aria-hidden
            >
              {/* Icon placeholder - replace with your image/icon */}
              <span className="text-[#7c3aed] text-xl font-bold">2</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold text-[#2d1b4e] mb-2 mt-2">
                How does it happen?
              </h2>
              <ul className="list-disc list-inside text-[#374151] space-y-1 text-2xl">
                <li>
                  Someone pretends to be your age on social media, dating, or
                  gaming apps
                </li>
                <li>
                  A &quot;romantic&quot; or friendly chat turning into threats
                </li>
                <li>Images stolen from hacked accounts</li>
                <li>Pressure to send a photo, then demands for money</li>
                <li>A fake profile screenshots everything</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Block 3 - Two columns: Why this is serious | What to do if it happens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <section className={cardClass} style={cardStyle}>
            <div className="flex items-start gap-3">
                {/* Icon placeholder - e.g. warning triangle */}
                <img src={alertImage} alt="" className="w-12 h-12" />
              <div className="flex-1 min-w-0 mt-2">
                <h2 className="text-3xl font-bold text-[#2d1b4e] mb-2">
                  Why this is serious
                </h2>
                <p className="text-[#374151] text-2xl leading-relaxed">
                  Sextortion causes real fear, stress, and shame.{" "}
                  <strong>
                    Paying or sending more images usually makes it worse.
                  </strong>{" "}
                  The only thing that actually helps is{" "}
                  <strong>getting support and reporting it</strong>.
                </p>
              </div>
            </div>
          </section>
          <section className={cardClass} style={cardStyle}>
            <div className="flex items-start gap-3">
                <img src={correctImage} alt="" className="w-12 h-12" />
              <div className="flex-1 min-w-0 mt-2">
                <h2 className="text-3xl font-bold text-[#2d1b4e] mb-2">
                  What to do if it happens
                </h2>
                <ul className="text-[#374151] text-2xl space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500 shrink-0">✓</span> Do NOT
                    pay
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500 shrink-0">✓</span> Do NOT
                    send more
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500 shrink-0">✓</span> Tell a
                    trusted adult (like a parent, counselor, or guardian)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500 shrink-0">✓</span> Block
                    and screenshot
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500 shrink-0">✓</span> Report
                    at: TakeitDown.org and NCMEC CyberTipline.org
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Block 4 - Two columns: How this game helps | GAME RULES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <section className={cardClass} style={cardStyle}>
            <div className="flex items-start gap-3">
              <img src={lightbulbImage} alt="" className="w-12 h-12" />
              <div className="flex-1 min-w-0 mt-2">
                <h2 className="text-3xl font-bold text-[#2d1b4e] mb-2">
                  How this game helps
                </h2>
                <p className="text-[#374151] text-2xl leading-relaxed">
                  You&apos;ll practice realistic sextortion scenarios under time
                  pressure. You&apos;ll make choices in{" "}
                  <strong>30 seconds</strong> — just like{" "}
                  <strong>real life</strong> — and learn safer responses through
                  instant feedback.
                </p>
              </div>
            </div>
          </section>
          <section className={cardClass} style={cardStyle}>
            <div className="flex items-start gap-3">
              <img src={gameruleImage} alt="" className="w-12 h-12" />
              <div className="flex-1 min-w-0 mt-2">
                <h2 className="text-3xl font-bold text-[#2d1b4e] mb-2">
                  GAME RULES
                </h2>
                <ul className="text-[#374151] text-2xl space-y-2">
                  <li>10 Scenarios</li>
                  <li>30 Seconds Each</li>
                  <li>1 Hint</li>
                  <li>2x Remove 2 Answers</li>
                  <li>Faster = More Points</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-14 pt-8 border-t-2 border-dashed border-white/30 text-center">
          <p className="text-white text-lg mb-6">
            Ready to test your instincts?
          </p>
          <button
            onClick={handleStartGame}
            className="inline-flex items-center justify-center gap-2 text-white font-bold text-xl py-4 px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
            style={{
              background:
                "linear-gradient(135deg, #8B5CF6 0%, #c084fc 50%, #e879f9 100%)",
            }}
          >
            Start Game
            <FaLongArrowAltRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstructionPage;
