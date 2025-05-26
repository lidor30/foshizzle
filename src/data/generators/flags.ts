import { DifficultyLevel, QuestionItem, QuestionType } from '@/types/questions'
import { Locale } from 'next-intl'
import { generateFlagsFlashcards } from '../countries/flags'

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

  // First, filter by difficulty if specified
  let difficultyFiltered = allFlashcards
  if (difficulty) {
    if (difficulty === 'easy') {
      difficultyFiltered = allFlashcards.filter((q) => q.difficulty === 'easy')
    } else if (difficulty === 'medium') {
      difficultyFiltered = allFlashcards.filter(
        (q) => q.difficulty === 'easy' || q.difficulty === 'medium'
      )
    }
    // For 'hard', keep all questions
  }

  // Then filter by type if specified
  let typeFiltered = difficultyFiltered
  if (type) {
    typeFiltered = difficultyFiltered.filter((q) => q.type === type)
  }

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
