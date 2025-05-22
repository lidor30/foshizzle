import crypto from 'crypto';
import fs from 'fs';
import OpenAI from 'openai';
import path from 'path';

// Initialize OpenAI client
const apiKey = process.env.OPENAI_API_KEY || '';
const isEnabled = process.env.ENABLE_OPENAI_TTS === 'true';
const openai = new OpenAI({ apiKey });

// Cache directory
const CACHE_DIR = path.join(process.cwd(), 'public', 'cache', 'tts');

// Ensure cache directory exists
if (typeof window === 'undefined') {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating cache directory:', error);
  }
}

// Create a hash of the text to use as filename
const getTextHash = (text: string, voice: string): string => {
  return crypto.createHash('md5').update(`${text}-${voice}`).digest('hex');
};

// Get cached file path
const getCachedFilePath = (textHash: string): string => {
  return path.join(CACHE_DIR, `${textHash}.mp3`);
};

// Check if audio exists in cache
const isAudioCached = (textHash: string): boolean => {
  if (typeof window !== 'undefined') return false;
  const filePath = getCachedFilePath(textHash);

  return fs.existsSync(filePath);
};

// Get public URL for cached file
const getCachedFileUrl = (textHash: string): string => {
  return `/cache/tts/${textHash}.mp3`;
};

export interface TTSOptions {
  voice?: 'coral' | 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  model?: 'gpt-4o-mini-tts' | 'tts-1' | 'tts-1-hd';
}

/**
 * Generate speech from text and cache it
 * @param text Text to convert to speech
 * @param options TTS options (voice, model)
 * @returns URL to the audio file
 */
export const generateSpeech = async (
  text: string,
  options: TTSOptions = {}
): Promise<string> => {
  if (!text.trim()) return '';

  // Check if OpenAI TTS is enabled
  if (!isEnabled) {
    console.warn(
      'OpenAI TTS is disabled. Set ENABLE_OPENAI_TTS=true in .env to enable it.'
    );
    return '';
  }

  // Default options
  const voice = options.voice || 'coral';
  const model = options.model || 'gpt-4o-mini-tts';

  // Generate hash for the text and voice
  const textHash = getTextHash(text, voice);

  // Check if audio already exists in cache
  if (isAudioCached(textHash)) {
    return getCachedFileUrl(textHash);
  }

  const instructions =
    'הקול צריך להיות בעברית.\nהקול צריך להיות נעים לשמיעה, השימוש הוא עבור משחק לילדים בגיל 5.\nהקצב צריך להיות יחסית איטי והקול צריך להיות ברור ושמח.';

  try {
    // Generate speech with OpenAI
    const mp3 = await openai.audio.speech.create({
      model,
      voice,
      instructions,
      input: text
    });

    // Get the binary data
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Save to cache
    if (typeof window === 'undefined') {
      fs.writeFileSync(getCachedFilePath(textHash), buffer);
    }

    return getCachedFileUrl(textHash);
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
    if (!isEnabled) {
      console.warn(
        'OpenAI TTS is disabled. Set ENABLE_OPENAI_TTS=true in .env to enable it.'
      );
      return;
    }

    const audioUrl = await generateSpeech(text, options);
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    await audio.play();
  } catch (error) {
    console.error('Error speaking text:', error);
  }
};
