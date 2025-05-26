import {
  DifficultyLevel,
  NBAData,
  QuestionItem,
  QuestionType
} from '@/types/questions'
import { Locale } from 'next-intl'
import nbaData from '../sports/nba.json'
import {
  createFlashcardQuestion,
  createMultipleChoiceQuestion,
  getDifficultyLevels,
  getRandomTeams,
  shouldIncludeQuestionType
} from './utils'

export const generateNBAQuestions = (
  locale?: Locale,
  difficulty?: DifficultyLevel,
  type?: QuestionType
): QuestionItem[] => {
  // Determine which difficulties to include
  const includeDifficulties = getDifficultyLevels(difficulty)

  // Generate only the questions that match both difficulty and type criteria
  return (nbaData as NBAData[]).flatMap((item) => {
    const nbaItem = item as NBAData
    const itemQuestions: QuestionItem[] = []

    // Easy difficulty, multiple choice question
    if (
      includeDifficulties.includes('easy') &&
      shouldIncludeQuestionType(type, 'multiple_choice')
    ) {
      const randomTeams = getRandomTeams(
        2,
        [nbaItem.winner, nbaItem.runnerUp],
        nbaData as NBAData[],
        nbaItem.year,
        'year'
      )

      const options = [
        { text: nbaItem.winner },
        { text: nbaItem.runnerUp },
        ...randomTeams.map((team) => ({ text: team }))
      ].sort(() => Math.random() - 0.5)

      itemQuestions.push(
        createMultipleChoiceQuestion(
          `nba-winner-${nbaItem.year}`,
          `Which team won the NBA Championship in ${nbaItem.year}?`,
          nbaItem.winner,
          options,
          'easy'
        )
      )
    }

    // Easy difficulty, flashcard question
    if (
      includeDifficulties.includes('easy') &&
      shouldIncludeQuestionType(type, 'flashcard')
    ) {
      itemQuestions.push(
        createFlashcardQuestion(
          `nba-${nbaItem.year}`,
          `Which team won the NBA Championship in ${nbaItem.year}?`,
          nbaItem.winner,
          'easy'
        )
      )
    }

    // Medium difficulty, multiple choice question
    if (
      includeDifficulties.includes('medium') &&
      shouldIncludeQuestionType(type, 'multiple_choice')
    ) {
      const randomTeams = getRandomTeams(
        2,
        [nbaItem.winner, nbaItem.runnerUp],
        nbaData as NBAData[],
        nbaItem.year,
        'year'
      )

      const options = [
        { text: nbaItem.runnerUp },
        { text: nbaItem.winner },
        ...randomTeams.map((team) => ({ text: team }))
      ].sort(() => Math.random() - 0.5)

      itemQuestions.push(
        createMultipleChoiceQuestion(
          `nba-runnerup-${nbaItem.year}`,
          `Which team was the runner-up in the ${nbaItem.year} NBA Finals?`,
          nbaItem.runnerUp,
          options,
          'medium'
        )
      )
    }

    return itemQuestions
  })
}
