import { Locale } from 'next-intl'
import { StaticImageData } from 'next/image'

export type DifficultyLevel = 'easy' | 'medium' | 'hard'
export type QuestionType = 'flashcard' | 'multiple_choice'

export type ContentItem = {
  text?: string
  image?: string
}

export type BaseQuestionItem = {
  id: string
  question: ContentItem
  answer: ContentItem
  type: QuestionType
  difficulty: DifficultyLevel
  metadata?: Record<string, string | number | boolean>
  autoReadQuestion?: boolean
}

export type FlashcardItem = BaseQuestionItem & {
  type: 'flashcard'
}
export type MultipleChoiceQuestionItem = BaseQuestionItem & {
  type: 'multiple_choice'
  options: ContentItem[]
}

export type QuestionItem = FlashcardItem | MultipleChoiceQuestionItem

export interface BaseTopicData {
  [key: string]: any
}

export type ChampionsLeagueData = BaseTopicData & {
  winner: string
  runnerUp: string
  season: string
  score: string
  location: string
  stadium: string
}

export type EuropaLeagueData = BaseTopicData & {
  winner: string
  runnerUp: string
  season: string
  score: string
  location: string
  stadium: string
}

export type NBAData = BaseTopicData & {
  winner: string
  runnerUp: string
  year: string
}

export type FIFAData = BaseTopicData & {
  winner: string
  runnerUp: string
  year: number
  score: string
  host: string
}

export type FlagData = BaseTopicData & {
  countryCode: string
}

export type MathData = BaseTopicData & {
  operation: 'addition' | 'subtraction'
  maxNumber: number
}

export type TopicData =
  | ChampionsLeagueData
  | EuropaLeagueData
  | FIFAData
  | NBAData
  | FlagData
  | MathData

export type TopicMetadata = {
  id: string
  name: string
  icon?: string | StaticImageData
  kidsMode?: boolean
}

export type TopicConfig<T extends BaseTopicData> = {
  id: string
  name: string
  icon?: string | StaticImageData
  data: T[]
  generateQuestions: (
    data: T[],
    params?: { locale?: Locale }
  ) => QuestionItem[] | Promise<QuestionItem[]>
  kidsMode?: boolean
}
