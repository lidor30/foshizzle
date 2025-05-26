import { TopicMetadata } from '@/types/questions'
import { getTranslations } from 'next-intl/server'

const mathIconFileName = 'math.png'
const globeIconFileName = 'globe.png'
const championsIconFileName = 'champions.png'
const europaIconFileName = 'europa.png'
const worldCupIconFileName = 'world-cup.png'
const nbaIconFileName = 'nba.png'

export const getTopics = async (): Promise<TopicMetadata[]> => {
  const t = await getTranslations('Topics')

  return [
    {
      id: 'flags',
      name: t('flags'),
      icon: globeIconFileName,
      kidsMode: true
    },
    {
      id: 'math',
      name: t('math'),
      icon: mathIconFileName,
      kidsMode: true
    },
    {
      id: 'uefa',
      name: 'UEFA Champions League',
      icon: championsIconFileName
    },
    {
      id: 'europa',
      name: 'UEFA Europa League',
      icon: europaIconFileName
    },
    {
      id: 'fifa',
      name: 'FIFA World Cup',
      icon: worldCupIconFileName
    },
    {
      id: 'nba',
      name: 'NBA',
      icon: nbaIconFileName
    }
  ]
}
