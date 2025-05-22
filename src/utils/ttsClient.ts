import { TTSOptions } from './openai';

// Cache for audio URLs
interface AudioCache {
  [key: string]: string;
}

const audioCache: AudioCache = {};

// Create a hash of the text to use as cache key
const createCacheKey = (text: string, voice?: string): string => {
  return `${text}-${voice || 'nova'}`;
};

/**
 * Generate speech from text using the API
 * @param text Text to convert to speech
 * @param options TTS options (voice, model)
 * @returns URL to the audio file
 */
export const generateSpeech = async (
  text: string,
  options: TTSOptions = {}
): Promise<string> => {
  if (!text.trim()) return '';

  const cacheKey = createCacheKey(text, options.voice);

  // Check if URL is already in memory cache
  if (audioCache[cacheKey]) {
    return audioCache[cacheKey];
  }

  try {
    // Call the API to generate speech
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        voice: options.voice,
        model: options.model
      })
    });

    if (!response.ok) {
      const error = await response.json();

      if (
        response.status === 400 &&
        error.error?.includes('OpenAI TTS is disabled')
      ) {
        console.warn(error.error);
        return '';
      }

      throw new Error(error.error || 'Failed to generate speech');
    }

    const data = await response.json();

    // Store URL in memory cache
    audioCache[cacheKey] = data.url;

    return data.url;
  } catch (error) {
    console.error('Error generating speech:', error);
    return '';
  }
};

/**
 * Play audio from text
 * @param text Text to speak
 * @param options TTS options
 */
export const speakText = async (
  text: string,
  options: TTSOptions = {}
): Promise<void> => {
  try {
    // Don't attempt to speak empty text
    if (!text.trim()) return;

    const audioUrl = await generateSpeech(text, options);
    if (!audioUrl) return;

    // Play the audio
    const audio = new Audio(audioUrl);
    await audio.play();
  } catch (error) {
    console.error('Error speaking text:', error);
  }
};
