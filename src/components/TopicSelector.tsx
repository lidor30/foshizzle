import React, { useState } from "react";
import type { DifficultyLevel } from "../data/topics";
import { topics } from "../data/topics";

interface TopicSelectorProps {
  onStartSession: (
    selectedTopicIds: string[],
    difficulty: DifficultyLevel
  ) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ onStartSession }) => {
  const [selectedTopics, setSelectedTopics] = useState<{
    [id: string]: boolean;
  }>({});
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyLevel>("medium");

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const selectAll = () => {
    const allTopics = topics.reduce((acc, topic) => {
      acc[topic.id] = true;
      return acc;
    }, {} as { [id: string]: boolean });

    setSelectedTopics(allTopics);
  };

  const clearAll = () => {
    setSelectedTopics({});
  };

  const handleStartSession = () => {
    const selectedTopicIds = Object.entries(selectedTopics)
      .filter(([, isSelected]) => isSelected)
      .map(([id]) => id);

    if (selectedTopicIds.length === 0) {
      alert("Please select at least one topic");
      return;
    }

    onStartSession(selectedTopicIds, selectedDifficulty);
  };

  const selectedCount = Object.values(selectedTopics).filter(Boolean).length;

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Topics
      </h2>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => toggleTopic(topic.id)}
            className={`flex flex-col gap-3 items-center justify-start px-4 py-2 rounded-md transition-colors text-sm font-medium relative
              ${
                selectedTopics[topic.id]
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
          >
            {topic.icon && (
              <img
                src={topic.icon}
                alt={`${topic.name} icon`}
                className={`h-10 object-contain ${
                  selectedTopics[topic.id] ? "invert" : "dark:invert"
                }`}
              />
            )}
            <span className="text-xs">{topic.name}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between mb-6">
        <button
          type="button"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          onClick={selectAll}
        >
          Select All
        </button>
        <button
          type="button"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          onClick={clearAll}
        >
          Clear All
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-white">
          Difficulty
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "easy", label: "Easy" },
            { value: "medium", label: "Medium" },
            { value: "hard", label: "Hard" },
          ].map((difficulty) => (
            <button
              key={difficulty.value}
              onClick={() =>
                setSelectedDifficulty(difficulty.value as DifficultyLevel)
              }
              className={`px-4 py-2 rounded-md transition-colors text-sm font-medium
                ${
                  selectedDifficulty === difficulty.value
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
            >
              {difficulty.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleStartSession}
        disabled={selectedCount === 0}
      >
        Start Session ({selectedCount} topic{selectedCount !== 1 ? "s" : ""})
      </button>
    </div>
  );
};

export default TopicSelector;
