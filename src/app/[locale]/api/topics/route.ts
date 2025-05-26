import { getTopics } from '@/data/topics'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const topics = await getTopics()

    return NextResponse.json(topics)
  } catch (error: unknown) {
    console.error('Error fetching topics:', error)

    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    )
  }
}
