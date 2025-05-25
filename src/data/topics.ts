import europaData from './sports/europa.json'
import fifaData from './sports/fifa.json'
import nbaData from './sports/nba.json'
import uefaData from './sports/uefa.json'

import {
  BasicFlashcardItem,
  ChampionsLeagueData,
  EuropaLeagueData,
  FIFAData,
  FlashcardItem,
  MultipleChoiceQuestionItem,
  NBAData,
  SportData
} from '@/types/questions'
import { Locale } from 'next-intl'
import { StaticImageData } from 'next/image'
import { generateFlagsFlashcards } from './countries/flags'

const championsIconFileName = 'champions.png'
const europaIconFileName = 'europa.png'
const globeIconFileName = 'globe.png'
const nbaIconFileName = 'nba.png'
const worldCupIconFileName = 'world-cup.png'

export interface TopicConfig<T extends SportData> {
  id: string
  name: string
  icon?: string | StaticImageData
  data: T[]
  generateQuestions: (data: T[]) => FlashcardItem[] | Promise<FlashcardItem[]>
  kidsMode?: boolean
}

// TODO: Should return only the topics without quesations
export const getTopics = async ({
  locale
}: {
  locale: Locale
}): Promise<TopicConfig<SportData>[]> => {
  return [
    {
      id: 'flags',
      name: 'World Flags',
      icon: globeIconFileName,
      data: [], // Data is loaded dynamically
      generateQuestions: async () => {
        return await generateFlagsFlashcards({ locale })
      },
      kidsMode: true // Mark as kid-friendly
    },
    {
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
                  uefaData,
                  championsItem.season
                ).map((stadium) => ({
                  text: stadium
                }))
              ].sort(() => Math.random() - 0.5)
            } as MultipleChoiceQuestionItem
          ]
        })
    },
    {
      id: 'europa',
      name: 'UEFA Europa League',
      icon: europaIconFileName,
      data: europaData as EuropaLeagueData[],
      generateQuestions: (data) =>
        data.flatMap((item) => {
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
              type: 'basic'
            } as BasicFlashcardItem,
            {
              id: `europa-final-${europaItem.season}`,
              question: {
                text: `Which teams played in the ${europaItem.season} UEFA Europa League final and what was the score?`
              },
              answer: {
                text: `${europaItem.winner} vs ${europaItem.runnerUp}\n(${europaItem.score})`
              },
              difficulty: 'medium',
              type: 'basic'
            } as BasicFlashcardItem,
            {
              id: `europa-location-stadium-${europaItem.season}`,
              question: {
                text: `Where was the UEFA Europa League final in ${europaItem.season} held (city and stadium)?`
              },
              answer: {
                text: `${europaItem.location}\n(${europaItem.stadium})`
              },
              difficulty: 'hard',
              type: 'basic'
            } as BasicFlashcardItem
          ]
        })
    },
    {
      id: 'fifa',
      name: 'FIFA World Cup',
      icon: worldCupIconFileName,
      data: fifaData as FIFAData[],
      generateQuestions: (data) => {
        return data.flatMap((item) => {
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
              type: 'basic'
            } as BasicFlashcardItem,
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
    },
    {
      id: 'nba',
      name: 'NBA Champions',
      icon: nbaIconFileName,
      data: nbaData as NBAData[],
      generateQuestions: (data) =>
        data.map((item) => {
          const nbaItem = item as NBAData
          return {
            id: `nba-${nbaItem.year}`,
            question: {
              text: `Which team won the NBA Championship in ${nbaItem.year}?`
            },
            answer: {
              text: nbaItem.winner
            },
            difficulty: 'easy',
            type: 'basic'
          } as BasicFlashcardItem
        })
    }
    // {
    //   id: "test",
    //   name: "Test",
    //   data: [{ id: 1 }, { id: 2 }, { id: 3 }] as TestData[],
    //   generateFlashcards: (data) =>
    //     data.map((item) => ({
    //       id: `test-${item}`,
    //       question: `מה הדגל של לבנון, מה הדגל של ספרד, מה הדגל של יפן, מה הדגל של אפגניסטן?`,
    //       answer: "42",
    //       difficulty: "easy",
    //     })),
    // },
  ]
}

const getRandomTeams = (
  count: number,
  excludeTeams: string[],
  data: SportData[],
  currentYear: string | number
): string[] => {
  const teamsWithYears = data
    .map((item: any) => ({
      team: item.winner,
      year: item.season || item.year
    }))
    .filter(({ team }) => !excludeTeams.includes(team))

  teamsWithYears.sort((a, b) => {
    const yearA =
      typeof a.year === 'string' ? parseInt(a.year.split('-')[0]) : a.year
    const yearB =
      typeof b.year === 'string' ? parseInt(b.year.split('-')[0]) : b.year
    const targetYear =
      typeof currentYear === 'string'
        ? parseInt(currentYear.split('-')[0])
        : currentYear

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

const getRandomStadiums = (
  count: number,
  excludeStadiums: string[],
  data: SportData[],
  currentYear: string | number
): string[] => {
  const stadiumsWithYears = data
    .map((item: any) => ({
      stadium: `${item.location}\n(${item.stadium})`,
      year: item.season || item.year
    }))
    .filter(({ stadium }) => !excludeStadiums.includes(stadium))

  stadiumsWithYears.sort((a, b) => {
    const yearA =
      typeof a.year === 'string' ? parseInt(a.year.split('-')[0]) : a.year
    const yearB =
      typeof b.year === 'string' ? parseInt(b.year.split('-')[0]) : b.year
    const targetYear =
      typeof currentYear === 'string'
        ? parseInt(currentYear.split('-')[0])
        : currentYear

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
