import {
  DifficultyLevel,
  FIFAData,
  FlashcardItem,
  MultipleChoiceQuestionItem,
  QuestionItem,
  QuestionType
} from '@/types/questions'
import { Locale } from 'next-intl'
import fifaData from '../sports/fifa.json'

const getRandomTeams = (
  count: number,
  excludeTeams: string[],
  data: FIFAData[],
  currentYear: number
): string[] => {
  const allTeams = new Set<string>()

  // Collect all unique teams
  data.forEach((item: FIFAData) => {
    if (item.year !== currentYear) {
      allTeams.add(item.winner)
      allTeams.add(item.runnerUp)
    }
  })

  // Remove excluded teams
  excludeTeams.forEach((team) => allTeams.delete(team))

  // Convert to array and randomly select teams
  const availableTeams = Array.from(allTeams)
  const selectedTeams: string[] = []

  for (let i = 0; i < count && availableTeams.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableTeams.length)
    selectedTeams.push(availableTeams[randomIndex])
    availableTeams.splice(randomIndex, 1)
  }

  return selectedTeams
}

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
  const includeDifficulties: DifficultyLevel[] = []
  if (!difficulty || difficulty === 'hard') {
    includeDifficulties.push('easy', 'medium', 'hard')
  } else if (difficulty === 'medium') {
    includeDifficulties.push('easy', 'medium')
  } else if (difficulty === 'easy') {
    includeDifficulties.push('easy')
  }

  // Generate only the questions that match both difficulty and type criteria
  return (fifaData as FIFAData[]).flatMap((item) => {
    const fifaItem = item as FIFAData
    const itemQuestions: QuestionItem[] = []

    // Easy difficulty, multiple choice question
    if (
      includeDifficulties.includes('easy') &&
      (!type || type === 'multiple_choice')
    ) {
      itemQuestions.push({
        id: `fifa-winner-${fifaItem.year}`,
        question: {
          text: `Who won the FIFA World Cup in ${fifaItem.year}?`
        },
        answer: {
          text: fifaItem.winner
        },
        difficulty: 'easy',
        type: 'multiple_choice',
        options: [
          {
            text: fifaItem.winner
          },
          {
            text: fifaItem.runnerUp
          },
          ...getRandomTeams(
            2,
            [fifaItem.winner, fifaItem.runnerUp],
            fifaData as FIFAData[],
            fifaItem.year
          ).map((team) => ({
            text: team
          }))
        ].sort(() => Math.random() - 0.5)
      } as MultipleChoiceQuestionItem)
    }

    // Medium difficulty, flashcard question
    if (
      includeDifficulties.includes('medium') &&
      (!type || type === 'flashcard')
    ) {
      itemQuestions.push({
        id: `fifa-final-${fifaItem.year}`,
        question: {
          text: `Which teams played in the ${fifaItem.year} FIFA World Cup final and what was the score?`
        },
        answer: {
          text: `${fifaItem.winner} vs ${fifaItem.runnerUp}\n(${fifaItem.score})`
        },
        difficulty: 'medium',
        type: 'flashcard'
      } as FlashcardItem)
    }

    if (
      includeDifficulties.includes('medium') &&
      (!type || type === 'multiple_choice')
    ) {
      itemQuestions.push({
        id: `fifa-host-${fifaItem.year}`,
        question: {
          text: `Which country hosted the FIFA World Cup in ${fifaItem.year}?`
        },
        answer: {
          text: fifaItem.host
        },
        difficulty: 'medium',
        type: 'multiple_choice',
        options: [
          {
            text: fifaItem.host
          },
          ...getRandomCountries(
            3,
            [fifaItem.host],
            fifaData as FIFAData[],
            fifaItem.year
          ).map((country) => ({
            text: country
          }))
        ].sort(() => Math.random() - 0.5)
      } as MultipleChoiceQuestionItem)
    }

    return itemQuestions
  })
}
