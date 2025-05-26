import {
  DifficultyLevel,
  FIFAData,
  QuestionItem,
  QuestionType
} from '@/types/questions'
import { Locale } from 'next-intl'
import fifaData from '../sports/fifa.json'
import {
  createFlashcardQuestion,
  createMultipleChoiceQuestion,
  getDifficultyLevels,
  getRandomTeams,
  shouldIncludeQuestionType,
  shuffleArray
} from './utils'

// Special function for FIFA data to get random countries (hosts)
const getRandomCountries = (
  count: number,
  excludeCountries: string[],
  data: FIFAData[],
  currentYear: number
): string[] => {
  const allCountries = new Set<string>()

  // Collect all unique countries
  data.forEach((item: FIFAData) => {
    if (item.year !== currentYear) {
      allCountries.add(item.host)
    }
  })

  // Remove excluded countries
  excludeCountries.forEach((country) => allCountries.delete(country))

  // Convert to array and randomly select countries
  const availableCountries = Array.from(allCountries)
  const selectedCountries: string[] = []

  for (let i = 0; i < count && availableCountries.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableCountries.length)
    selectedCountries.push(availableCountries[randomIndex])
    availableCountries.splice(randomIndex, 1)
  }

  return selectedCountries
}

export const generateFifaWorldCupQuestions = (
  locale?: Locale,
  difficulty?: DifficultyLevel,
  type?: QuestionType
): QuestionItem[] => {
  // Determine which difficulties to include
  const includeDifficulties = getDifficultyLevels(difficulty)

  // Generate only the questions that match both difficulty and type criteria
  return (fifaData as FIFAData[]).flatMap((item) => {
    const fifaItem = item as FIFAData
    const itemQuestions: QuestionItem[] = []

    // Easy difficulty, multiple choice question
    if (
      includeDifficulties.includes('easy') &&
      shouldIncludeQuestionType(type, 'multiple_choice')
    ) {
      const randomTeams = getRandomTeams(
        2,
        [fifaItem.winner, fifaItem.runnerUp],
        fifaData as FIFAData[],
        fifaItem.year.toString(),
        'year'
      )

      const options = shuffleArray([
        { text: fifaItem.winner },
        { text: fifaItem.runnerUp },
        ...randomTeams.map((team) => ({ text: team }))
      ])

      itemQuestions.push(
        createMultipleChoiceQuestion(
          `fifa-winner-${fifaItem.year}`,
          `Who won the FIFA World Cup in ${fifaItem.year}?`,
          fifaItem.winner,
          options,
          'easy'
        )
      )
    }

    // Medium difficulty, flashcard question
    if (
      includeDifficulties.includes('medium') &&
      shouldIncludeQuestionType(type, 'flashcard')
    ) {
      itemQuestions.push(
        createFlashcardQuestion(
          `fifa-final-${fifaItem.year}`,
          `Which teams played in the ${fifaItem.year} FIFA World Cup final and what was the score?`,
          `${fifaItem.winner} vs ${fifaItem.runnerUp}\n(${fifaItem.score})`,
          'medium'
        )
      )
    }

    // Medium difficulty, multiple choice question for host country
    if (
      includeDifficulties.includes('medium') &&
      shouldIncludeQuestionType(type, 'multiple_choice')
    ) {
      const randomCountries = getRandomCountries(
        3,
        [fifaItem.host],
        fifaData as FIFAData[],
        fifaItem.year
      )

      const options = shuffleArray([
        { text: fifaItem.host },
        ...randomCountries.map((country) => ({ text: country }))
      ])

      itemQuestions.push(
        createMultipleChoiceQuestion(
          `fifa-host-${fifaItem.year}`,
          `Which country hosted the FIFA World Cup in ${fifaItem.year}?`,
          fifaItem.host,
          options,
          'medium'
        )
      )
    }

    return itemQuestions
  })
}
