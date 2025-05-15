import { useEffect, useState } from "react";
import { useStats } from "../context/StatsContext";
import type { DifficultyLevel, FlashcardItem } from "../data/topics";
import { topics } from "../data/topics";
import type { AnswerResult } from "../types";

// Default number of cards in a session
const DEFAULT_SESSION_SIZE = 20;

// Extended flashcard that includes the icon
export type SessionFlashcard = FlashcardItem & {
  topicIcon?: string;
};

export const useSession = (
  selectedTopicIds: string[],
  difficulty: DifficultyLevel = "medium"
) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionCards, setSessionCards] = useState<SessionFlashcard[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLastCardAnswered, setIsLastCardAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateCardStat } = useStats();

  // Generate a new session whenever selected topics or difficulty change
  useEffect(() => {
    if (selectedTopicIds.length === 0) return;

    generateSession();
  }, [selectedTopicIds, difficulty]);

  // Generate all possible flashcards from the selected topics
  const generateAllFlashcards = async (): Promise<SessionFlashcard[]> => {
    // Filter topics based on selected topic IDs
    const selectedTopics = topics.filter((topic) =>
      selectedTopicIds.includes(topic.id)
    );

    // Generate flashcards for each selected topic and flatten into a single array
    const topicsWithCards = await Promise.all(
      selectedTopics.map(async (topic) => {
        const cards = await topic.generateFlashcards(topic.data);
        return cards.map((card) => ({
          ...card,
          topicIcon: topic.icon,
        }));
      })
    );

    return topicsWithCards.flat();
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

    // Shuffle the cards to ensure randomness
    const shuffled = [...cardsToSample].sort(() => Math.random() - 0.5);

    // Take the minimum between requested size and available cards
    const sampleSize = Math.min(size, shuffled.length);

    // Return the first sampleSize cards from the shuffled array
    return shuffled.slice(0, sampleSize);
  };

  const generateSession = async () => {
    setIsLoading(true);
    try {
      const allCards = await generateAllFlashcards();

      if (allCards.length === 0) {
        setSessionCards([]);
        return;
      }

      const sessionSize = Math.min(DEFAULT_SESSION_SIZE, allCards.length);
      const newSessionCards = sampleCards(allCards, sessionSize);

      setSessionCards(newSessionCards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setIsLastCardAnswered(false);
    } catch (error) {
      console.error("Error generating session:", error);
      setSessionCards([]);
    } finally {
      setIsLoading(false);
    }
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

    if (currentCardIndex >= sessionCards.length - 1) {
      setIsLastCardAnswered(true);
    } else {
      nextCard();
    }
  };

  const flipCard = () => {
    setIsFlipped((prev) => !prev);
  };

  const isSessionComplete =
    currentCardIndex >= sessionCards.length - 1 && isLastCardAnswered;

  const currentCard = sessionCards[currentCardIndex];

  return {
    currentCard,
    currentCardIndex,
    sessionCards,
    isFlipped,
    isSessionComplete,
    isLoading,
    flipCard,
    handleAnswer,
    generateSession,
    progress: {
      current: currentCardIndex + 1,
      total: sessionCards.length,
    },
  };
};
