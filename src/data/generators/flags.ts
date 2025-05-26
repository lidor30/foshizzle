import { QuestionItem } from '@/types/questions'
import { Locale } from 'next-intl'
import { generateFlagsFlashcards } from '../countries/flags'

export const generateFlagsQuestions = async ({
  locale
}: {
  locale: Locale
}): Promise<QuestionItem[]> => {
  const flashcards = await generateFlagsFlashcards({ locale })

  return flashcards.map((card) => ({
    ...card,
    metadata: {
      ...(card.metadata || {}),
      kidsQuestion: true,
      enableTTS: true,
      isRTL: true
    }
  }))
}
