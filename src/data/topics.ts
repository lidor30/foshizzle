import europaData from "./europa.json";
import fifaData from "./fifa.json";
import nbaData from "./nba.json";
import uefaData from "./uefa.json";

import championsIcon from "../assets/champions.png";
import europaIcon from "../assets/europa.png";
import nbaIcon from "../assets/nba.png";
import worldCupIcon from "../assets/world-cup.png";

export type DifficultyLevel = "easy" | "medium" | "hard";

export interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
  difficulty: DifficultyLevel;
}

interface BaseData {
  winner: string;
  runnerUp: string;
}

interface ChampionsLeagueData extends BaseData {
  season: string;
  score: string;
  location: string;
  stadium: string;
}

interface EuropaLeagueData extends BaseData {
  season: string;
  score: string;
  location: string;
  stadium: string;
}

interface NBAData extends BaseData {
  year: string;
}

interface TestData {
  id: number;
}

interface FIFAData extends BaseData {
  year: number;
  score: string;
  runnerUp: string;
  host: string;
}

type SportData =
  | ChampionsLeagueData
  | EuropaLeagueData
  | FIFAData
  | NBAData
  | TestData;

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
    name: "UEFA Champions League",
    icon: championsIcon,
    data: uefaData as ChampionsLeagueData[],
    generateFlashcards: (data) =>
      data.flatMap((item) => {
        const championsItem = item as ChampionsLeagueData;
        return [
          {
            id: `uefa-winner-${championsItem.season}`,
            question: `Who won the UEFA Champions League in ${championsItem.season}?`,
            answer: championsItem.winner,
            difficulty: "easy",
          },
          {
            id: `uefa-final-${championsItem.season}`,
            question: `Which teams played in the ${championsItem.season} UEFA Champions League final and what was the score?`,
            answer: `${championsItem.winner} vs ${championsItem.runnerUp}\n(${championsItem.score})`,
            difficulty: "medium",
          },
          {
            id: `uefa-location-stadium-${championsItem.season}`,
            question: `Where was the UEFA Champions League final in ${championsItem.season} held (city and stadium)?`,
            answer: `${championsItem.location}\n(${championsItem.stadium})`,
            difficulty: "hard",
          },
        ];
      }),
  },
  {
    id: "europa",
    name: "UEFA Europa League",
    icon: europaIcon,
    data: europaData as EuropaLeagueData[],
    generateFlashcards: (data) =>
      data.flatMap((item) => {
        const europaItem = item as EuropaLeagueData;
        return [
          {
            id: `europa-winner-${europaItem.season}`,
            question: `Who won the UEFA Europa League in ${europaItem.season}?`,
            answer: europaItem.winner,
            difficulty: "easy",
          },
          {
            id: `europa-final-${europaItem.season}`,
            question: `Which teams played in the ${europaItem.season} UEFA Europa League final and what was the score?`,
            answer: `${europaItem.winner} vs ${europaItem.runnerUp}\n(${europaItem.score})`,
            difficulty: "medium",
          },
          {
            id: `europa-location-stadium-${europaItem.season}`,
            question: `Where was the UEFA Europa League final in ${europaItem.season} held (city and stadium)?`,
            answer: `${europaItem.location}\n(${europaItem.stadium})`,
            difficulty: "hard",
          },
        ];
      }),
  },
  {
    id: "fifa",
    name: "FIFA World Cup",
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
            difficulty: "easy",
          },
          {
            id: `fifa-final-${fifaItem.year}`,
            question: `Which teams played in the ${fifaItem.year} FIFA World Cup final and what was the score?`,
            answer: `${fifaItem.winner} vs ${fifaItem.runnerUp}\n(${fifaItem.score})`,
            difficulty: "medium",
          },
          {
            id: `fifa-host-${fifaItem.year}`,
            question: `Which country hosted the FIFA World Cup in ${fifaItem.year}?`,
            answer: fifaItem.host,
            difficulty: "medium",
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
      data.map((item) => {
        const nbaItem = item as NBAData;
        return {
          id: `nba-${nbaItem.year}`,
          question: `Which team won the NBA Championship in ${nbaItem.year}?`,
          answer: nbaItem.winner,
          difficulty: "easy",
        };
      }),
  },
  // {
  //   id: "test",
  //   name: "Test",
  //   data: [{ id: 1 }, { id: 2 }, { id: 3 }] as TestData[],
  //   generateFlashcards: (data) =>
  //     data.map((item) => ({
  //       id: `test-${item}`,
  //       question: `מה הדגל של לבנון, מה הדגל של ספרד, מה הדגל של יפן, מה הדגל של אפגניסטן?`,
  //       answer: "42",
  //       difficulty: "easy",
  //     })),
  // },
];
