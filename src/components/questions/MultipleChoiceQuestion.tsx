import { useKidsMode } from '@/context/KidsModeContext'
import { AnswerResult } from '@/types'
import { MultipleChoiceQuestionItem } from '@/types/questions'
import { speakText } from '@/utils/ttsClient'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Fireworks from '../Fireworks'
import HtmlContent from '../HtmlContent'
import SpeakButton from '../SpeakButton'

interface MultipleChoiceQuestionProps {
  card: MultipleChoiceQuestionItem
  onAnswer: (result: AnswerResult) => void
  icon?: string
  enableRetries?: boolean
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  card,
  onAnswer,
  icon,
  enableRetries = false
}) => {
  const t = useTranslations('MultipleChoiceQuestion')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null)
  const [showFireworks, setShowFireworks] = useState(false)
  const { kidsMode } = useKidsMode()

  const useLargeAnswerBoxes = card.metadata?.largeAnswerBoxes || false
  const useLargeText = card.metadata?.largeText || false
  const showTTS = card.metadata?.enableTTS === true // Only show TTS if explicitly enabled

  const forceRTL = card.metadata?.isRTL === true
  const forceLTR = card.metadata?.isRTL === false
  const textDirection = forceRTL ? 'rtl' : forceLTR ? 'ltr' : 'inherit'

  const NEXT_QUESTION_DELAY = kidsMode ? 2500 : 1000

  // Reset selected option when the card changes
  useEffect(() => {
    setSelectedOption(null)
    setAnswerResult(null)
    setShowFireworks(false)

    // Only auto-read if TTS is enabled for this question
    if (kidsMode && card.autoReadQuestion && card.question.text && showTTS) {
      speakText(card.question.text)
    }
  }, [card.id, card.autoReadQuestion, card.question.text, kidsMode, showTTS])

  const getRandomPraiseMessage = () => {
    try {
      const praiseMessages = t.raw('praise')
      if (Array.isArray(praiseMessages) && praiseMessages.length > 0) {
        // Select a random message from the array
        const randomIndex = Math.floor(Math.random() * praiseMessages.length)
        return praiseMessages[randomIndex]
      }
      return t('correct')
    } catch {
      // Fallback to the default message if there's an error
      return t('correct')
    }
  }

  const handleOptionSelect = (index: number) => {
    // Get the selected option and determine if it's correct
    const selectedOption = card.options[index]
    const correctAnswer = card.answer

    let result: AnswerResult

    if (selectedOption.image && correctAnswer.image) {
      result =
        selectedOption.image === correctAnswer.image ? 'correct' : 'incorrect'
    } else if (selectedOption.text && correctAnswer.text) {
      result =
        selectedOption.text === correctAnswer.text ? 'correct' : 'incorrect'
    } else if (selectedOption.htmlContent && correctAnswer.htmlContent) {
      // Handle HTML content comparison (if they have a defined ID or other identifiable property)
      result =
        JSON.stringify(selectedOption.htmlContent) ===
        JSON.stringify(correctAnswer.htmlContent)
          ? 'correct'
          : 'incorrect'
    } else {
      result =
        selectedOption.text === correctAnswer.text ||
        selectedOption.image === correctAnswer.image ||
        JSON.stringify(selectedOption.htmlContent) ===
          JSON.stringify(correctAnswer.htmlContent)
          ? 'correct'
          : 'incorrect'
    }

    // Handle correct answer
    if (result === 'correct') {
      setSelectedOption(index)
      setAnswerResult(result)

      if (kidsMode) {
        setShowFireworks(true)
        setTimeout(() => {
          setShowFireworks(false)
        }, NEXT_QUESTION_DELAY)

        const praiseMessage = getRandomPraiseMessage()
        speakText(praiseMessage)

        toast.success(praiseMessage, {
          duration: NEXT_QUESTION_DELAY,
          style: {
            borderRadius: '10px',
            color: '#047857',
            fontWeight: 'bold',
            fontSize: '1.5rem'
          }
        })
      } else {
        toast.success(t('correct'), {
          duration: NEXT_QUESTION_DELAY,
          style: {
            borderRadius: '10px',
            color: '#047857',
            fontWeight: 'bold',
            fontSize: '1.5rem'
          }
        })
      }

      // Move to next question after delay
      setTimeout(() => {
        onAnswer(result)
      }, NEXT_QUESTION_DELAY)
    }
    // Handle incorrect answer
    else {
      // If retries are not enabled, show the correct answer and move to next question
      if (!enableRetries) {
        setSelectedOption(index)
        setAnswerResult(result)

        const correctAnswer = getCorrectAnswer()
        toast.error(
          <div>
            <p>{t('incorrect')}</p>
            {card.answer.text && (
              <p className="mt-1 text-lg">
                {t('correct_answer', { answer: correctAnswer })}
              </p>
            )}
          </div>,
          {
            duration: NEXT_QUESTION_DELAY,
            style: {
              borderRadius: '10px',
              color: '#B91C1C',
              fontWeight: 'bold',
              fontSize: '1.5rem'
            }
          }
        )

        // Move to next question after delay
        setTimeout(() => {
          onAnswer(result)
        }, NEXT_QUESTION_DELAY)
      }
      // If retries are enabled, just show "Try again" and let user select another option
      else {
        // Only highlight the selected option temporarily
        setSelectedOption(index)

        // Show "Try again" message
        toast.error(
          <div>
            <p>{t('tryAgain')}</p>
          </div>,
          {
            duration: 1000,
            style: {
              borderRadius: '10px',
              color: '#B91C1C',
              fontWeight: 'bold',
              fontSize: '1.5rem'
            }
          }
        )

        if (kidsMode) {
          speakText(t('tryAgain'))
        }

        // Reset selection after a short delay to allow for another selection
        setTimeout(() => {
          setSelectedOption(null)
        }, 1000)
      }
    }
  }

  const hasImagesInOptions = card.options.some((option) => option.image)
  const hasHtmlContentInOptions = card.options.some(
    (option) => option.htmlContent
  )

  const getCorrectAnswer = () => {
    const correctOption = card.options.find(
      (option) =>
        (option.text && card.answer.text && option.text === card.answer.text) ||
        (option.image &&
          card.answer.image &&
          option.image === card.answer.image) ||
        (option.htmlContent &&
          card.answer.htmlContent &&
          JSON.stringify(option.htmlContent) ===
            JSON.stringify(card.answer.htmlContent))
    )
    return correctOption?.text || ''
  }

  const isCorrectOption = (option: (typeof card.options)[0]) => {
    return (
      (option.text && card.answer.text && option.text === card.answer.text) ||
      (option.image &&
        card.answer.image &&
        option.image === card.answer.image) ||
      (option.htmlContent &&
        card.answer.htmlContent &&
        JSON.stringify(option.htmlContent) ===
          JSON.stringify(card.answer.htmlContent))
    )
  }

  return (
    <div className="w-full">
      {kidsMode && showFireworks && (
        <Fireworks duration={NEXT_QUESTION_DELAY} />
      )}

      {icon && !card.question.image && (
        <div className="flex justify-center mb-6">
          <Image
            src={`/images/icons/${icon}`}
            alt="Topic icon"
            className="w-16 h-16 object-contain dark:invert"
            width={1000}
            height={1000}
          />
        </div>
      )}

      {card.question.image && (
        <div className="flex justify-center mb-6 w-full h-40 md:h-52 md:landscape:h-64 lg:h-64">
          <Image
            src={card.question.image}
            alt="Question image"
            className="h-full w-auto max-h-full object-contain border border-gray-300 shadow-md"
            width={300}
            height={300}
          />
        </div>
      )}

      <div className="text-center mb-4 relative">
        <p
          dir={textDirection}
          className={`${useLargeText ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl'} font-semibold text-gray-700 dark:text-gray-300 whitespace-pre-wrap`}
        >
          {card.question.text}
        </p>

        {showTTS && (
          <div className="absolute right-[0] top-[-4px] rtl:left-[0] flex">
            <SpeakButton text={card.question.text || ''} />
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl md:landscape:max-w-3xl mx-auto mt-8">
        <div
          className={`grid ${
            hasImagesInOptions || hasHtmlContentInOptions || useLargeAnswerBoxes
              ? 'grid-cols-2 md:landscape:grid-cols-2 gap-4 md:gap-6 md:landscape:gap-6'
              : 'gap-3'
          }`}
        >
          {card.options.map((option, index) => {
            const isCorrect = isCorrectOption(option)
            const isSelected = selectedOption === index

            // Determine button style based on selection and correctness
            let buttonStyle = ''
            if (selectedOption !== null) {
              if (isSelected) {
                // Selected option styling
                buttonStyle = isCorrect
                  ? 'bg-green-200 dark:bg-green-900 border-green-500' // Correct answer selected
                  : 'bg-red-300 dark:bg-red-900 border-red-500' // Wrong answer selected
              } else if (isCorrect && answerResult === 'incorrect') {
                // Highlight correct answer when user selected wrong answer
                buttonStyle =
                  'bg-green-200 dark:bg-green-900 border-green-500 border-2'
              }
            }

            return (
              <button
                key={`${card.id}-option-${index}`}
                onClick={() => handleOptionSelect(index)}
                disabled={
                  selectedOption !== null &&
                  (!enableRetries || isCorrect || answerResult === 'correct')
                }
                dir={textDirection}
                className={`px-4 py-3 ${
                  option.image || option.htmlContent || useLargeAnswerBoxes
                    ? `flex flex-col items-center justify-center ${buttonStyle ? '' : 'bg-slate-300/50 dark:bg-slate-700/70'}`
                    : 'text-left rtl:text-right'
                } rounded-md transition-colors text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 ${buttonStyle} ${
                  useLargeAnswerBoxes
                    ? 'h-24 md:h-32 flex items-center justify-center'
                    : ''
                }`}
              >
                {/* Display option image - make it larger if it's primarily an image-based option */}
                {option.image && (
                  <div
                    className={`flex justify-center ${
                      option.text ? 'mb-2' : ''
                    } w-full ${option.image ? 'h-24 md:h-32 lg:h-40 md:landscape:h-32' : ''}`}
                  >
                    <Image
                      src={option.image}
                      alt="Option"
                      className="w-full h-full object-contain"
                      width={300}
                      height={200}
                    />
                  </div>
                )}

                {/* Display HTML content */}
                {option.htmlContent && (
                  <div
                    className={`flex justify-center ${option.text ? 'mb-2' : ''} w-full`}
                  >
                    <HtmlContent content={option.htmlContent} />
                  </div>
                )}

                {option.text && (
                  <span
                    className={`${useLargeText ? 'text-xl md:text-3xl lg:text-4xl font-medium' : ''}`}
                  >
                    {option.text}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MultipleChoiceQuestion
