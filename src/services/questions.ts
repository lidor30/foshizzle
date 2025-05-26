import { QuestionItem, TopicMetadata } from '@/types/questions'
import { Locale } from 'next-intl'

import { generateEuropaLeagueQuestions } from '@/data/generators/europa-league'
import { generateFifaWorldCupQuestions } from '@/data/generators/fifa-world-cup'
import { generateFlagsQuestions } from '@/data/generators/flags'
import { generateMathQuestions } from '@/data/generators/math'
import { generateNBAQuestions } from '@/data/generators/nba'
import { generateUEFAChampionsQuestions } from '@/data/generators/uefa-champions'

export async function generateQuestionsForTopic(
  topicId: string,
  locale: Locale
): Promise<QuestionItem[]> {
  switch (topicId) {
    case 'math':
      return generateMathQuestions()
    case 'flags':
      return generateFlagsQuestions({ locale })
    case 'uefa':
      return generateUEFAChampionsQuestions()
    case 'europa':
      return generateEuropaLeagueQuestions()
    case 'fifa':
      return generateFifaWorldCupQuestions()
    case 'nba':
      return generateNBAQuestions()
    default:
      throw new Error(`Unknown topic ID: ${topicId}`)
  }
}

export async function generateQuestions(
  topicIds: string[],
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  locale: Locale,
  topics: TopicMetadata[]
): Promise<QuestionItem[]> {
  const questionsArrays = await Promise.all(
    topicIds.map(async (topicId) => {
      const topic = topics.find((t) => t.id === topicId)
      if (!topic) return []

      const questions = await generateQuestionsForTopic(topicId, locale)

      return questions.map((question) => ({
        ...question,
        topicIcon: topic.icon
      }))
    })
  )

  let allQuestions = questionsArrays.flat()

  if (difficulty === 'easy') {
    allQuestions = allQuestions.filter((q) => q.difficulty === 'easy')
  } else if (difficulty === 'medium') {
    allQuestions = allQuestions.filter(
      (q) => q.difficulty === 'easy' || q.difficulty === 'medium'
    )
  }

  return allQuestions
}
