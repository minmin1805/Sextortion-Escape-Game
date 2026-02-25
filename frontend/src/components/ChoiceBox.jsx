import React from 'react'

function ChoiceBox({ color, letter, text, onClick, disabled }) {
  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => !disabled && (e.key === "Enter" || e.key === " ") && onClick?.()}
      className={`rounded-xl border-2 border-black overflow-hidden h-[90px] flex ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:opacity-90"}`}
    >
      {/* Left: letter square (full height, color) */}
      <div
        style={{ backgroundColor: color ?? '#ccc' }}
        className='w-18 h-[90px] flex items-center justify-center shrink-0 '
      >
        <span className='text-white text-3xl font-bold'>{letter}</span>
      </div>
      {/* Right: answer text (lavender, full height) */}
      <div className='flex-1 bg-[#E0E0FF] flex px-4 h-[90px] text-center justify-center items-center'>
        <p className='text-black text-[28px] font-bold'>{text}</p>
      </div>
    </div>
  )
}

export default ChoiceBox
