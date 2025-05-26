import {
  BasicFlashcardItem,
  EuropaLeagueData,
  TopicConfig
} from '@/types/questions'
import europaData from '../sports/europa.json'

const europaIconFileName = 'europa.png'

export const europaLeagueTopic: TopicConfig<EuropaLeagueData> = {
  id: 'europa',
  name: 'UEFA Europa League',
  icon: europaIconFileName,
  data: europaData as EuropaLeagueData[],
  generateQuestions: (data) =>
    data.flatMap((item) => {
      const europaItem = item
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
}
