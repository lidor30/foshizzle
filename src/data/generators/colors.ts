import {
  DifficultyLevel,
  MultipleChoiceQuestionItem,
  QuestionType
} from '@/types/questions'
import { Locale } from 'next-intl'
import {
  getDifficultyLevels,
  shouldIncludeQuestionType,
  shuffleArray
} from './utils'

interface ColorData {
  name: string
  hebrewName: string
  color: string
}

const colors: ColorData[] = [
  { name: 'red', hebrewName: 'אדום', color: '#FF0000' },
  { name: 'blue', hebrewName: 'כחול', color: '#0000FF' },
  { name: 'green', hebrewName: 'ירוק', color: '#00AA00' },
  { name: 'yellow', hebrewName: 'צהוב', color: '#FFFF00' },
  { name: 'orange', hebrewName: 'כתום', color: '#FFA500' },
  { name: 'purple', hebrewName: 'סגול', color: '#800080' },
  { name: 'pink', hebrewName: 'ורוד', color: '#FFC0CB' },
  { name: 'brown', hebrewName: 'חום', color: '#FF5733' },
  { name: 'black', hebrewName: 'שחור', color: '#000000' },
  { name: 'white', hebrewName: 'לבן', color: '#FFFFFF' }
]

const generateColorsQuestionsForDifficulty = (
  difficulty: DifficultyLevel
): MultipleChoiceQuestionItem[] => {
  const questions: MultipleChoiceQuestionItem[] = []

  // We'll make a set of questions for each color
  colors.forEach((color, colorIndex) => {
    // Create question asking to identify a specific color
    const questionText = `לחץ על הצבע ${color.hebrewName}`

    // Choose 3 random different colors as distractors
    const otherColors = colors.filter((c) => c.name !== color.name)
    const distractors = shuffleArray([...otherColors]).slice(0, 3)

    // Create options - each option is a colored ball using HTML component
    const options = shuffleArray([
      {
        htmlContent: {
          type: 'ColorBall',
          props: {
            color: color.color,
            size: 'large'
          }
        },
        text: '' // Add empty text to satisfy the type requirement
      },
      ...distractors.map((c) => ({
        htmlContent: {
          type: 'ColorBall',
          props: {
            color: c.color,
            size: 'large'
          }
        },
        text: '' // Add empty text to satisfy the type requirement
      }))
    ])

    // Create the question as a direct object
    const question: MultipleChoiceQuestionItem = {
      id: `colors-${difficulty}-${colorIndex}`,
      question: { text: questionText },
      answer: {
        htmlContent: {
          type: 'ColorBall',
          props: {
            color: color.color,
            size: 'large'
          }
        }
      },
      difficulty,
      type: 'multiple_choice',
      options,
      metadata: {
        largeAnswerBoxes: true,
        enableTTS: true,
        autoReadQuestion: true,
        isRTL: true, // Hebrew is right-to-left
        kidsQuestion: true
      }
    }

    questions.push(question)
  })

  return questions
}

export const generateColorsQuestions = (
  locale?: Locale,
  difficulty?: DifficultyLevel,
  type?: QuestionType
): MultipleChoiceQuestionItem[] => {
  // Only support multiple choice questions
  if (!shouldIncludeQuestionType(type, 'multiple_choice')) {
    return []
  }

  // Determine which difficulties to generate based on the parameter
  const difficultiesToGenerate = getDifficultyLevels(difficulty)

  // Generate questions for each difficulty
  const questions: MultipleChoiceQuestionItem[] = []

  for (const diff of difficultiesToGenerate) {
    questions.push(...generateColorsQuestionsForDifficulty(diff))
  }

  return questions
}
