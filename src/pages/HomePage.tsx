import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import TopicSelector from "../components/TopicSelector";
import type { DifficultyLevel } from "../data/topics";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartSession = (
    selectedTopicIds: string[],
    difficulty: DifficultyLevel
  ) => {
    // Store selected difficulty in sessionStorage
    sessionStorage.setItem("selectedDifficulty", difficulty);

    // Store selected topics in sessionStorage
    sessionStorage.setItem(
      "selectedTopicIds",
      JSON.stringify(selectedTopicIds)
    );

    // Navigate to session page
    navigate("/session");
  };

  return (
    <div className="min-h-screen pb-10 pt-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 mt-4">
        <TopicSelector onStartSession={handleStartSession} />
      </main>
    </div>
  );
};

export default HomePage;
