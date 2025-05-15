import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { MultipleChoiceFlashcardItem } from "../data/topics";
import type { AnswerResult } from "../types";
interface MultipleChoiceQuestionProps {
  card: MultipleChoiceFlashcardItem;
  onAnswer: (result: AnswerResult) => void;
  icon?: string;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  card,
  onAnswer,
  icon,
}) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    const result: AnswerResult =
      option === card.answer ? "correct" : "incorrect";
    onAnswer(result);
  };

  return (
    <div className="w-full">
      {icon && (
        <div className="flex justify-center mb-4">
          <img
            src={icon}
            alt="Topic icon"
            className="w-16 h-16 object-contain dark-invert-workaround"
          />
        </div>
      )}

      <div className="text-center mb-4">
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {card.question}
        </p>
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {t("session.flashcard.choose_option")}
        </div>
        <div className="grid gap-3">
          {card.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              disabled={selectedOption !== null}
              className={`px-4 py-3 text-left rounded-md transition-colors text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                selectedOption === option
                  ? option === card.answer
                    ? "bg-green-50 dark:bg-green-900 border-green-500"
                    : "bg-red-50 dark:bg-red-900 border-red-500"
                  : ""
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
