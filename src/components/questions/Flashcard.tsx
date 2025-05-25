import { AnswerResult } from '@/types'
import { ContentItem, FlashcardItem } from '@/types/questions'
import { speakText } from '@/utils/ttsClient'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import SpeakButton from '../SpeakButton'

interface FlashcardProps {
  card: FlashcardItem
  isFlipped: boolean
  onFlip: () => void
  onAnswer: (result: AnswerResult) => void
  icon?: string
}

interface DelayedAnswer {
  answer: ContentItem
  icon?: string
}

const Flashcard: React.FC<FlashcardProps> = ({
  card,
  isFlipped,
  onFlip,
  onAnswer,
  icon
}) => {
  const t = useTranslations('Flashcard')
  const [delayedAnswer, setDelayedAnswer] = useState<DelayedAnswer | null>(null)

  useEffect(() => {
    if (card) {
      setTimeout(() => {
        setDelayedAnswer({
          answer: card.answer,
          icon
        })
      }, 500)

      if (card.autoReadQuestion && card.question.text) {
        speakText(card.question.text)
      }
    }
  }, [card, icon, card.autoReadQuestion, card.question.text])

  const handleAnswer = (result: AnswerResult, e: React.MouseEvent) => {
    e.stopPropagation()
    onAnswer(result)
  }

  return (
    <div className="w-full h-[60vh] perspective-1000">
      <div
        className={`flip-card w-full h-full cursor-pointer`}
        onClick={!isFlipped ? onFlip : undefined}
      >
        <div
          className={`flip-card-inner w-full h-full relative transition-transform duration-700 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Side (Question) */}
          <div className="flip-card-front absolute w-full h-full backface-hidden bg-slate-300/40 dark:bg-gray-800 shadow-lg rounded-lg p-5 flex flex-col items-center justify-center">
            {icon && !card.question.image && (
              <Image
                src={icon}
                alt="Topic icon"
                width={64}
                height={64}
                className="w-16 h-16 object-contain mb-6 dark-invert-workaround"
              />
            )}

            {card.question.image && (
              <div className="flex justify-center mb-6 w-full h-40 md:h-52 md:landscape:h-64 lg:h-64">
                <Image
                  src={card.question.image}
                  alt="Question image"
                  width={300}
                  height={200}
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
              {t('show')}
            </div>

            <div className="absolute right-2 top-2 flex">
              <SpeakButton text={card.question.text || ''} />
            </div>
          </div>

          {/* Back Side (Answer) */}
          <div className="flip-card-back absolute w-full h-full backface-hidden bg-slate-300/40 dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center rotate-y-180">
            {delayedAnswer && (
              <>
                {delayedAnswer.icon && !delayedAnswer.answer.image && (
                  <Image
                    src={delayedAnswer.icon}
                    alt="Topic icon"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain mb-6 dark-invert-workaround"
                  />
                )}

                {delayedAnswer.answer.image && (
                  <div className="flex justify-center mb-6 w-full h-40 md:h-52 md:landscape:h-64 lg:h-64">
                    <Image
                      src={delayedAnswer.answer.image}
                      alt="Answer image"
                      width={300}
                      height={200}
                      className="h-full w-auto max-h-full object-contain border border-gray-300 shadow-md"
                    />
                  </div>
                )}

                <div className="text-center mb-6 relative">
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {delayedAnswer.answer.text}
                  </p>
                </div>

                <div className="absolute right-2 top-2 flex">
                  <SpeakButton text={delayedAnswer.answer.text || ''} />
                </div>
              </>
            )}

            <div className="flex space-x-4 rtl:space-x-reverse">
              <button
                onClick={(e) => handleAnswer('incorrect', e)}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                {t('incorrect')}
              </button>
              <button
                onClick={(e) => handleAnswer('correct', e)}
                className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                {t('correct')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Flashcard
