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

export interface BaseData {
  winner: string
  runnerUp: string
}

export interface ChampionsLeagueData extends BaseData {
  season: string
  score: string
  location: string
  stadium: string
}

export interface EuropaLeagueData extends BaseData {
  season: string
  score: string
  location: string
  stadium: string
}

export interface NBAData extends BaseData {
  year: string
}

export interface TestData {
  id: number
}

export interface FIFAData extends BaseData {
  year: number
  score: string
  runnerUp: string
  host: string
}

export type SportData =
  | ChampionsLeagueData
  | EuropaLeagueData
  | FIFAData
  | NBAData
  | TestData
