import { useEffect, useState } from "react";
import { useStats } from "../context/StatsContext";
import type { DifficultyLevel, FlashcardItem } from "../data/topics";
import { topics } from "../data/topics";
import type { AnswerResult } from "../types";

// Default number of cards in a session
const DEFAULT_SESSION_SIZE = 1;

// Extended flashcard that includes the icon
export interface SessionFlashcard extends FlashcardItem {
  topicIcon?: string;
}

export const useSession = (
  selectedTopicIds: string[],
  difficulty: DifficultyLevel = "medium"
) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionCards, setSessionCards] = useState<SessionFlashcard[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const { calculateWeight, updateCardStat } = useStats();

  // Generate a new session whenever selected topics or difficulty change
  useEffect(() => {
    if (selectedTopicIds.length === 0) return;

    generateSession();
  }, [selectedTopicIds, difficulty]);

  // Generate all possible flashcards from the selected topics
  const generateAllFlashcards = (): SessionFlashcard[] => {
    // Filter topics based on selected topic IDs
    const selectedTopics = topics.filter((topic) =>
      selectedTopicIds.includes(topic.id)
    );

    // Generate flashcards for each selected topic and flatten into a single array
    return selectedTopics.flatMap((topic) =>
      topic.generateFlashcards(topic.data).map((card) => ({
        ...card,
        topicIcon: topic.icon,
      }))
    );
  };

  // Create a weighted sample of cards for the session
  const sampleCards = (
    allCards: SessionFlashcard[],
    size: number
  ): SessionFlashcard[] => {
    // Filter cards by selected difficulty (include easier difficulties too)
    const filteredCards = allCards.filter((card) => {
      if (difficulty === "easy") return card.difficulty === "easy";
      if (difficulty === "medium")
        return card.difficulty === "easy" || card.difficulty === "medium";
      return true; // "hard" includes all difficulties
    });

    const cardsToSample = filteredCards.length > 0 ? filteredCards : allCards;

    const cardsWithWeights = cardsToSample.map((card) => ({
      card,
      weight: calculateWeight(card.id),
    }));

    const totalWeight = cardsWithWeights.reduce(
      (sum, item) => sum + item.weight,
      0
    );

    const sampledCards: SessionFlashcard[] = [];

    for (let i = 0; i < size; i++) {
      const randomValue = Math.random() * totalWeight;
      let cumulativeWeight = 0;

      for (const { card, weight } of cardsWithWeights) {
        cumulativeWeight += weight;

        if (randomValue <= cumulativeWeight) {
          sampledCards.push(card);
          break;
        }
      }
    }

    return sampledCards;
  };

  const generateSession = () => {
    const allCards = generateAllFlashcards();

    if (allCards.length === 0) {
      setSessionCards([]);
      return;
    }

    const sessionSize = Math.min(DEFAULT_SESSION_SIZE, allCards.length);
    const newSessionCards = sampleCards(allCards, sessionSize);

    setSessionCards(newSessionCards);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  // Move to the next card
  const nextCard = () => {
    if (currentCardIndex < sessionCards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const handleAnswer = (result: AnswerResult) => {
    const currentCard = sessionCards[currentCardIndex];
    updateCardStat(currentCard.id, result);
    nextCard();
  };

  const flipCard = () => {
    setIsFlipped((prev) => !prev);
  };

  const isSessionComplete =
    currentCardIndex >= sessionCards.length - 1 && isFlipped;

  const currentCard = sessionCards[currentCardIndex];

  return {
    currentCard,
    currentCardIndex,
    sessionCards,
    isFlipped,
    isSessionComplete,
    flipCard,
    handleAnswer,
    generateSession,
    progress: {
      current: currentCardIndex + 1,
      total: sessionCards.length,
    },
  };
};
