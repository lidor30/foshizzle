import { TTSOptions } from './openai';

// Cache for audio URLs
interface AudioCache {
  [key: string]: string;
}

const audioCache: AudioCache = {};

// IndexedDB constants
const DB_NAME = 'tts-cache';
const STORE_NAME = 'audio-files';
const DB_VERSION = 1;
const MAX_CACHE_SIZE = 500 * 1024; // 500KB
const MAX_CACHE_ENTRIES = 500;

const createCacheKey = (text: string, voice?: string): string => {
  return `${text}-${voice || 'nova'}`;
};

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event);
      reject(new Error('Could not open IndexedDB'));
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
};

const getAudioFromIndexedDB = async (
  cacheKey: string
): Promise<Blob | null> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(cacheKey);

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.blob);
        } else {
          resolve(null);
        }
      };

      request.onerror = (event) => {
        console.error('Error getting from IndexedDB:', event);
        reject(new Error('Failed to retrieve from IndexedDB'));
      };
    });
  } catch (error) {
    console.error('IndexedDB access error:', error);
    return null;
  }
};

const cleanupOldCacheEntries = async (): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const countRequest = store.count();

    countRequest.onsuccess = async () => {
      const count = countRequest.result;
      if (count <= MAX_CACHE_ENTRIES) return;

      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = async () => {
        const entries = getAllRequest.result;
        // Sort by timestamp (oldest first)
        entries.sort((a, b) => a.timestamp - b.timestamp);

        // Calculate how many to remove
        const removeCount = count - MAX_CACHE_ENTRIES;
        const keysToRemove = entries
          .slice(0, removeCount)
          .map((entry) => entry.key);

        // Delete old entries
        const writeTransaction = db.transaction([STORE_NAME], 'readwrite');
        const writeStore = writeTransaction.objectStore(STORE_NAME);

        for (const key of keysToRemove) {
          writeStore.delete(key);
        }
      };
    };
  } catch (error) {
    console.error('Error cleaning up cache:', error);
  }
};

const storeAudioInIndexedDB = async (
  cacheKey: string,
  audioBlob: Blob
): Promise<void> => {
  if (audioBlob.size > MAX_CACHE_SIZE) {
    return;
  }

  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({
        key: cacheKey,
        blob: audioBlob,
        timestamp: Date.now()
      });

      request.onsuccess = () => {
        resolve();
        cleanupOldCacheEntries();
      };

      request.onerror = (event) => {
        console.error('Error storing in IndexedDB:', event);
        reject(new Error('Failed to store in IndexedDB'));
      };
    });
  } catch (error) {
    console.error('IndexedDB storage error:', error);
  }
};

const createAudioUrlFromBlob = (blob: Blob): string => {
  return URL.createObjectURL(blob);
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

  const cachedAudio = await getAudioFromIndexedDB(cacheKey);
  if (cachedAudio) {
    const audioUrl = createAudioUrlFromBlob(cachedAudio);
    audioCache[cacheKey] = audioUrl;
    return audioUrl;
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

    // Fetch the audio file as blob
    try {
      const audioResponse = await fetch(data.url);
      const audioBlob = await audioResponse.blob();

      await storeAudioInIndexedDB(cacheKey, audioBlob);
      const audioUrl = createAudioUrlFromBlob(audioBlob);
      audioCache[cacheKey] = audioUrl;

      return audioUrl;
    } catch (blobError) {
      console.error('Error fetching or storing audio blob:', blobError);
      // Fall back to the original URL if blob handling fails
      audioCache[cacheKey] = data.url;
      return data.url;
    }
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

export const clearTTSCache = async (): Promise<void> => {
  // Clear memory cache
  Object.keys(audioCache).forEach((key) => {
    // Revoke object URLs to prevent memory leaks
    if (audioCache[key].startsWith('blob:')) {
      URL.revokeObjectURL(audioCache[key]);
    }
    delete audioCache[key];
  });

  // Clear IndexedDB cache
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.clear();

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log('TTS cache cleared successfully');
        resolve();
      };

      transaction.onerror = (event) => {
        console.error('Error clearing TTS cache:', event);
        reject(new Error('Failed to clear TTS cache'));
      };
    });
  } catch (error) {
    console.error('Error accessing IndexedDB:', error);
  }
};
