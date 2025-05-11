import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Flashcard from "../components/Flashcard";
import Header from "../components/Header";
import SessionComplete from "../components/SessionComplete";
import SessionProgress from "../components/SessionProgress";
import { useSession } from "../hooks/useSession";

const SessionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);

  // Load selected topics from sessionStorage
  useEffect(() => {
    const storedTopics = sessionStorage.getItem("selectedTopicIds");

    if (!storedTopics) {
      // If no topics selected, redirect to home
      navigate("/");
      return;
    }

    setSelectedTopicIds(JSON.parse(storedTopics));
  }, [navigate]);

  const {
    currentCard,
    isFlipped,
    isSessionComplete,
    flipCard,
    handleAnswer,
    generateSession,
    progress,
  } = useSession(selectedTopicIds);

  const handleReturnHome = () => {
    navigate("/");
  };

  // Handle case when no topics are selected
  if (selectedTopicIds.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen pb-10 pt-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 mt-6">
        {isSessionComplete ? (
          <SessionComplete
            onStartNewSession={generateSession}
            onReturnHome={handleReturnHome}
          />
        ) : (
          <div className="max-w-md mx-auto">
            {currentCard && (
              <>
                <SessionProgress
                  current={progress.current}
                  total={progress.total}
                />

                <div className="my-6">
                  <Flashcard
                    card={currentCard}
                    isFlipped={isFlipped}
                    onFlip={flipCard}
                    onAnswer={handleAnswer}
                    icon={currentCard.topicIcon}
                  />
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
