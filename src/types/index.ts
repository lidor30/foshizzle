export interface CardStats {
  correct: number;
  incorrect: number;
}

export interface StatsState {
  [cardId: string]: CardStats;
}

export type AnswerResult = "correct" | "incorrect";
