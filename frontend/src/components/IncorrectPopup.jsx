import React from "react";
import { IoClose } from "react-icons/io5";
import plusImage from "../assets/IncorrectPage/plusimage.png";
import { FaLongArrowAltRight } from "react-icons/fa";
import statsimage from '../assets/IncorrectPage/statsimage.png';

function IncorrectPopup({ toggleIncorrectPopup }) {
  return (
    <div className="fixed w-full h-full bg-black/80 flex flex-col items-center justify-center">
      <div className="bg-[#ddecff] h-auto w-1/3 p-2 rounded-2xl">
        <div className="flex flex-col bg-white w-full justify-center items-center rounded-2xl overflow-auto">
          <div className="bg-[#e92727] flex items-center w-full">
            <IoClose size={90} color="white" />
            <h1 className="text-4xl font-bold text-white">INCORRECT</h1>
          </div>

          <div className="flex flex-col items-center justify-center mt-2">
            <h1 className="text-4xl ">0 Points</h1>
          </div>

          <div className="h-0.5 bg-[#2e0f53] w-[90%] mt-2 mb-2"></div>

          <div className="flex flex-col items-center justify-center mt-2">
            <h1 className="text-3xl font-semibold">Paying won't stop them</h1>
            <p className="text-xl mt-2 text-center w-[85%]">
              They will demand more money and more photos. Paying proves you
              will comply
            </p>
          </div>

          <div className="h-0.5 bg-[#2e0f53] w-[90%] mt-2 mb-2"></div>

          <div className="flex flex-col items-center justify-center mt-2">
            <h1 className="text-3xl font-semibold">Consequences</h1>
            <p className="text-xl mt-2 text-center w-[85%]">
              Threats often continue and can escalate. You may lose both money
              and control.
            </p>
          </div>

          <div className="h-0.5 bg-[#2e0f53] w-[90%] mt-2 mb-2"></div>

          <div className="flex flex-col  bg-gray-200 overflow-auto rounded-2xl w-[90%]">
            <div className="bg-[#008243] w-full h-[35px] flex gap-2 items-center pl-3">
              <img src={plusImage} alt="plus image" className="w-[5%]" />
              <h1 className="text-lg font-semibold text-white text-left">
                Do this instead:
              </h1>
            </div>

            <p className="text-[13px] ml-2">
              Tell a trusted adult - this removes the shame blackmailers use to
              control you.
            </p>
          </div>

          <div className='bg-red-200 w-[60%] flex items-center rounded-xl border border-black mt-3 p-1 gap-2'>
            <img src={statsimage} alt="stats image" className="w-[12%]" />
            <p className="text-[13px]">Fact: 45% of perpetrators carry out threats even after payment</p>
          </div>

          <button className="bg-[#9d51fb] text-white px-4 py-6 rounded-2xl h-[30px] mt-5 mb-5 flex items-center justify-center gap-2" onClick={toggleIncorrectPopup}>Next Question <FaLongArrowAltRight /></button>
        </div>
      </div>
    </div>
  );
}

export default IncorrectPopup;
