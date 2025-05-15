import React, { useEffect, useState } from "react";
import type { FlashcardItem } from "../data/topics";
import type { AnswerResult } from "../types";
import SpeakButton from "./SpeakButton";
import VoiceSelector from "./VoiceSelector";

interface FlashcardProps {
  card: FlashcardItem;
  isFlipped: boolean;
  onFlip: () => void;
  onAnswer: (result: AnswerResult) => void;
  icon?: string;
}

interface DelayedAnswer {
  answer: string;
  icon?: string;
}

const Flashcard: React.FC<FlashcardProps> = ({
  card,
  isFlipped,
  onFlip,
  onAnswer,
  icon,
}) => {
  const [delayedAnswer, setDelayedAnswer] = useState<DelayedAnswer | null>(
    null
  );

  useEffect(() => {
    if (card) {
      setTimeout(() => {
        console.log("delayedAnswer", {
          answer: card.answer,
          icon,
        });
        setDelayedAnswer({
          answer: card.answer,
          icon,
        });
      }, 500);
    }
  }, [card, icon]);

  return (
    <div
      className="w-full h-[60vh] cursor-pointer"
      onClick={!isFlipped ? onFlip : undefined}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 px-4 pt-2 ${
          isFlipped ? "card flipped" : "card"
        }`}
      >
        <div className="card-inner">
          {/* Front Side (Question) */}
          <div className="card-front bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg p-5 flex flex-col items-center justify-center relative">
            {icon && (
              <img
                src={icon}
                alt="Topic icon"
                className="w-16 h-16 object-contain mb-6 dark:invert"
              />
            )}
            <div className="text-center relative">
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {card.question}
              </p>
            </div>
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              Tap to reveal answer
            </div>

            <div className="absolute right-2 top-2 flex">
              <VoiceSelector />
              <SpeakButton text={card.question} />
            </div>
          </div>

          {/* Back Side (Answer) */}
          <div className="card-back bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center relative">
            {delayedAnswer && (
              <>
                {delayedAnswer.icon && (
                  <img
                    src={delayedAnswer.icon}
                    alt="Topic icon"
                    className="w-16 h-16 object-contain mb-6 dark:invert"
                  />
                )}
                <div className="text-center mb-6 relative">
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 font-semibold whitespace-pre-wrap">
                    {delayedAnswer.answer}
                  </p>
                </div>

                <div className="absolute right-2 top-2 flex">
                  <SpeakButton text={delayedAnswer.answer} />
                </div>
              </>
            )}

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
