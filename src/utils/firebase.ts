import { initializeApp } from 'firebase/app'
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  getStorage,
  listAll,
  ref,
  uploadBytes
} from 'firebase/storage'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

// Reference to the TTS audio files folder
const getTTSFolderRef = () => ref(storage, 'tts')

/**
 * Upload audio file to Firebase Storage with metadata
 */
export const uploadAudioFile = async (
  fileHash: string,
  buffer: Buffer,
  metadata: Record<string, string>
): Promise<string> => {
  const fileRef = ref(getTTSFolderRef(), `${fileHash}.mp3`)

  await uploadBytes(fileRef, buffer, {
    contentType: 'audio/mpeg',
    customMetadata: metadata
  })

  return await getDownloadURL(fileRef)
}

/**
 * Check if audio file exists in Firebase Storage
 */
export const audioFileExists = async (fileHash: string): Promise<boolean> => {
  try {
    const fileRef = ref(getTTSFolderRef(), `${fileHash}.mp3`)
    await getMetadata(fileRef)
    return true
  } catch {
    return false
  }
}

/**
 * Get download URL for an audio file
 */
export const getAudioFileURL = async (fileHash: string): Promise<string> => {
  const fileRef = ref(getTTSFolderRef(), `${fileHash}.mp3`)
  return await getDownloadURL(fileRef)
}

/**
 * Get metadata for an audio file
 */
export const getAudioFileMetadata = async (
  fileHash: string
): Promise<Record<string, string> | null> => {
  try {
    const fileRef = ref(getTTSFolderRef(), `${fileHash}.mp3`)
    const metadata = await getMetadata(fileRef)
    return metadata.customMetadata || null
  } catch {
    return null
  }
}

/**
 * List all TTS audio files with their metadata
 */
export interface TTSCacheEntry {
  fileHash: string
  downloadURL: string
  metadata: Record<string, string> | null
}

export const listTTSCacheEntries = async (): Promise<TTSCacheEntry[]> => {
  try {
    const folderRef = getTTSFolderRef()
    const result = await listAll(folderRef)

    const entries = await Promise.all(
      result.items.map(async (item) => {
        const fileHash = item.name.replace('.mp3', '')
        const downloadURL = await getDownloadURL(item)
        const metadata = await getAudioFileMetadata(fileHash)

        return {
          fileHash,
          downloadURL,
          metadata
        }
      })
    )

    return entries
  } catch (error) {
    console.error('Error listing TTS cache entries:', error)
    return []
  }
}

/**
 * Delete a TTS audio file from Firebase Storage
 */
export const deleteTTSCacheEntry = async (
  fileHash: string
): Promise<boolean> => {
  try {
    const fileRef = ref(getTTSFolderRef(), `${fileHash}.mp3`)
    await deleteObject(fileRef)
    return true
  } catch (error) {
    console.error('Error deleting TTS cache entry:', error)
    return false
  }
}
