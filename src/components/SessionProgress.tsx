import React from "react";

interface SessionProgressProps {
  current: number;
  total: number;
}

const SessionProgress: React.FC<SessionProgressProps> = ({
  current,
  total,
}) => {
  const progressPercentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-sm">
        <span className="text-gray-700 dark:text-gray-300">
          Card {current} of {total}
        </span>
        <span className="text-gray-700 dark:text-gray-300">
          {progressPercentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SessionProgress;
