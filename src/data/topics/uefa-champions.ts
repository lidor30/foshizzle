import {
  BasicFlashcardItem,
  ChampionsLeagueData,
  MultipleChoiceQuestionItem,
  TopicConfig
} from '@/types/questions'
import uefaData from '../sports/uefa.json'

const championsIconFileName = 'champions.png'

// Helper function to get random teams
const getRandomTeams = (
  count: number,
  excludeTeams: string[],
  data: ChampionsLeagueData[],
  currentYear: string
): string[] => {
  const teamsWithYears = data
    .map((item) => ({
      team: item.winner,
      year: item.season
    }))
    .filter(({ team }) => !excludeTeams.includes(team))

  teamsWithYears.sort((a, b) => {
    const yearA = parseInt(a.year.split('-')[0])
    const yearB = parseInt(b.year.split('-')[0])
    const targetYear = parseInt(currentYear.split('-')[0])

    return Math.abs(yearA - targetYear) - Math.abs(yearB - targetYear)
  })

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

// Helper function to get random stadiums
const getRandomStadiums = (
  count: number,
  excludeStadiums: string[],
  data: ChampionsLeagueData[],
  currentYear: string
): string[] => {
  const stadiumsWithYears = data
    .map((item) => ({
      stadium: `${item.location}\n(${item.stadium})`,
      year: item.season
    }))
    .filter(({ stadium }) => !excludeStadiums.includes(stadium))

  stadiumsWithYears.sort((a, b) => {
    const yearA = parseInt(a.year.split('-')[0])
    const yearB = parseInt(b.year.split('-')[0])
    const targetYear = parseInt(currentYear.split('-')[0])

    return Math.abs(yearA - targetYear) - Math.abs(yearB - targetYear)
  })

  const result: string[] = []
  const usedStadiums = new Set(excludeStadiums)

  for (const { stadium } of stadiumsWithYears) {
    if (!usedStadiums.has(stadium)) {
      result.push(stadium)
      usedStadiums.add(stadium)
      if (result.length >= count) break
    }
  }

  return result
}

export const uefaChampionsTopic: TopicConfig<ChampionsLeagueData> = {
  id: 'uefa',
  name: 'UEFA Champions League',
  icon: championsIconFileName,
  data: uefaData as ChampionsLeagueData[],
  generateQuestions: (data) =>
    data.flatMap((item) => {
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
              data,
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
          type: 'basic'
        } as BasicFlashcardItem,
        {
          id: `uefa-location-stadium-${championsItem.season}`,
          question: {
            text: `Where was the UEFA Champions League final in ${championsItem.season} held (city and stadium)?`
          },
          answer: {
            text: `${championsItem.location}\n(${championsItem.stadium})`
          },
          difficulty: 'hard',
          type: 'multiple_choice',
          options: [
            {
              text: `${championsItem.location}\n(${championsItem.stadium})`
            },
            ...getRandomStadiums(
              3,
              [`${championsItem.location}\n(${championsItem.stadium})`],
              data,
              championsItem.season
            ).map((stadium) => ({
              text: stadium
            }))
          ].sort(() => Math.random() - 0.5)
        } as MultipleChoiceQuestionItem
      ]
    })
}
