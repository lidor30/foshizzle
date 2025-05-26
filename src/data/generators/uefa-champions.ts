import {
  ChampionsLeagueData,
  DifficultyLevel,
  FlashcardItem,
  MultipleChoiceQuestionItem,
  QuestionItem,
  QuestionType
} from '@/types/questions'
import { Locale } from 'next-intl'
import uefaData from '../sports/uefa.json'

const getRandomTeams = (
  count: number,
  excludeTeams: string[],
  data: ChampionsLeagueData[],
  currentSeason: string
): string[] => {
  const allTeams = new Set<string>()

  data.forEach((item: ChampionsLeagueData) => {
    if (item.season !== currentSeason) {
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

export const generateUEFAChampionsQuestions = (
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
  return (uefaData as ChampionsLeagueData[]).flatMap((item) => {
    const championsItem = item as ChampionsLeagueData
    const itemQuestions: QuestionItem[] = []

    // Easy difficulty, multiple choice question
    if (
      includeDifficulties.includes('easy') &&
      (!type || type === 'multiple_choice')
    ) {
      itemQuestions.push({
        id: `uefa-winner-${championsItem.season}`,
        question: {
          text: `Who won the UEFA Champions League in ${championsItem.season}?`
        },
        answer: {
          text: championsItem.winner
        },
        difficulty: 'easy',
        type: 'multiple_choice',
        options: [
          {
            text: championsItem.winner
          },
          {
            text: championsItem.runnerUp
          },
          ...getRandomTeams(
            2,
            [championsItem.winner, championsItem.runnerUp],
            uefaData as ChampionsLeagueData[],
            championsItem.season
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
        id: `uefa-final-${championsItem.season}`,
        question: {
          text: `Which teams played in the ${championsItem.season} UEFA Champions League final and what was the score?`
        },
        answer: {
          text: `${championsItem.winner} vs ${championsItem.runnerUp}\n(${championsItem.score})`
        },
        difficulty: 'medium',
        type: 'flashcard'
      } as FlashcardItem)
    }

    // Medium difficulty, multiple choice question
    if (
      includeDifficulties.includes('medium') &&
      (!type || type === 'multiple_choice')
    ) {
      itemQuestions.push({
        id: `uefa-runnerup-${championsItem.season}`,
        question: {
          text: `Who was the runner-up in the ${championsItem.season} UEFA Champions League?`
        },
        answer: {
          text: championsItem.runnerUp
        },
        difficulty: 'medium',
        type: 'multiple_choice',
        options: [
          {
            text: championsItem.runnerUp
          },
          {
            text: championsItem.winner
          },
          ...getRandomTeams(
            2,
            [championsItem.winner, championsItem.runnerUp],
            uefaData as ChampionsLeagueData[],
            championsItem.season
          ).map((team) => ({
            text: team
          }))
        ].sort(() => Math.random() - 0.5)
      } as MultipleChoiceQuestionItem)
    }

    return itemQuestions
  })
}
