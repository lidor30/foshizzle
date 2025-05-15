import europaData from "./europa.json";
import fifaData from "./fifa.json";
import nbaData from "./nba.json";
import uefaData from "./uefa.json";

import championsIcon from "../assets/champions.png";
import europaIcon from "../assets/europa.png";
import globeIcon from "../assets/globe.png";
import nbaIcon from "../assets/nba.png";
import worldCupIcon from "../assets/world-cup.png";
import { generateFlagsFlashcards } from "./flags";

export type DifficultyLevel = "easy" | "medium" | "hard";
export type QuestionType = "basic" | "multiple_choice";

interface BaseFlashcardItem {
  id: string;
  question: string;
  answer: string;
  difficulty: DifficultyLevel;
  metadata?: Record<string, string | number | boolean>;
}

export interface BasicFlashcardItem extends BaseFlashcardItem {
  type: "basic";
}

export interface MultipleChoiceQuestionItem extends BaseFlashcardItem {
  type: "multiple_choice";
  options: string[];
}

export type FlashcardItem = BasicFlashcardItem | MultipleChoiceQuestionItem;

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
  generateFlashcards: (data: T[]) => FlashcardItem[] | Promise<FlashcardItem[]>;
}

export const topics: TopicConfig<SportData>[] = [
  {
    id: "flags",
    name: "World Flags",
    icon: globeIcon,
    data: [], // Data is loaded dynamically
    generateFlashcards: async () => {
      return await generateFlagsFlashcards();
    },
  },
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
            type: "multiple_choice",
            options: [
              championsItem.winner,
              championsItem.runnerUp,
              ...getRandomTeams(2, [
                championsItem.winner,
                championsItem.runnerUp,
              ]),
            ].sort(() => Math.random() - 0.5),
          } as MultipleChoiceQuestionItem,
          {
            id: `uefa-final-${championsItem.season}`,
            question: `Which teams played in the ${championsItem.season} UEFA Champions League final and what was the score?`,
            answer: `${championsItem.winner} vs ${championsItem.runnerUp}\n(${championsItem.score})`,
            difficulty: "medium",
            type: "basic",
          } as BasicFlashcardItem,
          {
            id: `uefa-location-stadium-${championsItem.season}`,
            question: `Where was the UEFA Champions League final in ${championsItem.season} held (city and stadium)?`,
            answer: `${championsItem.location}\n(${championsItem.stadium})`,
            difficulty: "hard",
            type: "multiple_choice",
            options: [
              `${championsItem.location}\n(${championsItem.stadium})`,
              ...getRandomStadiums(3, [
                `${championsItem.location}\n(${championsItem.stadium})`,
              ]),
            ].sort(() => Math.random() - 0.5),
          } as MultipleChoiceQuestionItem,
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
            type: "basic",
          } as BasicFlashcardItem,
          {
            id: `europa-final-${europaItem.season}`,
            question: `Which teams played in the ${europaItem.season} UEFA Europa League final and what was the score?`,
            answer: `${europaItem.winner} vs ${europaItem.runnerUp}\n(${europaItem.score})`,
            difficulty: "medium",
            type: "basic",
          } as BasicFlashcardItem,
          {
            id: `europa-location-stadium-${europaItem.season}`,
            question: `Where was the UEFA Europa League final in ${europaItem.season} held (city and stadium)?`,
            answer: `${europaItem.location}\n(${europaItem.stadium})`,
            difficulty: "hard",
            type: "basic",
          } as BasicFlashcardItem,
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
            type: "multiple_choice",
            options: [
              fifaItem.winner,
              fifaItem.runnerUp,
              ...getRandomTeams(2, [fifaItem.winner, fifaItem.runnerUp]),
            ].sort(() => Math.random() - 0.5),
          } as MultipleChoiceQuestionItem,
          {
            id: `fifa-final-${fifaItem.year}`,
            question: `Which teams played in the ${fifaItem.year} FIFA World Cup final and what was the score?`,
            answer: `${fifaItem.winner} vs ${fifaItem.runnerUp}\n(${fifaItem.score})`,
            difficulty: "medium",
            type: "basic",
          } as BasicFlashcardItem,
          {
            id: `fifa-host-${fifaItem.year}`,
            question: `Which country hosted the FIFA World Cup in ${fifaItem.year}?`,
            answer: fifaItem.host,
            difficulty: "medium",
            type: "multiple_choice",
            options: [
              fifaItem.host,
              ...getRandomCountries(3, [fifaItem.host]),
            ].sort(() => Math.random() - 0.5),
          } as MultipleChoiceQuestionItem,
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
          type: "basic",
        } as BasicFlashcardItem;
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

// Helper function to get random teams for multiple choice questions
const getRandomTeams = (count: number, excludeTeams: string[]): string[] => {
  const teams = [
    "Brazil",
    "Germany",
    "Italy",
    "France",
    "Argentina",
    "Spain",
    "England",
    "Uruguay",
    "Netherlands",
    "Portugal",
    "Mexico",
    "Croatia",
    "Belgium",
    "Sweden",
    "Russia",
  ].filter((team) => !excludeTeams.includes(team));

  return shuffleArray(teams).slice(0, count);
};

// Helper function to get random countries for multiple choice questions
const getRandomCountries = (
  count: number,
  excludeCountries: string[]
): string[] => {
  const countries = [
    "Brazil",
    "Germany",
    "South Africa",
    "France",
    "Qatar",
    "Spain",
    "England",
    "United States",
    "Japan",
    "Russia",
    "Mexico",
    "Italy",
    "South Korea",
    "Argentina",
    "Canada",
  ].filter((country) => !excludeCountries.includes(country));

  return shuffleArray(countries).slice(0, count);
};

// Helper function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Helper function to get random stadiums for multiple choice questions
const getRandomStadiums = (
  count: number,
  excludeStadiums: string[]
): string[] => {
  const stadiums = [
    "London\n(Wembley Stadium)",
    "Madrid\n(Santiago Bernabéu)",
    "Munich\n(Allianz Arena)",
    "Paris\n(Parc des Princes)",
    "Milan\n(San Siro)",
    "Barcelona\n(Camp Nou)",
    "Berlin\n(Olympiastadion)",
    "Istanbul\n(Atatürk Olympic Stadium)",
    "Lisbon\n(Estádio da Luz)",
    "Athens\n(Olympic Stadium)",
    "Amsterdam\n(Johan Cruyff Arena)",
  ].filter((stadium) => !excludeStadiums.includes(stadium));

  return shuffleArray(stadiums).slice(0, count);
};
