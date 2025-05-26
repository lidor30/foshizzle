import { Locale } from 'next-intl'
import { StaticImageData } from 'next/image'

export type DifficultyLevel = 'easy' | 'medium' | 'hard'
export type QuestionType = 'basic' | 'multiple_choice'

export interface ContentItem {
  text?: string
  image?: string
}

export interface BaseFlashcardItem {
  id: string
  question: ContentItem
  answer: ContentItem
  difficulty: DifficultyLevel
  metadata?: Record<string, string | number | boolean>
  autoReadQuestion?: boolean
}

export interface BasicFlashcardItem extends BaseFlashcardItem {
  type: 'basic'
}

export interface MultipleChoiceQuestionItem extends BaseFlashcardItem {
  type: 'multiple_choice'
  options: ContentItem[]
}

export type FlashcardItem = BasicFlashcardItem | MultipleChoiceQuestionItem

export interface BaseTopicData {
  [key: string]: any
}

export interface ChampionsLeagueData extends BaseTopicData {
  winner: string
  runnerUp: string
  season: string
  score: string
  location: string
  stadium: string
}

export interface EuropaLeagueData extends BaseTopicData {
  winner: string
  runnerUp: string
  season: string
  score: string
  location: string
  stadium: string
}

export interface NBAData extends BaseTopicData {
  winner: string
  runnerUp: string
  year: string
}

export interface FIFAData extends BaseTopicData {
  winner: string
  runnerUp: string
  year: number
  score: string
  host: string
}

export interface FlagData extends BaseTopicData {
  countryCode: string
}

export interface MathData extends BaseTopicData {
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

export interface TopicConfig<T extends BaseTopicData> {
  id: string
  name: string
  icon?: string | StaticImageData
  data: T[]
  generateQuestions: (
    data: T[],
    params?: { locale?: Locale }
  ) => FlashcardItem[] | Promise<FlashcardItem[]>
  kidsMode?: boolean
}
