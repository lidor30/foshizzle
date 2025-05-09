import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import TopicSelector from "../components/TopicSelector";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartSession = (selectedTopicIds: string[]) => {
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

      <main className="max-w-4xl mx-auto px-4 mt-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Foshizzle
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Test your knowledge with flashcards
          </p>
        </div>

        <TopicSelector onStartSession={handleStartSession} />
      </main>
    </div>
  );
};

export default HomePage;
