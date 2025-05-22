import { getTopics } from '@/data/topics';
import { getLocale } from 'next-intl/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { topicIds, difficulty = 'medium' } = await request.json();
    const locale = await getLocale();

    if (!topicIds || !Array.isArray(topicIds)) {
      return NextResponse.json(
        { error: 'Topic IDs are required and must be an array' },
        { status: 400 }
      );
    }

    const allTopics = await getTopics({ locale });

    const selectedTopics = allTopics.filter((topic) =>
      topicIds.includes(topic.id)
    );

    const topicsWithCards = await Promise.all(
      selectedTopics.map(async (topic) => {
        const cards = await topic.generateQuestions(topic.data);
        return cards.map((card) => ({
          ...card,
          topicIcon: topic.icon
        }));
      })
    );

    let allCards = topicsWithCards.flat();

    // Filter cards by difficulty
    if (difficulty === 'easy') {
      allCards = allCards.filter((card) => card.difficulty === 'easy');
    } else if (difficulty === 'medium') {
      allCards = allCards.filter(
        (card) => card.difficulty === 'easy' || card.difficulty === 'medium'
      );
    }

    return NextResponse.json(allCards);
  } catch (error: unknown) {
    console.error('Error generating flashcards:', error);

    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    );
  }
}
