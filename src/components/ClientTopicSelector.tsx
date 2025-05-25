'use client'

import { DifficultyLevel } from '@/types/questions'
import { useRouter } from 'next/navigation'
import TopicSelector from './TopicSelector'

export default function ClientTopicSelector() {
  const router = useRouter()

  const handleStartSession = (
    topicIds: string[],
    difficulty: DifficultyLevel
  ) => {
    sessionStorage.setItem('selectedTopicIds', JSON.stringify(topicIds))
    sessionStorage.setItem('selectedDifficulty', difficulty)

    router.push('/session')
  }

  return <TopicSelector onStartSession={handleStartSession} />
}
