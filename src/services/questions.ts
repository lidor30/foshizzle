import {
  DifficultyLevel,
  QuestionItem,
  QuestionType,
  TopicMetadata
} from '@/types/questions'
import { Locale } from 'next-intl'

import { generateEuropaLeagueQuestions } from '@/data/generators/europa-league'
import { generateFifaWorldCupQuestions } from '@/data/generators/fifa-world-cup'
import { generateFlagsQuestions } from '@/data/generators/flags'
import { generateMathQuestions } from '@/data/generators/math'
import { generateNBAQuestions } from '@/data/generators/nba'
import { generateUEFAChampionsQuestions } from '@/data/generators/uefa-champions'

export async function generateQuestionsForTopic(
  topicId: string,
  locale: Locale,
  difficulty?: DifficultyLevel,
  type?: QuestionType
): Promise<QuestionItem[]> {
  switch (topicId) {
    case 'math':
      return generateMathQuestions(locale, difficulty, type)
    case 'flags':
      return generateFlagsQuestions({ locale, difficulty, type })
    case 'uefa':
      return generateUEFAChampionsQuestions(locale, difficulty, type)
    case 'europa':
      return generateEuropaLeagueQuestions(locale, difficulty, type)
    case 'fifa':
      return generateFifaWorldCupQuestions(locale, difficulty, type)
    case 'nba':
      return generateNBAQuestions(locale, difficulty, type)
    default:
      throw new Error(`Unknown topic ID: ${topicId}`)
  }
}

export async function generateQuestions(
  topicIds: string[],
  difficulty: DifficultyLevel = 'medium',
  locale: Locale,
  topics: TopicMetadata[],
  type?: QuestionType
): Promise<QuestionItem[]> {
  const questionsArrays = await Promise.all(
    topicIds.map(async (topicId) => {
      const topic = topics.find((t) => t.id === topicId)
      if (!topic) return []

      const questions = await generateQuestionsForTopic(
        topicId,
        locale,
        difficulty,
        type
      )

      return questions.map((question) => ({
        ...question,
        topicIcon: topic.icon
      }))
    })
  )

  const allQuestions = questionsArrays.flat()

  return allQuestions
}
