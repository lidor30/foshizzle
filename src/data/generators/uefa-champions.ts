import {
  ChampionsLeagueData,
  DifficultyLevel,
  QuestionItem,
  QuestionType
} from '@/types/questions'
import { Locale } from 'next-intl'
import uefaData from '../sports/uefa.json'
import {
  createFlashcardQuestion,
  createMultipleChoiceQuestion,
  getDifficultyLevels,
  getRandomTeams,
  shouldIncludeQuestionType
} from './utils'

export const generateUEFAChampionsQuestions = (
  locale?: Locale,
  difficulty?: DifficultyLevel,
  type?: QuestionType
): QuestionItem[] => {
  // Determine which difficulties to include
  const includeDifficulties = getDifficultyLevels(difficulty)

  // Generate only the questions that match both difficulty and type criteria
  return (uefaData as ChampionsLeagueData[]).flatMap((item) => {
    const championsItem = item as ChampionsLeagueData
    const itemQuestions: QuestionItem[] = []

    // Easy difficulty, multiple choice question
    if (
      includeDifficulties.includes('easy') &&
      shouldIncludeQuestionType(type, 'multiple_choice')
    ) {
      const randomTeams = getRandomTeams(
        2,
        [championsItem.winner, championsItem.runnerUp],
        uefaData as ChampionsLeagueData[],
        championsItem.season,
        'season'
      )

      const options = [
        { text: championsItem.winner },
        { text: championsItem.runnerUp },
        ...randomTeams.map((team) => ({ text: team }))
      ].sort(() => Math.random() - 0.5)

      itemQuestions.push(
        createMultipleChoiceQuestion(
          `uefa-winner-${championsItem.season}`,
          `Who won the UEFA Champions League in ${championsItem.season}?`,
          championsItem.winner,
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
          `uefa-final-${championsItem.season}`,
          `Which teams played in the ${championsItem.season} UEFA Champions League final and what was the score?`,
          `${championsItem.winner} vs ${championsItem.runnerUp}\n(${championsItem.score})`,
          'medium'
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
        [championsItem.winner, championsItem.runnerUp],
        uefaData as ChampionsLeagueData[],
        championsItem.season,
        'season'
      )

      const options = [
        { text: championsItem.runnerUp },
        { text: championsItem.winner },
        ...randomTeams.map((team) => ({ text: team }))
      ].sort(() => Math.random() - 0.5)

      itemQuestions.push(
        createMultipleChoiceQuestion(
          `uefa-runnerup-${championsItem.season}`,
          `Who was the runner-up in the ${championsItem.season} UEFA Champions League?`,
          championsItem.runnerUp,
          options,
          'medium'
        )
      )
    }

    return itemQuestions
  })
}
