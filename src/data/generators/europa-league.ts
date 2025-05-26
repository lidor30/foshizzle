import {
  DifficultyLevel,
  EuropaLeagueData,
  QuestionItem,
  QuestionType
} from '@/types/questions'
import { Locale } from 'next-intl'
import europaData from '../sports/europa.json'
import {
  createFlashcardQuestion,
  createMultipleChoiceQuestion,
  getDifficultyLevels,
  getRandomTeams,
  shouldIncludeQuestionType
} from './utils'

export const generateEuropaLeagueQuestions = (
  locale?: Locale,
  difficulty?: DifficultyLevel,
  type?: QuestionType
): QuestionItem[] => {
  // Determine which difficulties to include
  const includeDifficulties = getDifficultyLevels(difficulty)

  // Generate only the questions that match both difficulty and type criteria
  return (europaData as EuropaLeagueData[]).flatMap((item) => {
    const europaItem = item as EuropaLeagueData
    const itemQuestions: QuestionItem[] = []

    // Easy difficulty, multiple choice question
    if (
      includeDifficulties.includes('easy') &&
      shouldIncludeQuestionType(type, 'multiple_choice')
    ) {
      const randomTeams = getRandomTeams(
        2,
        [europaItem.winner, europaItem.runnerUp],
        europaData as EuropaLeagueData[],
        europaItem.season,
        'season'
      )

      const options = [
        { text: europaItem.winner },
        { text: europaItem.runnerUp },
        ...randomTeams.map((team) => ({ text: team }))
      ].sort(() => Math.random() - 0.5)

      itemQuestions.push(
        createMultipleChoiceQuestion(
          `europa-winner-${europaItem.season}`,
          `Who won the UEFA Europa League in ${europaItem.season}?`,
          europaItem.winner,
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
          `europa-final-${europaItem.season}`,
          `Which teams played in the ${europaItem.season} UEFA Europa League final and what was the score?`,
          `${europaItem.winner} vs ${europaItem.runnerUp}\n(${europaItem.score})`,
          'medium'
        )
      )
    }

    // Hard difficulty, flashcard question
    if (
      includeDifficulties.includes('hard') &&
      shouldIncludeQuestionType(type, 'flashcard')
    ) {
      itemQuestions.push(
        createFlashcardQuestion(
          `europa-location-stadium-${europaItem.season}`,
          `Where was the UEFA Europa League final in ${europaItem.season} held (city and stadium)?`,
          `${europaItem.location}\n(${europaItem.stadium})`,
          'hard'
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
        [europaItem.winner, europaItem.runnerUp],
        europaData as EuropaLeagueData[],
        europaItem.season,
        'season'
      )

      const options = [
        { text: europaItem.runnerUp },
        { text: europaItem.winner },
        ...randomTeams.map((team) => ({ text: team }))
      ].sort(() => Math.random() - 0.5)

      itemQuestions.push(
        createMultipleChoiceQuestion(
          `europa-runnerup-${europaItem.season}`,
          `Who was the runner-up in the ${europaItem.season} UEFA Europa League?`,
          europaItem.runnerUp,
          options,
          'medium'
        )
      )
    }

    return itemQuestions
  })
}
