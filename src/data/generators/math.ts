import {
  DifficultyLevel,
  MultipleChoiceQuestionItem,
  QuestionType
} from '@/types/questions'
import { Locale } from 'next-intl'
import {
  createMultipleChoiceQuestion,
  getDifficultyLevels,
  getRandomNumber,
  shouldIncludeQuestionType,
  shuffleArray
} from './utils'

const NUMBER_OF_QUESTIONS = 20

// Generate wrong answers for a math question
const generateWrongAnswers = (
  correctAnswer: number,
  count: number,
  maxNumber: number
): number[] => {
  const wrongAnswers: number[] = []
  const range = Math.max(maxNumber, 20) // Ensure reasonable range for wrong answers

  while (wrongAnswers.length < count) {
    // Generate wrong answer within +/- range of correct answer, but not the correct answer
    let wrongAnswer: number
    const useCloseAnswer = Math.random() < 0.7 // 70% chance to use a close answer

    if (useCloseAnswer) {
      // Generate answer close to correct answer
      const offset = getRandomNumber(1, 5) * (Math.random() < 0.5 ? 1 : -1)
      wrongAnswer = correctAnswer + offset
    } else {
      // Generate random answer within range
      wrongAnswer = getRandomNumber(
        Math.max(1, correctAnswer - range),
        correctAnswer + range
      )
    }

    // Ensure answer is positive and not a duplicate or the correct answer
    if (
      wrongAnswer > 0 &&
      wrongAnswer !== correctAnswer &&
      !wrongAnswers.includes(wrongAnswer)
    ) {
      wrongAnswers.push(wrongAnswer)
    }
  }

  return wrongAnswers
}

// Generate random math questions based on difficulty
const generateMathQuestionsForDifficulty = (
  count: number,
  difficulty: DifficultyLevel
): MultipleChoiceQuestionItem[] => {
  const questions: MultipleChoiceQuestionItem[] = []

  // Set parameters based on difficulty
  let maxNumber: number
  let operations: ('addition' | 'subtraction')[]

  switch (difficulty) {
    case 'easy':
      maxNumber = 10
      operations = ['addition']
      break
    case 'medium':
      maxNumber = 10
      operations = ['addition', 'subtraction']
      break
    case 'hard':
      maxNumber = 20
      operations = ['addition', 'subtraction']
      break
  }

  // Generate questions
  for (let i = 0; i < count; i++) {
    // Randomly select operation
    const operation = operations[Math.floor(Math.random() * operations.length)]

    let num1: number, num2: number, answer: number, questionText: string

    if (operation === 'addition') {
      num1 = getRandomNumber(1, maxNumber)
      num2 = getRandomNumber(1, maxNumber)
      answer = num1 + num2
      questionText = `${num1} + ${num2} = ?`
    } else {
      // For subtraction, ensure answer is positive
      num1 = getRandomNumber(Math.ceil(maxNumber / 2), maxNumber)
      num2 = getRandomNumber(1, num1)
      answer = num1 - num2
      questionText = `${num1} - ${num2} = ?`
    }

    // Generate wrong answers
    const wrongAnswers = generateWrongAnswers(answer, 3, maxNumber)

    // Create options with answer and wrong answers
    const options = shuffleArray([
      { text: answer.toString() },
      ...wrongAnswers.map((a) => ({ text: a.toString() }))
    ])

    // Create question
    questions.push(
      createMultipleChoiceQuestion(
        `math-${difficulty}-${i}`,
        questionText,
        answer.toString(),
        options,
        difficulty,
        {
          largeAnswerBoxes: true,
          largeText: true,
          kidsQuestion: true,
          isRTL: false
        }
      )
    )
  }

  return questions
}

// Export the main generator function
export const generateMathQuestions = (
  locale?: Locale,
  difficulty?: DifficultyLevel,
  type?: QuestionType
): MultipleChoiceQuestionItem[] => {
  // If type is flashcard, return empty array since math questions are only multiple choice
  if (!shouldIncludeQuestionType(type, 'multiple_choice')) {
    return []
  }

  // Determine which difficulties to generate based on the parameter
  const difficultiesToGenerate = getDifficultyLevels(difficulty)

  // Generate only the questions for the required difficulties
  const questions: MultipleChoiceQuestionItem[] = []

  for (const diff of difficultiesToGenerate) {
    questions.push(
      ...generateMathQuestionsForDifficulty(NUMBER_OF_QUESTIONS, diff)
    )
  }

  return questions
}
