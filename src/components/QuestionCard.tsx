import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import type { MultipleChoiceFlashcardItem } from "../data/topics";
import type { AnswerResult } from "../types";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import VoiceSelector from "./VoiceSelector";

interface QuestionCardProps {
  card: MultipleChoiceFlashcardItem;
  onAnswer: (result: AnswerResult) => void;
  icon?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  card,
  onAnswer,
  icon,
}) => {
  const { isRTL } = useLanguage();
  const rtlClass = isRTL ? "rtl" : "";

  return (
    <div className={`w-full h-[60vh] ${rtlClass}`}>
      {/* Topic Icon */}
      {icon && (
        <div className="flex justify-center mb-4">
          <img
            src={icon}
            alt="Topic icon"
            className="w-16 h-16 object-contain dark-invert-workaround"
          />
        </div>
      )}

      {/* Voice Selector */}
      <div className="absolute right-2 top-2 z-10">
        <VoiceSelector />
      </div>

      <MultipleChoiceQuestion
        question={card.question}
        answer={card.answer}
        options={card.options}
        onAnswer={onAnswer}
      />
    </div>
  );
};

export default QuestionCard;
