/* eslint-disable @typescript-eslint/no-empty-object-type */
import europaData from "./europa.json";
import fifaData from "./fifa.json";
import nbaData from "./nba.json";
import uefaData from "./uefa.json";

// Import icons
import championsIcon from "../assets/champions.png";
import europaIcon from "../assets/europa.png";
import nbaIcon from "../assets/nba.png";
import worldCupIcon from "../assets/world-cup.png";

export interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
}

interface BaseData {
  year?: string;
  season?: string;
  winner: string;
  runnerUp: string;
}

interface UEFAData extends BaseData {
  score: string;
  location: string;
  stadium: string;
}

interface EuropaData extends BaseData {
  score: string;
  location: string;
  stadium: string;
}

interface NBAData extends BaseData {}

interface FIFAData extends BaseData {
  host: string;
}

type SportData = UEFAData | EuropaData | FIFAData | NBAData;

export interface TopicConfig<T extends SportData> {
  id: string;
  name: string;
  icon?: string;
  data: T[];
  generateFlashcards: (data: T[]) => FlashcardItem[];
}

export const topics: TopicConfig<SportData>[] = [
  {
    id: "uefa",
    name: "UEFA Champions League Winners",
    icon: championsIcon,
    data: uefaData as UEFAData[],
    generateFlashcards: (data) =>
      data.flatMap((item) => {
        const uefaItem = item as UEFAData;
        return [
          {
            id: `uefa-winner-${uefaItem.season}`,
            question: `Who won the UEFA Champions League in ${uefaItem.season}?`,
            answer: uefaItem.winner,
          },
          {
            id: `uefa-runnerup-score-${uefaItem.season}`,
            question: `Who was the runner-up and what was the score in the UEFA Champions League final in ${uefaItem.season}?`,
            answer: `${uefaItem.runnerUp} (Score: ${uefaItem.score})`,
          },
          {
            id: `uefa-location-stadium-${uefaItem.season}`,
            question: `Where was the UEFA Champions League final in ${uefaItem.season} held (city and stadium)?`,
            answer: `${uefaItem.location} (${uefaItem.stadium})`,
          },
        ];
      }),
  },
  {
    id: "europa",
    name: "UEFA Europa League Winners",
    icon: europaIcon,
    data: europaData as EuropaData[],
    generateFlashcards: (data) =>
      data.flatMap((item) => {
        const europaItem = item as EuropaData;
        return [
          {
            id: `europa-winner-${europaItem.season}`,
            question: `Who won the UEFA Europa League in ${europaItem.season}?`,
            answer: europaItem.winner,
          },
          {
            id: `europa-runnerup-score-${europaItem.season}`,
            question: `Who was the runner-up and what was the score in the UEFA Europa League final in ${europaItem.season}?`,
            answer: `${europaItem.runnerUp} (Score: ${europaItem.score})`,
          },
          {
            id: `europa-location-stadium-${europaItem.season}`,
            question: `Where was the UEFA Europa League final in ${europaItem.season} held (city and stadium)?`,
            answer: `${europaItem.location} (${europaItem.stadium})`,
          },
        ];
      }),
  },
  {
    id: "fifa",
    name: "FIFA World Cup Winners",
    icon: worldCupIcon,
    data: fifaData as FIFAData[],
    generateFlashcards: (data) => {
      return data.flatMap((item) => {
        const fifaItem = item as FIFAData;
        return [
          {
            id: `fifa-winner-${fifaItem.year}`,
            question: `Who won the FIFA World Cup in ${fifaItem.year}?`,
            answer: fifaItem.winner,
          },
          {
            id: `fifa-host-${fifaItem.year}`,
            question: `Which country hosted the FIFA World Cup in ${fifaItem.year}?`,
            answer: fifaItem.host,
          },
        ];
      });
    },
  },
  {
    id: "nba",
    name: "NBA Champions",
    icon: nbaIcon,
    data: nbaData as NBAData[],
    generateFlashcards: (data) =>
      data.map((item) => ({
        id: `nba-${item.year}`,
        question: `Which team won the NBA Championship in ${item.year}?`,
        answer: item.winner,
      })),
  },
];
