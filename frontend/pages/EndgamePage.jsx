import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../src/assets/WelcomePage/logo.png";
import ScoreDisplay from "../src/components/ScoreDisplay";
import LeaderBoard from "../src/components/LeaderBoard";
import { IoMdDownload } from "react-icons/io";
import { useGame } from "../context/GameContext";
import { getLeaderboard } from "../src/services/playerService";
import checklistPdf from "../src/assets/PDF/pdfchecklist.pdf";

function getBadgeForScore(score) {
  if (score >= 8000) return "Sextortion Expert";
  if (score >= 5000) return "Safety Scholar";
  if (score >= 2500) return "Learning Defender";
  return "Learning Defender";
}

function EndgamePage() {
  const navigate = useNavigate();
  const { playerName, score, correctAnswers } = useGame();
  const badge = getBadgeForScore(score ?? 0);
  const [leaderboardList, setLeaderboardList] = useState([]);

  const handleDownloadChecklist = () => {
    try {
      const link = document.createElement("a");
      link.href = checklistPdf;
      // Use a friendly default filename; browser falls back to original if needed
      link.download = "sextortion_safety_checklist.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // As a fallback, open in a new tab so the browser can handle it
      window.open(checklistPdf, "_blank", "noopener,noreferrer");
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const top = await getLeaderboard(4);
        if (cancelled) return;

        const current = {
          name: playerName,
          score,
          correctAnswers,
          badge,
          isCurrent: true,
        };
        const byScore = (a, b) => b.score - a.score;
        const merged = [...top.map((p) => ({ ...p, isCurrent: false })), current]
          .sort(byScore)
          .slice(0, 5);
        setLeaderboardList(merged);
      } catch (error) {
        if (!cancelled) {
          setLeaderboardList([{
            name: playerName,
            score,
            correctAnswers,
            badge,
            isCurrent: true,
          }]);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [playerName, score, correctAnswers, badge]);


  return (
    <div className="flex flex-col min-h-screen w-full items-center relative">
      <style>{`
        .endgame-bg {
          background: linear-gradient(90deg, #FFFFFF, #E0ACFF, #A4A4FF);
          background-size: 300% 300%;
          animation: endgame-gradient 4s alternate infinite;
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          z-index: 0;
        }
        @keyframes endgame-gradient {
          0% { background-position: 0%; }
          100% { background-position: 100%; }
        }
      `}</style>
      <div className="endgame-bg" aria-hidden="true" />

      <div className="relative z-10 flex flex-col w-full items-center py-6 sm:py-8">
        {/* Logo – smaller on phones, aligned to top-left on larger screens */}
        <img
          src={logo}
          alt="logo"
          className="w-60 sm:w-44 lg:w-[300px] self-start ml-4 sm:ml-6 mb-4 sm:mb-6 "
        />

        {/* Main content: stack vertically on small screens, row on larger */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center w-full max-w-8xl px-4 sm:px-6 gap-6 lg:gap-10 mt-4 sm:mt-8">
          <div className="w-full lg:w-auto flex justify-center">
            <ScoreDisplay />
          </div>

          <div className="w-full lg:w-[55%]">
            <LeaderBoard leaderboardData={leaderboardList} />
          </div>
        </div>

        {/* Bottom buttons – stack on phone, row on wider screens */}
        <div className="flex flex-col sm:flex-row mt-8 sm:mt-10 gap-4 sm:gap-8 justify-center w-full px-4 sm:px-6 pb-8">
          <button
            type="button"
            className="bg-[#ddecff] text-blue-900 px-4 py-2 rounded-md text-lg sm:text-xl font-bold flex items-center justify-center gap-2"
            onClick={handleDownloadChecklist}
            title="Download Safety Checklist PDF"
          >
            <IoMdDownload /> Download Safety Checklist!
          </button>
          <button
            type="button"
            className="bg-[#ddecff] text-blue-900 px-4 py-2 rounded-md text-lg sm:text-xl font-bold"
            onClick={() => navigate("/welcome")}
          >
            Exit To Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndgamePage;
