'use client'

import { useKidsMode } from '@/context/KidsModeContext'

export default function KidsModeToggle() {
  const { kidsMode, toggleKidsMode } = useKidsMode()

  return (
    <button
      className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
        kidsMode
          ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white shadow-lg scale-105'
          : 'bg-gray-200 dark:bg-slate-700 text-slate-900 dark:text-white'
      }`}
      onClick={toggleKidsMode}
      aria-pressed={kidsMode}
    >
      <span
        className={`text-sm font-medium ${kidsMode ? 'animate-pulse' : ''}`}
      >
        {kidsMode ? 'Kids Mode' : 'Adult Mode'}
      </span>
      <div className="relative w-6 h-6">
        {kidsMode ? (
          <span role="img" aria-label="Kids mode" className="text-xl">
            🧒
          </span>
        ) : (
          <span role="img" aria-label="Adult mode" className="text-xl">
            👤
          </span>
        )}
      </div>
    </button>
  )
}
