import { TopicConfig } from '@/types/questions'
import { Locale } from 'next-intl'
import { europaLeagueTopic } from './topics/europa-league'
import { fifaWorldCupTopic } from './topics/fifa-world-cup'
import { getFlagsTopic } from './topics/flags'
import { getMathTopic } from './topics/math'
import { nbaTopic } from './topics/nba'
import { uefaChampionsTopic } from './topics/uefa-champions'

export const getTopics = async ({
  locale
}: {
  locale: Locale
}): Promise<TopicConfig<any>[]> => {
  const mathTopic = await getMathTopic()

  const flagsTopic = await getFlagsTopic()
  const localizedFlagsTopic = {
    ...flagsTopic,
    generateQuestions: async () =>
      await flagsTopic.generateQuestions([], { locale })
  }

  return [
    localizedFlagsTopic,
    mathTopic,
    uefaChampionsTopic,
    europaLeagueTopic,
    fifaWorldCupTopic,
    nbaTopic
  ]
}
