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
  const [showFeedback, setShowFeedback] = useState(false);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);

  // Reset selected option when the card changes
  useEffect(() => {
    setSelectedOption(null);
    setShowFeedback(false);
    setAnswerResult(null);
  }, [card.id]); // Reset when the card id changes

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);

    let result: AnswerResult;

    // If both option and answer have images, compare images
    if (card.options[index].image && card.answer.image) {
      result =
        card.options[index].image === card.answer.image
          ? "correct"
          : "incorrect";
    }
    // If both have text, compare text
    else if (card.options[index].text && card.answer.text) {
      result =
        card.options[index].text === card.answer.text ? "correct" : "incorrect";
    }
    // Fallback - compare both properties
    else {
      result =
        card.options[index].text === card.answer.text ||
        card.options[index].image === card.answer.image
          ? "correct"
          : "incorrect";
    }

    setAnswerResult(result);
    setShowFeedback(true);

    // Add a delay before moving to the next question
    setTimeout(() => {
      setShowFeedback(false);
      onAnswer(result);
    }, 1500); // 1.5 second delay
  };

  // Check if there are images in the options
  const hasImagesInOptions = card.options.some((option) => option.image);

  // Get the correct answer for display
  const getCorrectAnswer = () => {
    const correctOption = card.options.find(
      (option) =>
        (option.text && card.answer.text && option.text === card.answer.text) ||
        (option.image &&
          card.answer.image &&
          option.image === card.answer.image)
    );
    return correctOption?.text || "";
  };

  // Check if an option is the correct answer
  const isCorrectOption = (option: (typeof card.options)[0]) => {
    return (
      (option.text && card.answer.text && option.text === card.answer.text) ||
      (option.image && card.answer.image && option.image === card.answer.image)
    );
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
        <div className="flex justify-center mb-6 w-full h-40 md:h-52 md:landscape:h-64 lg:h-64">
          <img
            src={card.question.image}
            alt="Question image"
            className="h-full w-auto max-h-full object-contain border border-gray-300 shadow-md"
          />
        </div>
      )}

      <div className="text-center mb-4">
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {card.question.text}
        </p>
      </div>

      {/* Feedback message */}
      {showFeedback && answerResult && (
        <div
          className={`text-center mb-4 py-2 px-4 rounded-md ${
            answerResult === "correct"
              ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-100"
              : "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100"
          }`}
        >
          {answerResult === "correct" ? (
            t("session.feedback.correct", "Correct!")
          ) : (
            <div>
              <p>{t("session.feedback.incorrect", "Incorrect!")}</p>
              {card.answer.text && (
                <p className="mt-1 text-sm">
                  {t(
                    "session.feedback.correct_answer",
                    "The correct answer is: {{answer}}",
                    { answer: getCorrectAnswer() }
                  )}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="w-full max-w-lg md:landscape:max-w-3xl mx-auto">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {t("session.flashcard.choose_option")}
        </div>
        <div
          className={`grid ${
            hasImagesInOptions
              ? "grid-cols-2 md:landscape:grid-cols-2 gap-4 md:gap-6 md:landscape:gap-8"
              : "gap-3"
          }`}
        >
          {card.options.map((option, index) => {
            const isCorrect = isCorrectOption(option);
            const isSelected = selectedOption === index;

            // Determine button style based on selection and correctness
            let buttonStyle = "";
            if (selectedOption !== null) {
              if (isSelected) {
                // Selected option styling
                buttonStyle = isCorrect
                  ? "bg-green-50 dark:bg-green-900 border-green-500" // Correct answer selected
                  : "bg-red-50 dark:bg-red-900 border-red-500"; // Wrong answer selected
              } else if (isCorrect && answerResult === "incorrect") {
                // Highlight correct answer when user selected wrong answer
                buttonStyle =
                  "bg-green-50 dark:bg-green-900 border-green-500 border-2";
              }
            }

            return (
              <button
                key={`${card.id}-option-${index}`}
                onClick={() => handleOptionSelect(index)}
                disabled={selectedOption !== null}
                className={`px-4 py-3 ${
                  option.image
                    ? "flex flex-col items-center justify-center"
                    : "text-left rtl:text-right"
                } rounded-md transition-colors text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 ${buttonStyle}`}
              >
                {/* Display option image - make it larger if it's primarily an image-based option */}
                {option.image && (
                  <div
                    className={`flex justify-center ${
                      option.text ? "mb-2" : ""
                    } w-full ${
                      option.image
                        ? "h-32 md:h-40 md:landscape:h-40 lg:h-40"
                        : ""
                    }`}
                  >
                    <img
                      src={option.image}
                      alt="Option"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                {option.text && <span>{option.text}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
