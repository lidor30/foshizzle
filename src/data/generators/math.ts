import { MultipleChoiceQuestionItem } from '@/types/questions'

const NUMBER_OF_QUESTIONS = 20

// Generate a random number between min and max (inclusive)
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate a set of wrong answers for multiple choice
const generateWrongAnswers = (
  correctAnswer: number,
  count: number,
  maxValue: number
): number[] => {
  const wrongAnswers: number[] = []
  const usedAnswers = new Set([correctAnswer])

  // Ensure we don't get negative numbers or duplicates
  while (wrongAnswers.length < count) {
    // Generate values around the correct answer
    const offset = getRandomNumber(-3, 3)
    if (offset === 0) continue // Skip if it would be the correct answer

    const wrongAnswer = correctAnswer + offset

    // Ensure the answer is positive and within a reasonable range
    if (
      wrongAnswer >= 0 &&
      wrongAnswer <= maxValue * 2 &&
      !usedAnswers.has(wrongAnswer)
    ) {
      wrongAnswers.push(wrongAnswer)
      usedAnswers.add(wrongAnswer)
    }
  }

  return wrongAnswers
}

// Generate random math questions based on difficulty
const generateMathQuestionsForDifficulty = (
  count: number,
  difficulty: 'easy' | 'medium' | 'hard'
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

    // Create question
    questions.push({
      id: `math-${difficulty}-${i}`,
      question: {
        text: questionText
      },
      answer: {
        text: answer.toString()
      },
      difficulty,
      type: 'multiple_choice',
      options: [
        { text: answer.toString() },
        ...wrongAnswers.map((a) => ({ text: a.toString() }))
      ].sort(() => Math.random() - 0.5),
      metadata: {
        largeAnswerBoxes: true,
        largeText: true,
        kidsQuestion: true,
        isRTL: false
      }
    })
  }

  return questions
}

// Export the main generator function
export const generateMathQuestions = (): MultipleChoiceQuestionItem[] => {
  return [
    ...generateMathQuestionsForDifficulty(NUMBER_OF_QUESTIONS, 'easy'),
    ...generateMathQuestionsForDifficulty(NUMBER_OF_QUESTIONS, 'medium'),
    ...generateMathQuestionsForDifficulty(NUMBER_OF_QUESTIONS, 'hard')
  ]
}
