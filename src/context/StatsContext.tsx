import React, { createContext, useContext, useEffect, useState } from "react";
import type { AnswerResult, CardStats, StatsState } from "../types";

interface StatsContextType {
  stats: StatsState;
  updateCardStat: (cardId: string, result: AnswerResult) => void;
  calculateWeight: (cardId: string) => number;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stats, setStats] = useState<StatsState>({});

  useEffect(() => {
    const savedStats = localStorage.getItem("foshizzle-stats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("foshizzle-stats", JSON.stringify(stats));
  }, [stats]);

  const updateCardStat = (cardId: string, result: AnswerResult) => {
    setStats((prevStats) => {
      const cardStats = prevStats[cardId] || { correct: 0, incorrect: 0 };

      const newCardStats: CardStats = {
        ...cardStats,
        [result]: cardStats[result] + 1,
      };

      return {
        ...prevStats,
        [cardId]: newCardStats,
      };
    });
  };

  const calculateWeight = (cardId: string) => {
    const cardStats = stats[cardId] || { correct: 0, incorrect: 0 };
    return Math.max(1, 1 + cardStats.incorrect - cardStats.correct * 0.5);
  };

  return (
    <StatsContext.Provider value={{ stats, updateCardStat, calculateWeight }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error("useStats must be used within a StatsProvider");
  }
  return context;
};
