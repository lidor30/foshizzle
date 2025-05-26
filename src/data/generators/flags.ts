import { DifficultyLevel, QuestionItem, QuestionType } from '@/types/questions'
import { Locale } from 'next-intl'
import { generateFlagsFlashcards } from '../countries/flags'
import { getDifficultyLevels } from './utils'

export const generateFlagsQuestions = async ({
  locale,
  difficulty,
  type
}: {
  locale: Locale
  difficulty?: DifficultyLevel
  type?: QuestionType
}): Promise<QuestionItem[]> => {
  // Get the base flashcards
  const allFlashcards = await generateFlagsFlashcards({ locale })

  // First, filter by difficulty
  const includeDifficulties = getDifficultyLevels(difficulty)
  const difficultyFiltered = allFlashcards.filter((q) =>
    includeDifficulties.includes(q.difficulty)
  )

  // Then filter by type if specified
  const typeFiltered = type
    ? difficultyFiltered.filter((q) => q.type === type)
    : difficultyFiltered

  // Finally, add metadata to the filtered questions
  return typeFiltered.map((card) => ({
    ...card,
    metadata: {
      ...(card.metadata || {}),
      kidsQuestion: true,
      enableTTS: true,
      isRTL: true
    }
  }))
}
