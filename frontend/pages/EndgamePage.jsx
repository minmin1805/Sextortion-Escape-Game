import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../src/assets/WelcomePage/logo.png";
import ScoreDisplay from "../src/components/ScoreDisplay";
import LeaderBoard from "../src/components/LeaderBoard";
import { IoMdDownload } from "react-icons/io";
import { useGame } from "../context/GameContext";
import { getLeaderboard } from "../src/services/playerService";

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
    <div className="flex flex-col h-screen min-w-screen items-center justify-center relative">
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
      <div className="relative z-10 flex flex-col w-full h-full items-center justify-center">
      <img src={logo} alt="logo" className="w-[300px] fixed top-5 left-5 z-10" />

      <div className="flex items-center justify-center w-[90%] gap-5 mt-20">
        <div>
          <ScoreDisplay />
        </div>

        <div className="w-[55%]">
          <LeaderBoard leaderboardData={leaderboardList} />
        </div>

        
      </div>

      <div className="flex mt-12 gap-40">
        <button
          type="button"
          className="bg-[#ddecff] text-blue-900 px-4 py-2 rounded-md text-xl font-bold flex items-center gap-2"
          onClick={() => {}}
          title="Download Safety Checklist (placeholder – add PDF link when ready)"
        >
          <IoMdDownload /> Download Safety Checklist!
        </button>
        <button
          type="button"
          className="bg-[#ddecff] text-blue-900 px-4 py-2 rounded-md text-xl font-bold"
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
