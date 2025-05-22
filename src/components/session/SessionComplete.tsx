import { useTranslations } from 'next-intl';
import React from 'react';

interface SessionCompleteProps {
  onStartNewSession: () => void;
  onReturnHome: () => void;
}

const SessionComplete: React.FC<SessionCompleteProps> = ({
  onStartNewSession,
  onReturnHome
}) => {
  const t = useTranslations('SessionComplete');

  return (
    <div
      className={`mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md`}
    >
      <div className="text-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-20 w-20 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
          {t('title')}
        </h2>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {t('description')}
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={onStartNewSession}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 
                   transition-colors"
        >
          {t('restartButton')}
        </button>

        <button
          onClick={onReturnHome}
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
                   transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          {t('homeButton')}
        </button>
      </div>
    </div>
  );
};

export default SessionComplete;
