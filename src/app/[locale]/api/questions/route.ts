import { getTopics } from '@/data/topics'
import { generateQuestions } from '@/services/questions'
import { getLocale } from 'next-intl/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { topicIds, difficulty = 'medium' } = await request.json()
    const locale = await getLocale()

    if (!topicIds || !Array.isArray(topicIds)) {
      return NextResponse.json(
        { error: 'Topic IDs are required and must be an array' },
        { status: 400 }
      )
    }

    const topics = await getTopics()
    const selectedTopics = topics.filter((topic) => topicIds.includes(topic.id))
    const allCards = await generateQuestions(
      topicIds,
      difficulty,
      locale,
      selectedTopics
    )

    return NextResponse.json(allCards)
  } catch (error: unknown) {
    console.error('Error generating flashcards:', error)

    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    )
  }
}
