import {
  DifficultyLevel,
  FlashcardItem,
  MultipleChoiceQuestionItem,
  QuestionType
} from '@/types/questions'

/**
 * Determines which difficulty levels to include based on the requested difficulty
 */
export const getDifficultyLevels = (
  difficulty?: DifficultyLevel
): DifficultyLevel[] => {
  if (!difficulty || difficulty === 'hard') {
    return ['easy', 'medium', 'hard']
  } else if (difficulty === 'medium') {
    return ['easy', 'medium']
  } else {
    return ['easy']
  }
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Creates options for a multiple choice question with correct answer and distractors
 */
export const createMultipleChoiceOptions = <T>(
  correctAnswer: T,
  distractors: T[]
): { text: string }[] => {
  return shuffleArray([
    { text: String(correctAnswer) },
    ...distractors.map((distractor) => ({ text: String(distractor) }))
  ])
}

/**
 * Generates a random number between min and max (inclusive)
 */
export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Gets random teams for sports-related questions
 */
export const getRandomTeams = <T extends { winner: string; runnerUp: string }>(
  count: number,
  excludeTeams: string[],
  data: T[],
  currentPeriod: string,
  periodKey: keyof T
): string[] => {
  const allTeams = new Set<string>()

  data.forEach((item) => {
    if (item[periodKey] !== currentPeriod) {
      allTeams.add(item.winner)
      allTeams.add(item.runnerUp)
    }
  })

  excludeTeams.forEach((team) => allTeams.delete(team))

  const availableTeams = Array.from(allTeams)
  const selectedTeams: string[] = []

  for (let i = 0; i < count && availableTeams.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableTeams.length)
    selectedTeams.push(availableTeams[randomIndex])
    availableTeams.splice(randomIndex, 1)
  }

  return selectedTeams
}

/**
 * Creates a multiple choice question
 */
export const createMultipleChoiceQuestion = (
  id: string,
  questionText: string,
  correctAnswer: string,
  options: { text: string }[],
  difficulty: DifficultyLevel,
  metadata?: Record<string, any>
): MultipleChoiceQuestionItem => {
  return {
    id,
    question: { text: questionText },
    answer: { text: correctAnswer },
    difficulty,
    type: 'multiple_choice',
    options,
    ...(metadata ? { metadata } : {})
  } as MultipleChoiceQuestionItem
}

/**
 * Creates a flashcard question
 */
export const createFlashcardQuestion = (
  id: string,
  questionText: string,
  answerText: string,
  difficulty: DifficultyLevel,
  metadata?: Record<string, any>
): FlashcardItem => {
  return {
    id,
    question: { text: questionText },
    answer: { text: answerText },
    difficulty,
    type: 'flashcard',
    ...(metadata ? { metadata } : {})
  } as FlashcardItem
}

/**
 * Checks if a question type should be included based on the request
 */
export const shouldIncludeQuestionType = (
  requestedType: QuestionType | undefined,
  questionType: QuestionType
): boolean => {
  return !requestedType || requestedType === questionType
}
