import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import { useTTS } from "../contexts/TTSContext";
import type { ContentItem, FlashcardItem } from "../data/topics";
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
  answer: ContentItem;
  icon?: string;
}

const Flashcard: React.FC<FlashcardProps> = ({
  card,
  isFlipped,
  onFlip,
  onAnswer,
  icon,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { speakText } = useTTS();
  const [delayedAnswer, setDelayedAnswer] = useState<DelayedAnswer | null>(
    null
  );

  useEffect(() => {
    if (card) {
      setTimeout(() => {
        setDelayedAnswer({
          answer: card.answer,
          icon,
        });
      }, 500);

      if (card.autoReadQuestion && card.question.text) {
        speakText(card.question.text);
      }
    }
  }, [card, icon, card.autoReadQuestion, card.question.text, speakText]);

  const rtlClass = isRTL ? "rtl" : "";

  return (
    <div
      className={`w-full h-[60vh] cursor-pointer ${rtlClass}`}
      onClick={!isFlipped ? onFlip : undefined}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 px-4 pt-2 ${
          isFlipped ? "card flipped" : "card"
        }`}
      >
        <div className="card-inner">
          {/* Front Side (Question) */}
          <div className="card-front bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5 flex flex-col items-center justify-center relative">
            {icon && !card.question.image && (
              <img
                src={icon}
                alt="Topic icon"
                className="w-16 h-16 object-contain mb-6 dark-invert-workaround"
              />
            )}

            {card.question.image && (
              <div className="flex justify-center mb-6 w-full h-40 md:h-52 md:landscape:h-64 lg:h-64">
                <img
                  src={card.question.image}
                  alt="Question image"
                  className="h-full w-auto max-h-full object-contain border border-gray-300 shadow-md"
                />
              </div>
            )}

            <div className="text-center relative">
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {card.question.text}
              </p>
            </div>
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              {t("session.flashcard.show")}
            </div>

            <div className="absolute right-2 top-2 flex">
              <VoiceSelector />
              <SpeakButton text={card.question.text || ""} />
            </div>
          </div>

          {/* Back Side (Answer) */}
          <div className="card-back bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center relative">
            {delayedAnswer && (
              <>
                {delayedAnswer.icon && !delayedAnswer.answer.image && (
                  <img
                    src={delayedAnswer.icon}
                    alt="Topic icon"
                    className="w-16 h-16 object-contain mb-6 dark-invert-workaround"
                  />
                )}

                {delayedAnswer.answer.image && (
                  <div className="flex justify-center mb-6 w-full h-40 md:h-52 md:landscape:h-64 lg:h-64">
                    <img
                      src={delayedAnswer.answer.image}
                      alt="Answer image"
                      className="h-full w-auto max-h-full object-contain border border-gray-300 shadow-md"
                    />
                  </div>
                )}

                <div className="text-center mb-6 relative">
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 font-semibold whitespace-pre-wrap">
                    {delayedAnswer.answer.text}
                  </p>
                </div>

                <div className="absolute right-2 top-2 flex">
                  <SpeakButton text={delayedAnswer.answer.text || ""} />
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
                {t("session.flashcard.incorrect")}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAnswer("correct");
                }}
                className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                {t("session.flashcard.correct")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
