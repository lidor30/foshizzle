import {
  FlashcardItem,
  MultipleChoiceQuestionItem,
  NBAData,
  QuestionItem
} from '@/types/questions'
import nbaData from '../sports/nba.json'

const getRandomTeams = (
  count: number,
  exclude: string[],
  data: NBAData[],
  targetYear: string
): string[] => {
  const allTeams = data
    .filter((item) => item.year !== targetYear)
    .flatMap((item) => [item.winner, item.runnerUp])
    .filter((team) => !exclude.includes(team))

  const uniqueTeams = Array.from(new Set(allTeams))
  const shuffled = [...uniqueTeams].sort(() => Math.random() - 0.5)

  return shuffled.slice(0, count)
}

export const generateNBAQuestions = (): QuestionItem[] => {
  return nbaData.flatMap((item) => {
    const nbaItem = item as NBAData
    return [
      {
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
            nbaData,
            nbaItem.year
          ).map((team) => ({
            text: team
          }))
        ].sort(() => Math.random() - 0.5)
      } as MultipleChoiceQuestionItem,
      {
        id: `nba-${nbaItem.year}`,
        question: {
          text: `Which team won the NBA Championship in ${nbaItem.year}?`
        },
        answer: {
          text: nbaItem.winner
        },
        difficulty: 'easy',
        type: 'flashcard'
      } as FlashcardItem,
      {
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
            nbaData,
            nbaItem.year
          ).map((team) => ({
            text: team
          }))
        ].sort(() => Math.random() - 0.5)
      } as MultipleChoiceQuestionItem,
      {
        id: `nba-final-${nbaItem.year}`,
        question: {
          text: `Which teams played in the ${nbaItem.year} NBA Finals?`
        },
        answer: {
          text: `${nbaItem.winner} vs ${nbaItem.runnerUp}`
        },
        difficulty: 'medium',
        type: 'flashcard'
      } as FlashcardItem
    ]
  })
}
