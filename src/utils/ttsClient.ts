import { TTSOptions } from './openai';

// Cache for audio URLs
interface AudioCache {
  [key: string]: string;
}

const audioCache: AudioCache = {};

let currentAudio: HTMLAudioElement | null = null;

// IndexedDB constants
const DB_NAME = 'tts-cache';
const STORE_NAME = 'audio-files';
const DB_VERSION = 1;
const MAX_CACHE_SIZE = 500 * 1024; // 500KB
const MAX_CACHE_ENTRIES = 500;

const isIndexedDBAvailable = (): boolean => {
  try {
    return !!window.indexedDB;
  } catch (e) {
    console.error('IndexedDB not available:', e);
    return false;
  }
};

let isDBWorking = false;

const testIndexedDB = async (): Promise<boolean> => {
  if (!isIndexedDBAvailable()) {
    console.error('IndexedDB is not available in this browser');
    return false;
  }

  if (window.isSecureContext === false) {
    console.warn(
      'Not in a secure context, IndexedDB might have limited functionality'
    );
  }

  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const { usage, quota } = await navigator.storage.estimate();

      const percentUsed = (usage! / quota!) * 100;
      if (percentUsed > 90) {
        console.warn(
          'Storage usage is very high, may affect IndexedDB functionality'
        );
      }

      if (
        'persist' in navigator.storage &&
        (await navigator.storage.persisted()) === false
      ) {
        try {
          await navigator.storage.persist();
        } catch (e) {
          console.warn('Error requesting persistent storage:', e);
        }
      }
    }
  } catch (quotaError) {
    console.warn('Error checking storage quota:', quotaError);
  }

  try {
    const db = await initDB();
    const testKey = '_test_key_';
    const testBlob = new Blob(['test'], { type: 'text/plain' });

    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve) => {
      const request = store.put({
        key: testKey,
        blob: testBlob,
        timestamp: Date.now()
      });

      request.onsuccess = async () => {
        try {
          const readTransaction = db.transaction([STORE_NAME], 'readonly');
          const readStore = readTransaction.objectStore(STORE_NAME);
          const readRequest = readStore.get(testKey);

          readRequest.onsuccess = () => {
            const success = !!readRequest.result;

            const cleanupTransaction = db.transaction(
              [STORE_NAME],
              'readwrite'
            );
            const cleanupStore = cleanupTransaction.objectStore(STORE_NAME);
            cleanupStore.delete(testKey);

            resolve(success);
          };

          readRequest.onerror = (event) => {
            console.error('Error reading test entry from IndexedDB:', event);
            resolve(false);
          };
        } catch (readError) {
          console.error('Error setting up read test:', readError);
          resolve(false);
        }
      };

      request.onerror = (event) => {
        console.error('Error writing test entry to IndexedDB:', event);
        resolve(false);
      };
    });
  } catch (error) {
    console.error('Error testing IndexedDB:', error);
    return false;
  }
};

// Initialize IndexedDB functionality test
(async () => {
  isDBWorking = await testIndexedDB();
})();

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
  if (!isDBWorking) {
    return null;
  }

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
  if (!isDBWorking) {
    return;
  }

  if (audioBlob.size > MAX_CACHE_SIZE) {
    return;
  }

  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const { usage, quota } = await navigator.storage.estimate();
      const available = quota! - usage!;

      if (audioBlob.size > available) {
        console.warn(
          `Not enough storage space available. Need: ${audioBlob.size}, Available: ${available}`
        );
        return;
      }
    }
  } catch (quotaError) {
    console.warn('Error checking storage quota:', quotaError);
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

      transaction.onerror = (event) => {
        console.error('Transaction error when storing in IndexedDB:', event);
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

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('audio/')) {
      try {
        const audioBlob = await response.blob();

        // Store in IndexedDB if appropriate size
        if (audioBlob.size > 0 && audioBlob.size <= MAX_CACHE_SIZE) {
          await storeAudioInIndexedDB(cacheKey, audioBlob);
        }

        // Create blob URL and cache in memory
        const audioUrl = createAudioUrlFromBlob(audioBlob);
        audioCache[cacheKey] = audioUrl;

        return audioUrl;
      } catch (blobError) {
        console.error('Error processing audio blob from API:', blobError);
        // If error processing blob, try the legacy approach (URL)
        return handleLegacyUrlResponse(response, cacheKey);
      }
    } else {
      // Legacy approach: API returns a URL
      return handleLegacyUrlResponse(response, cacheKey);
    }
  } catch (error) {
    console.error('Error generating speech:', error);
    return '';
  }
};

// Handle the legacy response format where API returns a URL
const handleLegacyUrlResponse = async (
  response: Response,
  cacheKey: string
): Promise<string> => {
  try {
    const data = await response.json();
    audioCache[cacheKey] = data.url;
    return data.url;
  } catch (jsonError) {
    console.error('Error parsing JSON response:', jsonError);
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

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }

    const audioUrl = await generateSpeech(text, options);
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    currentAudio = audio;
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
