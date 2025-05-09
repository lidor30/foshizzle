import React from "react";
import type { FlashcardItem } from "../data/topics";
import type { AnswerResult } from "../types";

interface FlashcardProps {
  card: FlashcardItem;
  isFlipped: boolean;
  onFlip: () => void;
  onAnswer: (result: AnswerResult) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({
  card,
  isFlipped,
  onFlip,
  onAnswer,
}) => {
  return (
    <div
      className="w-full h-64 cursor-pointer"
      onClick={!isFlipped ? onFlip : undefined}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 ${
          isFlipped ? "card flipped" : "card"
        }`}
      >
        <div className="card-inner">
          {/* Front Side (Question) */}
          <div className="card-front bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Question
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {card.question}
              </p>
            </div>
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              Tap to reveal answer
            </div>
          </div>

          {/* Back Side (Answer) */}
          <div className="card-back bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Answer
              </h3>
              <p className="text-gray-700 dark:text-gray-300 font-semibold">
                {card.answer}
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAnswer("incorrect");
                }}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Incorrect
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAnswer("correct");
                }}
                className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Correct
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
