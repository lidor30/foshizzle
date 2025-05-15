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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Reset selected option when the card changes
  useEffect(() => {
    setSelectedOption(null);
  }, [card.id]); // Reset when the card id changes

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    const result: AnswerResult =
      option === card.answer ? "correct" : "incorrect";
    onAnswer(result);
  };

  // Check if this is a flag question (has countryCode in metadata)
  const isFlag = card.metadata?.countryCode !== undefined;
  const flagUrl = card.metadata?.flagUrl as string | undefined;

  return (
    <div className="w-full">
      {icon && !isFlag && (
        <div className="flex justify-center mb-4">
          <img
            src={icon}
            alt="Topic icon"
            className="w-16 h-16 object-contain dark-invert-workaround"
          />
        </div>
      )}

      {/* Display flag if this is a flag question */}
      {isFlag && flagUrl && (
        <div className="flex justify-center mb-6">
          <img
            src={flagUrl}
            alt="Flag"
            className="w-64 h-auto border border-gray-300 shadow-md"
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
              key={`${card.id}-option-${index}`}
              onClick={() => handleOptionSelect(option)}
              disabled={selectedOption !== null}
              className={`px-4 py-3 text-left rtl:text-right rounded-md transition-colors text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 ${
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
