import { BasicFlashcardItem, NBAData, TopicConfig } from '@/types/questions'
import nbaData from '../sports/nba.json'

const nbaIconFileName = 'nba.png'

export const nbaTopic: TopicConfig<NBAData> = {
  id: 'nba',
  name: 'NBA Champions',
  icon: nbaIconFileName,
  data: nbaData as NBAData[],
  generateQuestions: (data) =>
    data.map((item) => {
      return {
        id: `nba-${item.year}`,
        question: {
          text: `Which team won the NBA Championship in ${item.year}?`
        },
        answer: {
          text: item.winner
        },
        difficulty: 'easy',
        type: 'basic'
      } as BasicFlashcardItem
    })
}
