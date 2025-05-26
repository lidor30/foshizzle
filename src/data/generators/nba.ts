import {
  DifficultyLevel,
  FlashcardItem,
  MultipleChoiceQuestionItem,
  NBAData,
  QuestionItem,
  QuestionType
} from '@/types/questions'
import { Locale } from 'next-intl'
import nbaData from '../sports/nba.json'

const getRandomTeams = (
  count: number,
  excludeTeams: string[],
  data: NBAData[],
  currentYear: string
): string[] => {
  const allTeams = new Set<string>()

  data.forEach((item: NBAData) => {
    if (item.year !== currentYear) {
      allTeams.add(item.winner)
      allTeams.add(item.runnerUp)
    }
  })

  excludeTeams.forEach((team) => allTeams.delete(team))

  const availableTeams = Array.from(allTeams)
  const selectedTeams: string[] = []

  for (let i = 0; i < count && availableTeams.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableTeams.length)
    selectedTeams.push(availableTeams[randomIndex])
    availableTeams.splice(randomIndex, 1)
  }

  return selectedTeams
}

export const generateNBAQuestions = (
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
  return (nbaData as NBAData[]).flatMap((item) => {
    const nbaItem = item as NBAData
    const itemQuestions: QuestionItem[] = []

    // Easy difficulty, multiple choice question
    if (
      includeDifficulties.includes('easy') &&
      (!type || type === 'multiple_choice')
    ) {
      itemQuestions.push({
        id: `nba-winner-${nbaItem.year}`,
        question: {
          text: `Which team won the NBA Championship in ${nbaItem.year}?`
        },
        answer: {
          text: nbaItem.winner
        },
        difficulty: 'easy',
        type: 'multiple_choice',
        options: [
          {
            text: nbaItem.winner
          },
          {
            text: nbaItem.runnerUp
          },
          ...getRandomTeams(
            2,
            [nbaItem.winner, nbaItem.runnerUp],
            nbaData as NBAData[],
            nbaItem.year
          ).map((team) => ({
            text: team
          }))
        ].sort(() => Math.random() - 0.5)
      } as MultipleChoiceQuestionItem)
    }

    // Easy difficulty, flashcard question
    if (
      includeDifficulties.includes('easy') &&
      (!type || type === 'flashcard')
    ) {
      itemQuestions.push({
        id: `nba-${nbaItem.year}`,
        question: {
          text: `Which team won the NBA Championship in ${nbaItem.year}?`
        },
        answer: {
          text: nbaItem.winner
        },
        difficulty: 'easy',
        type: 'flashcard'
      } as FlashcardItem)
    }

    // Medium difficulty, multiple choice question
    if (
      includeDifficulties.includes('medium') &&
      (!type || type === 'multiple_choice')
    ) {
      itemQuestions.push({
        id: `nba-runnerup-${nbaItem.year}`,
        question: {
          text: `Which team was the runner-up in the ${nbaItem.year} NBA Finals?`
        },
        answer: {
          text: nbaItem.runnerUp
        },
        difficulty: 'medium',
        type: 'multiple_choice',
        options: [
          {
            text: nbaItem.runnerUp
          },
          {
            text: nbaItem.winner
          },
          ...getRandomTeams(
            2,
            [nbaItem.winner, nbaItem.runnerUp],
            nbaData as NBAData[],
            nbaItem.year
          ).map((team) => ({
            text: team
          }))
        ].sort(() => Math.random() - 0.5)
      } as MultipleChoiceQuestionItem)
    }

    return itemQuestions
  })
}
