import React from "react";
import thiefImage from "../assets/GamePage/thiefimage.png";
import { LuMessageCircleMore } from "react-icons/lu";
import { IoSend } from "react-icons/io5";

function QuestionDisplay() {
  return (
    <div className="bg-[#ddecff] w-[50%] rounded-2xl flex flex-col justify-center items-center">
      <div className="mt-4 mb-4">
        <p className="text-center font-bold text-xl">
          Hi minmin, you just received a message!
        </p>
      </div>

      <div className="h-1 bg-[#2e0f53] w-full"></div>

      <div className="flex mt-8 items-center justify-center gap-4">
        <img src={thiefImage} className="h-17" />
        <div className="w-[50%]">
          {" "}
          <p className="bg-gray-200 px-5 py-3 rounded-2xl text-center text-xl">
            I have that photo you sent me. Send $100 by tonight or I'm posting
            it to everyone at your school
          </p>
        </div>
      </div>

      <div className="bg-white w-[95%] rounded-2xl flex flex-row justify-between items-center mt-10 py-2 mb-7">
        <p className="flex items-center justify-center ml-2 gap-2">
          {" "}
          <div className='border border-black rounded-2xl p-2'>
            {" "}
            <LuMessageCircleMore size={25}/>
          </div>
          Type a message...
        </p>

        <div className="rounded-2xl border border-black py-2 px-4 mr-4 bg-green-500">
          <IoSend color="white"/>
        </div>
      </div>
    </div>
  );
}

export default QuestionDisplay;
