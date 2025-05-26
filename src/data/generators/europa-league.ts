import {
  EuropaLeagueData,
  FlashcardItem,
  MultipleChoiceQuestionItem,
  QuestionItem
} from '@/types/questions'
import europaData from '../sports/europa.json'

const getRandomTeams = (
  count: number,
  exclude: string[],
  data: EuropaLeagueData[],
  targetSeason: string
): string[] => {
  const allTeams = data
    .filter((item) => item.season !== targetSeason)
    .flatMap((item) => [item.winner, item.runnerUp])
    .filter((team) => !exclude.includes(team))

  const uniqueTeams = Array.from(new Set(allTeams))
  const shuffled = [...uniqueTeams].sort(() => Math.random() - 0.5)

  return shuffled.slice(0, count)
}

export const generateEuropaLeagueQuestions = (): QuestionItem[] => {
  return europaData.flatMap((item) => {
    const europaItem = item as EuropaLeagueData
    return [
      {
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
            europaData,
            europaItem.season
          ).map((team) => ({
            text: team
          }))
        ].sort(() => Math.random() - 0.5)
      } as MultipleChoiceQuestionItem,
      {
        id: `europa-final-${europaItem.season}`,
        question: {
          text: `Which teams played in the ${europaItem.season} UEFA Europa League final and what was the score?`
        },
        answer: {
          text: `${europaItem.winner} vs ${europaItem.runnerUp}\n(${europaItem.score})`
        },
        difficulty: 'medium',
        type: 'flashcard'
      } as FlashcardItem,
      {
        id: `europa-location-stadium-${europaItem.season}`,
        question: {
          text: `Where was the UEFA Europa League final in ${europaItem.season} held (city and stadium)?`
        },
        answer: {
          text: `${europaItem.location}\n(${europaItem.stadium})`
        },
        difficulty: 'hard',
        type: 'flashcard'
      } as FlashcardItem,
      {
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
            europaData,
            europaItem.season
          ).map((team) => ({
            text: team
          }))
        ].sort(() => Math.random() - 0.5)
      } as MultipleChoiceQuestionItem
    ]
  })
}
