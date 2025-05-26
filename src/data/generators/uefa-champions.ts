import {
  ChampionsLeagueData,
  FlashcardItem,
  MultipleChoiceQuestionItem,
  QuestionItem
} from '@/types/questions'
import uefaData from '../sports/uefa.json'

const getRandomTeams = (
  count: number,
  exclude: string[],
  data: ChampionsLeagueData[],
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

export const generateUEFAChampionsQuestions = (): QuestionItem[] => {
  return uefaData.flatMap((item) => {
    const championsItem = item as ChampionsLeagueData
    return [
      {
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
            uefaData,
            championsItem.season
          ).map((team) => ({
            text: team
          }))
        ].sort(() => Math.random() - 0.5)
      } as MultipleChoiceQuestionItem,
      {
        id: `uefa-final-${championsItem.season}`,
        question: {
          text: `Which teams played in the ${championsItem.season} UEFA Champions League final and what was the score?`
        },
        answer: {
          text: `${championsItem.winner} vs ${championsItem.runnerUp}\n(${championsItem.score})`
        },
        difficulty: 'medium',
        type: 'flashcard'
      } as FlashcardItem,
      {
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
            uefaData,
            championsItem.season
          ).map((team) => ({
            text: team
          }))
        ].sort(() => Math.random() - 0.5)
      } as MultipleChoiceQuestionItem
    ]
  })
}
