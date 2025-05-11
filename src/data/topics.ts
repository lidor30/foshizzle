/* eslint-disable @typescript-eslint/no-empty-object-type */
import europaData from "./europa.json";
import fifaData from "./fifa.json";
import nbaData from "./nba.json";
import uefaData from "./uefa.json";

// Import icons
import championsIcon from "../assets/champions.png";
import europaIcon from "../assets/europa.png";
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
      data.map((item) => ({
        id: `uefa-${item.season}`,
        question: `Who won the UEFA Champions League in ${item.season}?`,
        answer: item.winner,
      })),
  },
  {
    id: "europa",
    name: "UEFA Europa League Winners",
    icon: europaIcon,
    data: europaData as EuropaData[],
    generateFlashcards: (data) =>
      data.map((item) => ({
        id: `europa-${item.season}`,
        question: `Who won the UEFA Europa League in ${item.season}?`,
        answer: item.winner,
      })),
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
    data: nbaData as NBAData[],
    generateFlashcards: (data) =>
      data.map((item) => ({
        id: `nba-${item.year}`,
        question: `Which team won the NBA Championship in ${item.year}?`,
        answer: item.winner,
      })),
  },
];
