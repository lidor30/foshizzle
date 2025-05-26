import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { generateFlagsFlashcards } from '../countries/flags'

const globeIconFileName = 'globe.png'

export const getFlagsTopic = async () => {
  const t = await getTranslations('Topics')

  return {
    id: 'flags',
    name: t('flags'),
    icon: globeIconFileName,
    data: [],
    generateQuestions: async (_data: any, params: any) => {
      const locale = params?.locale as Locale
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
    },
    kidsMode: true
  }
}
