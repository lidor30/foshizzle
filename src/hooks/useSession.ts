'use client'

import { useStats } from '@/context/StatsContext'
import { DifficultyLevel, FlashcardItem } from '@/types/questions'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import type { AnswerResult } from '../types'

const DEFAULT_SESSION_SIZE = 20

export type SessionFlashcard = FlashcardItem & {
  topicIcon?: string
}

export const useSession = (
  selectedTopicIds: string[],
  difficulty: DifficultyLevel = 'medium'
) => {
  const params = useParams()
  const locale = params?.locale as string
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [sessionCards, setSessionCards] = useState<SessionFlashcard[]>([])
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLastCardAnswered, setIsLastCardAnswered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { updateCardStat } = useStats()

  const generateSession = useCallback(async () => {
    setIsLoading(true)
    try {
      const generateAllFlashcards = async (): Promise<SessionFlashcard[]> => {
        const response = await fetch(`/${locale}/api/questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            topicIds: selectedTopicIds,
            difficulty: difficulty
          })
        })

        if (!response.ok) {
          throw new Error('Failed to fetch flashcards')
        }

        return await response.json()
      }

      const sampleCards = (
        allCards: SessionFlashcard[],
        size: number
      ): SessionFlashcard[] => {
        const shuffled = [...allCards].sort(() => Math.random() - 0.5)
        const sampleSize = Math.min(size, shuffled.length)

        return shuffled.slice(0, sampleSize)
      }

      const allCards = await generateAllFlashcards()

      if (allCards.length === 0) {
        setSessionCards([])
        return
      }

      const sessionSize = Math.min(DEFAULT_SESSION_SIZE, allCards.length)
      const newSessionCards = sampleCards(allCards, sessionSize)

      setSessionCards(newSessionCards)
      setCurrentCardIndex(0)
      setIsFlipped(false)
      setIsLastCardAnswered(false)
    } catch (error) {
      console.error('Error generating session:', error)
      setSessionCards([])
    } finally {
      setIsLoading(false)
    }
  }, [selectedTopicIds, difficulty, locale])

  useEffect(() => {
    if (selectedTopicIds.length === 0) return

    generateSession()
  }, [selectedTopicIds, difficulty, generateSession])

  const nextCard = () => {
    if (currentCardIndex < sessionCards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1)
      setIsFlipped(false)
    }
  }

  const handleAnswer = (result: AnswerResult) => {
    const currentCard = sessionCards[currentCardIndex]
    updateCardStat(currentCard.id, result)

    if (currentCardIndex >= sessionCards.length - 1) {
      setIsLastCardAnswered(true)
    } else {
      nextCard()
    }
  }

  const flipCard = () => {
    setIsFlipped((prev) => !prev)
  }

  const isSessionComplete =
    currentCardIndex >= sessionCards.length - 1 && isLastCardAnswered

  const currentCard = sessionCards[currentCardIndex]

  return {
    currentCard,
    currentCardIndex,
    sessionCards,
    isFlipped,
    isSessionComplete,
    isLoading,
    flipCard,
    handleAnswer,
    generateSession,
    progress: {
      current: currentCardIndex + 1,
      total: sessionCards.length
    }
  }
}
