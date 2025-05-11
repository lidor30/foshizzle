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
        Select Topics
      </h2>

      <div className="space-y-3 mb-6">
        {topics.map((topic) => (
          <div key={topic.id} className="flex items-center">
            <input
              type="checkbox"
              id={`topic-${topic.id}`}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              checked={!!selectedTopics[topic.id]}
              onChange={() => toggleTopic(topic.id)}
            />
            <label
              htmlFor={`topic-${topic.id}`}
              className="ml-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {topic.icon && (
                <img
                  src={topic.icon}
                  alt={`${topic.name} icon`}
                  className="w-5 h-5 object-contain dark:invert"
                />
              )}
              {topic.name}
            </label>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-white">
          Select Difficulty
        </h3>
        <div className="flex gap-4">
          {[
            { value: "easy", label: "Easy" },
            { value: "medium", label: "Medium" },
            { value: "hard", label: "Hard" },
          ].map((difficulty) => (
            <div key={difficulty.value} className="flex items-center">
              <input
                type="radio"
                id={`difficulty-${difficulty.value}`}
                name="difficulty"
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                checked={selectedDifficulty === difficulty.value}
                onChange={() =>
                  setSelectedDifficulty(difficulty.value as DifficultyLevel)
                }
              />
              <label
                htmlFor={`difficulty-${difficulty.value}`}
                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {difficulty.label}
              </label>
            </div>
          ))}
        </div>
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
