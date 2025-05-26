import {
  FIFAData,
  FlashcardItem,
  MultipleChoiceQuestionItem,
  QuestionItem
} from '@/types/questions'
import fifaData from '../sports/fifa.json'

const getRandomTeams = (
  count: number,
  excludeTeams: string[],
  data: FIFAData[],
  currentYear: number
): string[] => {
  const teamsWithYears = data
    .map((item) => ({
      team: item.winner,
      year: item.year
    }))
    .filter(({ team }) => !excludeTeams.includes(team))

  teamsWithYears.sort(
    (a, b) => Math.abs(a.year - currentYear) - Math.abs(b.year - currentYear)
  )

  const result: string[] = []
  const usedTeams = new Set(excludeTeams)

  for (const { team } of teamsWithYears) {
    if (!usedTeams.has(team)) {
      result.push(team)
      usedTeams.add(team)
      if (result.length >= count) break
    }
  }

  return result
}

const getRandomCountries = (
  count: number,
  excludeCountries: string[],
  data: FIFAData[],
  currentYear: number
): string[] => {
  const hostsWithYears = data
    .map((item) => ({
      country: item.host,
      year: item.year
    }))
    .filter(({ country }) => !excludeCountries.includes(country))

  hostsWithYears.sort(
    (a, b) => Math.abs(a.year - currentYear) - Math.abs(b.year - currentYear)
  )

  const result: string[] = []
  const usedCountries = new Set(excludeCountries)

  for (const { country } of hostsWithYears) {
    if (!usedCountries.has(country)) {
      result.push(country)
      usedCountries.add(country)
      if (result.length >= count) break
    }
  }

  return result
}

export const generateFifaWorldCupQuestions = (): QuestionItem[] => {
  return fifaData.flatMap((item) => {
    const fifaItem = item as FIFAData
    return [
      {
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
            fifaData,
            fifaItem.year
          ).map((team) => ({
            text: team
          }))
        ].sort(() => Math.random() - 0.5)
      } as MultipleChoiceQuestionItem,
      {
        id: `fifa-final-${fifaItem.year}`,
        question: {
          text: `Which teams played in the ${fifaItem.year} FIFA World Cup final and what was the score?`
        },
        answer: {
          text: `${fifaItem.winner} vs ${fifaItem.runnerUp}\n(${fifaItem.score})`
        },
        difficulty: 'medium',
        type: 'flashcard'
      } as FlashcardItem,
      {
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
            fifaData,
            fifaItem.year
          ).map((country) => ({
            text: country
          }))
        ].sort(() => Math.random() - 0.5)
      } as MultipleChoiceQuestionItem
    ]
  })
}
