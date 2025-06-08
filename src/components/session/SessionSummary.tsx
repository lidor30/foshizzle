import { useKidsMode } from '@/context/KidsModeContext'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface SessionSummaryProps {
  correctAnswers: number
  totalQuestions: number
  onStartNewSession: () => void
  onReturnHome: () => void
}

// Sound generation utility functions
const createAudioContext = () => {
  if (typeof window !== 'undefined' && window.AudioContext) {
    return new AudioContext()
  }
  return null
}

const playScoreSound = () => {
  const audioContext = createAudioContext()
  if (!audioContext) return

  // Create a rising tone effect for score counting
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(
    400,
    audioContext.currentTime + 0.1
  )

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.1
  )

  oscillator.type = 'sine'
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.1)
}

const playStarSound = () => {
  const audioContext = createAudioContext()
  if (!audioContext) return

  // Create a magical "ding" sound for stars
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(
    1200,
    audioContext.currentTime + 0.05
  )
  oscillator.frequency.exponentialRampToValueAtTime(
    600,
    audioContext.currentTime + 0.2
  )

  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.3
  )

  oscillator.type = 'sine'
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.3)
}

const SessionSummary: React.FC<SessionSummaryProps> = ({
  correctAnswers,
  totalQuestions,
  onStartNewSession,
  onReturnHome
}) => {
  const t = useTranslations('SessionComplete')
  const { kidsMode } = useKidsMode()
  const [displayScore, setDisplayScore] = useState(0)
  const [visibleStars, setVisibleStars] = useState(0)

  // Calculate score: 60 base points + up to 40 points based on correct answers
  const baseScore = 60
  const bonusScore =
    totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 40) : 0
  const finalScore = baseScore + bonusScore

  // Determine number of stars based on score
  const getStarCount = (score: number) => {
    if (score < 60) return 1
    if (score < 80) return 2
    return 3
  }

  const starCount = getStarCount(finalScore)

  // Animate score counting up
  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 50
    const increment = finalScore / steps
    const stepDuration = duration / steps
    const soundInterval = 5 // Play sound every 5 steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep += 1
      setDisplayScore(Math.round(currentStep * increment))

      // Play score sound occasionally during counting (only in kids mode)
      if (kidsMode && currentStep % soundInterval === 0) {
        playScoreSound()
      }

      if (currentStep >= steps) {
        clearInterval(timer)
        setDisplayScore(finalScore)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [finalScore, kidsMode])

  // Animate stars appearing one by one after score animation
  useEffect(() => {
    const startDelay = 2500 // Start after score animation
    const starDelay = 500 // Delay between each star

    const timer = setTimeout(() => {
      const showStars = () => {
        for (let i = 1; i <= starCount; i++) {
          setTimeout(
            () => {
              setVisibleStars(i)
              // Play star sound when each star appears (only in kids mode)
              if (kidsMode) {
                playStarSound()
              }
            },
            (i - 1) * starDelay
          )
        }
      }
      showStars()
    }, startDelay)

    return () => clearTimeout(timer)
  }, [starCount, kidsMode])

  return (
    <div className="mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
      {/* Score Display */}
      <div className={`mb-8 ${kidsMode ? 'animate-float-medium' : ''}`}>
        <div
          className="text-9xl font-bold text-primary-600 mb-2"
          style={{
            fontFamily: kidsMode
              ? '"Comic Sans MS", "Comic Neue", cursive'
              : 'inherit'
          }}
        >
          {displayScore}
        </div>
      </div>

      {/* Stars Display */}
      <div className="flex justify-center gap-4 mb-8">
        {[1, 2, 3].map((starIndex) => (
          <div
            key={starIndex}
            className={`transition-all duration-500 transform ${
              starIndex <= visibleStars
                ? `scale-100 opacity-100 ${kidsMode ? 'animate-bounce' : ''}`
                : 'scale-0 opacity-0'
            }`}
            style={{
              animationDelay: kidsMode ? `${(starIndex - 1) * 0.2}s` : '0s'
            }}
          >
            <Image
              src="/images/star.png"
              alt="Star"
              width={120}
              height={120}
              className={`${
                starIndex <= visibleStars ? 'filter-none' : 'grayscale'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Title and Description */}
      {/* <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {t('title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {finalScore >= 80 && 'Outstanding performance! 🌟'}
          {finalScore >= 60 && finalScore < 80 && 'Great job! Keep it up! 👍'}
          {finalScore < 60 && 'Good effort! Practice makes perfect! 💪'}
        </p>
      </div> */}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onStartNewSession}
          className="w-full bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 
                   transition-colors font-medium"
        >
          {t('restartButton')}
        </button>

        <button
          onClick={onReturnHome}
          className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
                   transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 font-medium"
        >
          {t('homeButton')}
        </button>
      </div>
    </div>
  )
}

export default SessionSummary
