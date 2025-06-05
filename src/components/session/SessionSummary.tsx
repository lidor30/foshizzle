import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface SessionSummaryProps {
  correctAnswers: number
  totalQuestions: number
  onStartNewSession: () => void
  onReturnHome: () => void
}

const SessionSummary: React.FC<SessionSummaryProps> = ({
  correctAnswers,
  totalQuestions,
  onStartNewSession,
  onReturnHome
}) => {
  const t = useTranslations('SessionComplete')
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

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep += 1
      setDisplayScore(Math.round(currentStep * increment))

      if (currentStep >= steps) {
        clearInterval(timer)
        setDisplayScore(finalScore)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [finalScore])

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
            },
            (i - 1) * starDelay
          )
        }
      }
      showStars()
    }, startDelay)

    return () => clearTimeout(timer)
  }, [starCount])

  return (
    <div className="mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
      {/* Score Display */}
      <div className="mb-8 animate-float-medium">
        <div
          className="text-9xl font-bold text-primary-600 mb-2"
          style={{ fontFamily: '"Comic Sans MS", "Comic Neue", cursive' }}
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
                ? 'scale-100 opacity-100 animate-bounce'
                : 'scale-0 opacity-0'
            }`}
            style={{
              animationDelay: `${(starIndex - 1) * 0.2}s`
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
