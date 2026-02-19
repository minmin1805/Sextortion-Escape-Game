import React from 'react'

function ChoiceBox({ color, letter, text, onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      className="rounded-xl border-2 border-black overflow-hidden h-[80px] flex cursor-pointer hover:opacity-90"
    >
      {/* Left: letter square (full height, color) */}
      <div
        style={{ backgroundColor: color ?? '#ccc' }}
        className='w-18 h-[80px] flex items-center justify-center shrink-0 '
      >
        <span className='text-white text-3xl font-bold'>{letter}</span>
      </div>
      {/* Right: answer text (lavender, full height) */}
      <div className='flex-1 bg-[#E0E0FF] flex px-4 h-[80px] text-center justify-center items-center'>
        <p className='text-black text-[28px] font-bold'>{text}</p>
      </div>
    </div>
  )
}

export default ChoiceBox
