import type { ReactNode } from "react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface TTSContextType {
  voices: SpeechSynthesisVoice[];
  selectedVoice: string | null;
  setSelectedVoice: (voice: string | null) => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

interface TTSProviderProps {
  children: ReactNode;
}

export const TTSProvider: React.FC<TTSProviderProps> = ({ children }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Load voices right away
    loadVoices();

    // Chrome needs this event to load voices
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Load saved voice preference from localStorage
  useEffect(() => {
    const savedVoice = localStorage.getItem("selectedVoice");
    if (savedVoice) {
      setSelectedVoice(savedVoice);
    }
  }, []);

  // Save voice preference to localStorage when it changes
  useEffect(() => {
    if (selectedVoice) {
      localStorage.setItem("selectedVoice", selectedVoice);
    }
  }, [selectedVoice]);

  const speakText = useCallback(
    (text: string) => {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "he-IL"; // Set language to Hebrew

      let bestVoice: SpeechSynthesisVoice | undefined;

      // If user has selected a voice, use that
      if (selectedVoice) {
        bestVoice = voices.find((voice) => voice.name === selectedVoice);
      }

      // Otherwise try to find the best Hebrew voice
      if (!bestVoice) {
        // First look for premium/enhanced voices that tend to sound more natural
        bestVoice = voices.find(
          (voice) =>
            (voice.lang.includes("he") || voice.lang.includes("iw")) &&
            (voice.name.includes("Premium") ||
              voice.name.includes("Enhanced") ||
              voice.name.includes("Natural") ||
              voice.name.toLowerCase().includes("neural"))
        );

        // If no premium voice, try any Hebrew voice
        if (!bestVoice) {
          bestVoice = voices.find(
            (voice) => voice.lang.includes("he") || voice.lang.includes("iw")
          );
        }

        // If still no voice, try a general voice
        if (!bestVoice && voices.length > 0) {
          // Some voices sound more natural than others
          bestVoice =
            voices.find(
              (voice) =>
                voice.name.includes("Samantha") ||
                voice.name.includes("Google") ||
                voice.name.includes("Daniel")
            ) || voices[0];
        }
      }

      if (bestVoice) {
        speech.voice = bestVoice;
        console.log(`Using voice: ${bestVoice.name} (${bestVoice.lang})`);
      }

      // Adjust parameters for more natural speech
      speech.rate = 0.95; // Slightly slower than default (1.0)
      speech.pitch = 1.05; // Slightly higher pitch can sound more natural
      speech.volume = 1.0; // Full volume

      window.speechSynthesis.speak(speech);
    },
    [voices, selectedVoice]
  );

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  const value = {
    voices,
    selectedVoice,
    setSelectedVoice,
    speakText,
    stopSpeaking,
  };

  return <TTSContext.Provider value={value}>{children}</TTSContext.Provider>;
};

export const useTTS = (): TTSContextType => {
  const context = useContext(TTSContext);
  if (context === undefined) {
    throw new Error("useTTS must be used within a TTSProvider");
  }
  return context;
};
