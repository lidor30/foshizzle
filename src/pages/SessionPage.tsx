import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Flashcard from "../components/Flashcard";
import Header from "../components/Header";
import MultipleChoiceQuestion from "../components/MultipleChoiceQuestion";
import SessionComplete from "../components/SessionComplete";
import SessionProgress from "../components/SessionProgress";
import type {
  DifficultyLevel,
  FlashcardItem,
  MultipleChoiceQuestionItem,
} from "../data/topics";
import { useSession } from "../hooks/useSession";

const SessionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyLevel>("medium");

  // Load selected topics from sessionStorage
  useEffect(() => {
    const storedTopics = sessionStorage.getItem("selectedTopicIds");
    const storedDifficulty = sessionStorage.getItem(
      "selectedDifficulty"
    ) as DifficultyLevel | null;

    if (!storedTopics) {
      navigate("/");
      return;
    }

    setSelectedTopicIds(JSON.parse(storedTopics));

    if (storedDifficulty) {
      setSelectedDifficulty(storedDifficulty);
    }
  }, [navigate]);

  const {
    currentCard,
    isFlipped,
    isSessionComplete,
    isLoading,
    flipCard,
    handleAnswer,
    generateSession,
    progress,
  } = useSession(selectedTopicIds, selectedDifficulty);

  const handleReturnHome = () => {
    navigate("/");
  };

  // Handle case when no topics are selected
  if (selectedTopicIds.length === 0) {
    return <div>Loading...</div>;
  }

  // Color variants for different difficulty levels
  const difficultyColors = {
    easy: "bg-green-500",
    medium: "bg-yellow-500",
    hard: "bg-red-500",
  };

  return (
    <div className="min-h-screen pb-10 pt-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 mt-6">
        {isSessionComplete ? (
          <SessionComplete
            onStartNewSession={generateSession}
            onReturnHome={handleReturnHome}
          />
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Loading questions...
            </p>
          </div>
        ) : (
          <div className="mx-auto">
            {currentCard && (
              <>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <SessionProgress
                    current={progress.current}
                    total={progress.total}
                  />
                  <div
                    className={`text-xs px-2 py-1 rounded-full text-white capitalize ${difficultyColors[selectedDifficulty]}`}
                  >
                    {selectedDifficulty === "easy" && "Easy"}
                    {selectedDifficulty === "medium" && "Medium"}
                    {selectedDifficulty === "hard" && "Hard"}
                  </div>
                </div>

                <div className="my-6">
                  {"type" in currentCard &&
                  currentCard.type === "multiple_choice" ? (
                    <MultipleChoiceQuestion
                      card={currentCard as MultipleChoiceQuestionItem}
                      onAnswer={handleAnswer}
                      icon={currentCard.topicIcon}
                    />
                  ) : (
                    <Flashcard
                      card={currentCard as FlashcardItem}
                      isFlipped={isFlipped}
                      onFlip={flipCard}
                      onAnswer={handleAnswer}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SessionPage;
