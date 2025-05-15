import React, { useEffect, useRef, useState } from "react";
import { useTTS } from "../contexts/TTSContext";

interface VoiceSelectorProps {
  className?: string;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ className = "" }) => {
  const { voices, selectedVoice, setSelectedVoice } = useTTS();
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const voiceSelectorRef = useRef<HTMLDivElement>(null);

  // Close voice selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        voiceSelectorRef.current &&
        !voiceSelectorRef.current.contains(event.target as Node)
      ) {
        setShowVoiceSelector(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle voice selector
  const toggleVoiceSelector = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowVoiceSelector((prev) => !prev);
  };

  // Select a voice
  const selectVoice = (voiceName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVoice(voiceName);
    setShowVoiceSelector(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleVoiceSelector}
        className="p-2 text-gray-600 hover:text-blue-500 focus:outline-none"
        aria-label="Select voice"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>

      {/* Voice Selector Dropdown */}
      {showVoiceSelector && (
        <div
          ref={voiceSelectorRef}
          className="absolute right-0 top-0 mt-8 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10 max-h-60 overflow-y-auto"
        >
          <div className="py-1">
            <p className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              Select a voice
            </p>
            {voices.length === 0 ? (
              <p className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                Loading voices...
              </p>
            ) : (
              voices.map((voice) => (
                <button
                  key={voice.name}
                  onClick={(e) => selectVoice(voice.name, e)}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    selectedVoice === voice.name
                      ? "bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-200"
                  } hover:bg-gray-100 dark:hover:bg-gray-600`}
                >
                  {voice.name} ({voice.lang})
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceSelector;
