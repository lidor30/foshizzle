'use client'

import { useKidsMode } from '@/context/KidsModeContext'
import { useEffect } from 'react'

export default function KidsModeStyles() {
  const { kidsMode } = useKidsMode()

  useEffect(() => {
    // Add/remove kids mode class on the body element
    if (kidsMode) {
      document.body.classList.add('kids-mode')
    } else {
      document.body.classList.remove('kids-mode')
    }

    return () => {
      document.body.classList.remove('kids-mode')
    }
  }, [kidsMode])

  if (!kidsMode) return null

  // These are decorative elements only shown in kids mode
  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-0 opacity-20 bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-200 dark:from-purple-900 dark:via-pink-800 dark:to-yellow-800" />

      <div className="fixed top-20 left-10 animate-float-slow pointer-events-none z-0 opacity-70">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 blur-md" />
      </div>

      <div className="fixed bottom-20 right-10 animate-float-medium pointer-events-none z-0 opacity-70">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 blur-md" />
      </div>

      <div className="fixed top-1/3 right-1/4 animate-float-fast pointer-events-none z-0 opacity-70">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-green-400 blur-md" />
      </div>

      <div className="fixed bottom-1/3 left-1/4 animate-spin-slow pointer-events-none z-0 opacity-70">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-400 to-blue-400 blur-md" />
      </div>
    </>
  )
}
