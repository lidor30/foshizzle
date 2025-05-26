'use client'

import { APP_VERSION } from '@/constants/app'
import { useKidsMode } from '@/context/KidsModeContext'
import { DifficultyLevel } from '@/types/questions'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type Topic = {
  id: string
  name: string
  icon?: string
  kidsMode?: boolean
}

type TopicSelectorProps = {
  onStartSession?: (
    selectedTopicIds: string[],
    difficulty: DifficultyLevel
  ) => void
}

export default function TopicSelector({ onStartSession }: TopicSelectorProps) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTopics, setSelectedTopics] = useState<{
    [id: string]: boolean
  }>({})
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyLevel>('medium')
  const t = useTranslations('TopicSelector')
  const locale = useLocale()
  const { kidsMode } = useKidsMode()

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(`/${locale}/api/topics`)
        if (!response.ok) {
          throw new Error('Failed to fetch topics')
        }
        const data = await response.json()
        setTopics(data)
      } catch (error) {
        console.error('Error fetching topics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [locale])

  // Filter topics based on kids mode
  useEffect(() => {
    if (kidsMode) {
      const kidsFriendlyTopics = topics.filter((topic) => topic.kidsMode)
      setFilteredTopics(kidsFriendlyTopics)
    } else {
      setFilteredTopics(topics)
    }
  }, [topics, kidsMode])

  // Update selected topics when kids mode changes
  useEffect(() => {
    if (kidsMode) {
      const kidsFriendlyTopics = topics.filter((topic) => topic.kidsMode)

      // Reset selected topics when switching to kids mode
      // Only keep selections for kid-friendly topics
      setSelectedTopics((prev) => {
        const newSelectedTopics = { ...prev }

        // Keep only the kid-friendly topics that were already selected
        Object.keys(newSelectedTopics).forEach((topicId) => {
          if (!kidsFriendlyTopics.some((topic) => topic.id === topicId)) {
            delete newSelectedTopics[topicId]
          }
        })

        return newSelectedTopics
      })
    }
  }, [kidsMode, topics])

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId]
    }))
  }

  const selectAll = () => {
    const allTopics = filteredTopics.reduce(
      (acc, topic) => {
        acc[topic.id] = true
        return acc
      },
      {} as { [id: string]: boolean }
    )

    setSelectedTopics(allTopics)
  }

  const clearAll = () => {
    setSelectedTopics({})
  }

  const handleStartSession = () => {
    const selectedTopicIds = Object.entries(selectedTopics)
      .filter(([, isSelected]) => isSelected)
      .map(([id]) => id)

    if (selectedTopicIds.length === 0) {
      alert(t('selectAtLeastOne'))
      return
    }

    if (onStartSession) {
      onStartSession(selectedTopicIds, selectedDifficulty)
    }
  }

  const selectedCount = Object.values(selectedTopics).filter(Boolean).length

  if (loading) {
    return <div className="text-white">{t('loading')}</div>
  }

  // Kids mode UI classes
  const kidsModeClasses = kidsMode
    ? {
        title:
          'text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500',
        topicButton: (isSelected: boolean) => `
          transform transition-all duration-300 hover:scale-105
          ${isSelected ? 'text-white bg-gradient-to-r from-green-400 to-blue-500 shadow-lg scale-105' : 'text-slate-900 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900'}
          rounded-xl border-4 border-dashed border-yellow-300 p-4
        `,
        difficultyTitle: 'text-lg font-bold text-center mb-3 text-purple-500',
        difficultyButton: (isSelected: boolean) => `
          transform transition-all duration-300 hover:scale-105
          ${isSelected ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-blue-200 to-cyan-200 dark:from-blue-900 dark:to-cyan-900'}
          rounded-xl border-2 border-pink-300 p-3
        `,
        startButton:
          'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-lg transform transition-all duration-300 hover:scale-105 font-bold'
      }
    : {
        title: 'text-xl font-medium text-slate-900 dark:text-white mb-4',
        topicButton: (isSelected: boolean) => `
          ${isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-gray-200'}
        `,
        difficultyTitle: 'text-md font-medium text-white mb-2',
        difficultyButton: (isSelected: boolean) => `
          ${isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-gray-200'}
        `,
        startButton: 'bg-primary-500 hover:bg-primary-600'
      }

  return (
    <div className="animate-fadeIn">
      <h2 className={kidsModeClasses.title}>{t('title')}</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {filteredTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => toggleTopic(topic.id)}
            className={`flex flex-col gap-3 items-center justify-start px-4 py-3 rounded-md transition-colors text-md font-medium relative
              ${kidsModeClasses.topicButton(!!selectedTopics[topic.id])}`}
          >
            {topic.icon && (
              <div className={`h-10 w-10 flex items-center justify-center`}>
                <Image
                  src={`/images/icons/${topic.icon}`}
                  alt={`${topic.name} icon`}
                  width={40}
                  height={40}
                  className={`object-contain ${selectedTopics[topic.id] ? 'invert' : 'dark:invert'}`}
                />
              </div>
            )}
            <span className="text-sm dark:text-white">{topic.name}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between mb-6">
        <button
          type="button"
          className="text-sm text-primary-500 hover:text-primary-400"
          onClick={selectAll}
        >
          {t('selectAll')}
        </button>
        <button
          type="button"
          className="text-sm text-primary-500 hover:text-primary-400"
          onClick={clearAll}
        >
          {t('clearAll')}
        </button>
      </div>

      <div className="mb-6">
        <h3 className={kidsModeClasses.difficultyTitle}>
          {t('difficultyTitle')}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'easy', label: t('difficulty.easy') },
            { value: 'medium', label: t('difficulty.medium') },
            { value: 'hard', label: t('difficulty.hard') }
          ].map((difficulty) => (
            <button
              key={difficulty.value}
              onClick={() =>
                setSelectedDifficulty(difficulty.value as DifficultyLevel)
              }
              className={`px-4 py-3 rounded-md transition-colors text-md font-medium
                ${selectedDifficulty === difficulty.value ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-gray-200'}
                ${kidsMode && kidsModeClasses.difficultyButton(selectedDifficulty === difficulty.value)}`}
            >
              {difficulty.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={`w-full text-white py-3 px-4 rounded-md
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  ${kidsModeClasses.startButton}`}
        onClick={handleStartSession}
        disabled={selectedCount === 0}
      >
        {selectedCount === 1
          ? t('startButtonWithCount', { count: String(selectedCount) })
          : t('startButtonWithCount_plural', { count: String(selectedCount) })}
      </button>
      <div className="text-end text-xs text-gray-600/40 dark:text-gray-600 pt-6 mt-auto">
        {APP_VERSION}
      </div>
    </div>
  )
}
