import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoShieldCheckmark, IoWarning, IoPeople, IoGameController } from "react-icons/io5";
import { HiLightBulb } from "react-icons/hi";
import { MdOutlineTipsAndUpdates } from "react-icons/md";

function InstructionPage() {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/game");
  };

  const sections = [
    {
      icon: IoShieldCheckmark,
      title: "What is sextortion?",
      content:
        "Sextortion is when someone threatens to share your private or sexual images or videos unless you do what they want—like sending more photos or paying money. It can happen to anyone, and teens are often targeted. It's a crime, and you're never to blame.",
    },
    {
      icon: IoPeople,
      title: "How it happens",
      content: "Someone online—often a stranger or a fake profile—gets you to send a photo or video, then uses it to blackmail you. Common setups include fake identities, dating or chat apps, gaming, or someone stealing an existing image. They may pretend to be a friend or romantic interest, then switch to threats.",
      bullets: [
        "Fake profiles and identities",
        "Dating or chat apps, gaming",
        "Stolen or hacked images",
        "Pretending to be a friend or romantic interest",
      ],
    },
    {
      icon: IoWarning,
      title: "Why it's serious",
      content:
        "Blackmail causes real fear, shame, and stress. Paying or sending more almost never makes it stop—it often gets worse. The way out is to get help: telling an adult and reporting can actually stop it and help you feel safe again.",
    },
    {
      icon: MdOutlineTipsAndUpdates,
      title: "What to do if it happens",
      content: "Don't pay and don't send more. Tell a trusted adult (parent, guardian, counselor). Block the person and don't delete messages—screenshots can help. Report to NCMEC CyberTipline or TakeItDown.ncmec.org so experts can help.",
      bullets: [
        "Don't pay and don't send more",
        "Tell a trusted adult",
        "Block them and keep evidence (screenshots)",
        "Report (CyberTipline, TakeItDown)",
      ],
    },
    {
      icon: HiLightBulb,
      title: "How this game helps",
      content:
        "You'll see realistic scenarios and choose what to do in 30 seconds. After each answer you'll get feedback on why some choices are safer and what to do in real life. Practicing here helps you react calmly and make safer choices if it ever happens.",
    },
    {
      icon: IoGameController,
      title: "How to play",
      content: "10 scenarios—mix of 'what would you do?' and quick facts. You have 30 seconds per question; faster correct answers earn more points. Use your lifelines: 1 Hint and 2× Remove 2 wrong answers. Wrong or time's up? You'll see feedback and move on—no game over.",
      bullets: [
        "10 scenarios, 30 seconds each",
        "1 Hint and 2× Remove 2 wrong answers",
        "More points for faster correct answers",
        "Feedback after every answer",
      ],
    },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 40%, #1a0a2e 100%)",
        }}
      />
      <div
        className="fixed inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #8B5CF6 0%, transparent 50%)",
        }}
      />

      <div className="max-w-2xl mx-auto px-5 py-12 pb-20">
        {/* Hero */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Before you play
          </h1>
          <p className="text-[#AFE2FF] text-lg">
            Learn about sextortion and how the game works
          </p>
        </header>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <section
                key={index}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#8B5CF6]" aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-[#2d1b4e] mb-2">
                      {section.title}
                    </h2>
                    <p className="text-[#374151] leading-relaxed mb-3">
                      {section.content}
                    </p>
                    {section.bullets && (
                      <ul className="list-disc list-inside text-[#374151] space-y-1 text-sm">
                        {section.bullets.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={handleStartGame}
            className="inline-flex items-center justify-center gap-2 bg-[#8B5CF6] hover:bg-[#7c4ed4] text-white font-bold text-xl py-4 px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
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
