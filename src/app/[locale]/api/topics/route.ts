import { getTopics } from '@/data/topics'
import { getLocale } from 'next-intl/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const locale = await getLocale()
    const topicsData = await getTopics({ locale })

    const simplifiedTopics = topicsData.map((topic) => ({
      id: topic.id,
      name: topic.name,
      icon: topic.icon,
      kidsMode: !!topic.kidsMode
    }))

    return NextResponse.json(simplifiedTopics)
  } catch (error: unknown) {
    console.error('Error fetching topics:', error)

    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    )
  }
}
