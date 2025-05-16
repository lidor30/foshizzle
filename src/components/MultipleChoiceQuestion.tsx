import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { MultipleChoiceQuestionItem } from "../data/topics";
import type { AnswerResult } from "../types";

interface MultipleChoiceQuestionProps {
  card: MultipleChoiceQuestionItem;
  onAnswer: (result: AnswerResult) => void;
  icon?: string;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  card,
  onAnswer,
  icon,
}) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Reset selected option when the card changes
  useEffect(() => {
    setSelectedOption(null);
  }, [card.id]); // Reset when the card id changes

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    const result: AnswerResult =
      card.options[index].text === card.answer.text ? "correct" : "incorrect";
    onAnswer(result);
  };

  return (
    <div className="w-full">
      {/* Display topic icon if provided and question doesn't have an image */}
      {icon && !card.question.image && (
        <div className="flex justify-center mb-4">
          <img
            src={icon}
            alt="Topic icon"
            className="w-16 h-16 object-contain dark-invert-workaround"
          />
        </div>
      )}

      {/* Display question image if available */}
      {card.question.image && (
        <div className="flex justify-center mb-6">
          <img
            src={card.question.image}
            alt="Question image"
            className="w-64 h-auto border border-gray-300 shadow-md"
          />
        </div>
      )}

      <div className="text-center mb-4">
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {card.question.text}
        </p>
      </div>

      <div className="w-full max-w-lg mx-auto">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {t("session.flashcard.choose_option")}
        </div>
        <div className="grid gap-3">
          {card.options.map((option, index) => (
            <button
              key={`${card.id}-option-${index}`}
              onClick={() => handleOptionSelect(index)}
              disabled={selectedOption !== null}
              className={`px-4 py-3 text-left rtl:text-right rounded-md transition-colors text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                selectedOption === index
                  ? option.text === card.answer.text
                    ? "bg-green-50 dark:bg-green-900 border-green-500"
                    : "bg-red-50 dark:bg-red-900 border-red-500"
                  : ""
              }`}
            >
              {/* Display option image if available */}
              {option.image && (
                <div className="flex justify-center mb-2">
                  <img
                    src={option.image}
                    alt="Option"
                    className="w-24 h-auto"
                  />
                </div>
              )}
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
