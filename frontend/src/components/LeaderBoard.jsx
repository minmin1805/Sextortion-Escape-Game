import React from "react";
import rankingImage from "../assets/LearderBoard/rankingimage.png";
import checkImage from "../assets/LearderBoard/checkimage.png";
import arrowImage from '../assets/LearderBoard/arrowimage.png';

function LeaderBoard({ leaderboardData = [] }) {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="bg-[#ddecff] rounded-2xl p-5 flex flex-col items-center justify-center w-[90%]">
        <div className="bg-white rounded-2xl flex flex-col w-full p-3">
          <div className="flex gap-3 items-center mb-5 border-b border-[#000000] pb-2">
            <img src={rankingImage} alt="ranking image" className="w-[5%]" />
            <h1 className="text-2xl font-bold">LEADERBOARD - ALL TIME</h1>
          </div>

          {leaderboardData.map((item, index) => (
            <div key={item.isCurrent ? "you" : `${item.name}-${item.score}-${index}`} className="flex flex-col gap-2">
              <div className="grid gap-8 items-center" style={{ gridTemplateColumns: "1.15fr 0.7fr 1.15fr" }}>
                <p className="text-xl">
                  {index + 1}. {item.isCurrent ? "YOU" : item.name}
                </p>
                <p className="text-xl text-right tabular-nums">
                  {item.score} Points
                </p>
                <p className="text-xl text-right">
                  {item.badge ?? item.level ?? ""}
                </p>
              </div>

              <div className="h-0.5 bg-[#2e0f53] w-full mt-2 mb-2"></div>
            </div>
          ))}
        </div>
      </div>

      <div className='flex items-center justify-center w-full mt-5 gap-1'>

        <div className='bg-[#ddecff] rounded-2xl p-2 w-[50%]'>
          <div className='bg-white rounded-2xl overflow-hidden w-full h-full'>
            <div className='bg-[#017407] w-full h-[40px] p-2'>
              <p className='text-white text-xl font-bold'>What You Have Learned</p>
            </div>
            <div className='flex flex-col p-2 gap-2'>
              <div className='flex items-center gap-2'>
                <img src={checkImage} alt="check image" className="w-[8%]" />
                <p>Never pay or send more money</p>
              </div>
              <div className='flex items-center gap-2'>
                <img src={checkImage} alt="check image" className="w-[8%]" />
                <p>Always tell trusted adult</p>
              </div>
              <div className='flex items-center gap-2'>
                <img src={checkImage} alt="check image" className="w-[8%]" />
                <p>Report to TakeItDown.org</p>
              </div>
              <div className='flex items-center gap-2'>
                <img src={checkImage} alt="check image" className="w-[8%]" />
                <p>90% of victims are males</p>
              </div>
              <div className='flex items-center gap-2'>
                <img src={checkImage} alt="check image" className="w-[8%]" />
                <p>45% post anyway after payment</p>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-[#ddecff] rounded-2xl p-2 w-[40%] h-full'>
          <div className='bg-white rounded-2xl overflow-hidden w-full h-full'>
            <div className='bg-[#e92727] w-full h-[40px] p-2'>
              <p className='text-white text-xl font-bold'>Emergency Help</p> 
            </div>
            <div className='flex items-center justify-center gap-2 p-2'>
              <img src={arrowImage} alt="arrow image" className="w-[8%]" />
              <p>Tell adult IMMEDIATELY</p>
            </div>
            <div className='flex items-center justify-center gap-2 p-2'>
              <img src={arrowImage} alt="arrow image" className="w-[8%]" />
              <p>TakeItDown.org</p>
            </div>
            <div className='flex items-center justify-center gap-2 p-2'>
              <img src={arrowImage} alt="arrow image" className="w-[8%]" />
              <p>1-800-THE-LOST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;
