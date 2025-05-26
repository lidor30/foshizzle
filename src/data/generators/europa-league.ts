import {
  DifficultyLevel,
  EuropaLeagueData,
  FlashcardItem,
  MultipleChoiceQuestionItem,
  QuestionItem,
  QuestionType
} from '@/types/questions'
import { Locale } from 'next-intl'
import europaData from '../sports/europa.json'

const getRandomTeams = (
  count: number,
  excludeTeams: string[],
  data: EuropaLeagueData[],
  currentSeason: string
): string[] => {
  const allTeams = new Set<string>()

  data.forEach((item: EuropaLeagueData) => {
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

export const generateEuropaLeagueQuestions = (
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
  return (europaData as EuropaLeagueData[]).flatMap((item) => {
    const europaItem = item as EuropaLeagueData
    const itemQuestions: QuestionItem[] = []

    // Easy difficulty, multiple choice question
    if (
      includeDifficulties.includes('easy') &&
      (!type || type === 'multiple_choice')
    ) {
      itemQuestions.push({
        id: `europa-winner-${europaItem.season}`,
        question: {
          text: `Who won the UEFA Europa League in ${europaItem.season}?`
        },
        answer: {
          text: europaItem.winner
        },
        difficulty: 'easy',
        type: 'multiple_choice',
        options: [
          {
            text: europaItem.winner
          },
          {
            text: europaItem.runnerUp
          },
          ...getRandomTeams(
            2,
            [europaItem.winner, europaItem.runnerUp],
            europaData as EuropaLeagueData[],
            europaItem.season
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
        id: `europa-final-${europaItem.season}`,
        question: {
          text: `Which teams played in the ${europaItem.season} UEFA Europa League final and what was the score?`
        },
        answer: {
          text: `${europaItem.winner} vs ${europaItem.runnerUp}\n(${europaItem.score})`
        },
        difficulty: 'medium',
        type: 'flashcard'
      } as FlashcardItem)
    }

    // Hard difficulty, flashcard question
    if (
      includeDifficulties.includes('hard') &&
      (!type || type === 'flashcard')
    ) {
      itemQuestions.push({
        id: `europa-location-stadium-${europaItem.season}`,
        question: {
          text: `Where was the UEFA Europa League final in ${europaItem.season} held (city and stadium)?`
        },
        answer: {
          text: `${europaItem.location}\n(${europaItem.stadium})`
        },
        difficulty: 'hard',
        type: 'flashcard'
      } as FlashcardItem)
    }

    // Medium difficulty, multiple choice question
    if (
      includeDifficulties.includes('medium') &&
      (!type || type === 'multiple_choice')
    ) {
      itemQuestions.push({
        id: `europa-runnerup-${europaItem.season}`,
        question: {
          text: `Who was the runner-up in the ${europaItem.season} UEFA Europa League?`
        },
        answer: {
          text: europaItem.runnerUp
        },
        difficulty: 'medium',
        type: 'multiple_choice',
        options: [
          {
            text: europaItem.runnerUp
          },
          {
            text: europaItem.winner
          },
          ...getRandomTeams(
            2,
            [europaItem.winner, europaItem.runnerUp],
            europaData as EuropaLeagueData[],
            europaItem.season
          ).map((team) => ({
            text: team
          }))
        ].sort(() => Math.random() - 0.5)
      } as MultipleChoiceQuestionItem)
    }

    return itemQuestions
  })
}
