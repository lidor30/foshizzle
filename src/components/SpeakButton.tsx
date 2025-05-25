import { TTSOptions } from '@/utils/openai'
import { speakText } from '@/utils/ttsClient'
import React, { useEffect, useState } from 'react'

interface SpeakButtonProps {
  text: string
  options?: TTSOptions
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  options = {},
  className = '',
  onClick
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isTTSDisabled, setIsTTSDisabled] = useState(false)

  // Check if TTS is enabled on the client side
  useEffect(() => {
    const checkTTSAvailability = async () => {
      try {
        // Try to fetch from the TTS API as a check
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: 'test' })
        })

        // If status is 400 and the error is about TTS being disabled
        if (response.status === 400) {
          const data = await response.json()
          if (data.error?.includes('OpenAI TTS is disabled')) {
            setIsTTSDisabled(true)
          }
        }
      } catch (error) {
        console.error('Error checking TTS availability:', error)
      }
    }

    checkTTSAvailability()
  }, [])

  const handleClick = async (e: React.MouseEvent) => {
    // Prevent default behavior (like card flipping)
    e.stopPropagation()

    // Don't try to play if TTS is disabled, already playing, or if text is empty
    if (isTTSDisabled || isPlaying || !text.trim()) return

    // Call the provided onClick if any
    if (onClick) {
      onClick(e)
    }

    try {
      setIsPlaying(true)

      // Speak the text
      await speakText(text, options)

      // Add a small delay before allowing to play again
      setTimeout(() => {
        setIsPlaying(false)
      }, 500)
    } catch (error) {
      console.error('Error speaking text:', error)
      setIsPlaying(false)
    }
  }

  // Don't render the button if TTS is disabled
  if (isTTSDisabled) {
    return null
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2 text-gray-600 hover:text-blue-500 focus:outline-none ${
        isPlaying ? 'text-blue-500' : ''
      } ${className}`}
      aria-label="Read text aloud"
      disabled={isPlaying || !text.trim()}
      title="Read text aloud"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 ${isPlaying ? 'animate-pulse' : ''}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  )
}

export default SpeakButton
