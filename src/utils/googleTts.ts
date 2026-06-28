import crypto from 'crypto'
import { audioFileExists, getAudioFileURL, uploadAudioFile } from './firebase'

const apiKey = process.env.GOOGLE_API_KEY || ''

const getTextHash = (text: string, voice: string): string => {
  return crypto.createHash('md5').update(`${text}-${voice}`).digest('hex')
}

const LOCALE_CONFIG: Record<string, { languageCode: string; defaultVoice: string }> = {
  he: { languageCode: 'he-IL', defaultVoice: 'he-IL-Chirp3-HD-Aoede' },
  en: { languageCode: 'en-US', defaultVoice: 'en-US-Chirp3-HD-Kore' }
}

export interface TTSOptions {
  locale?: 'en' | 'he'
  voice?: string
}

/**
 * Generate speech from text using Google Cloud TTS and cache in Firebase Storage
 */
export const generateSpeech = async (
  text: string,
  options: TTSOptions = {}
): Promise<string> => {
  if (!text.trim()) return ''

  const config = LOCALE_CONFIG[options.locale ?? 'he'] ?? LOCALE_CONFIG.he
  const voice = options.voice ?? config.defaultVoice
  const { languageCode } = config
  const textHash = getTextHash(text, voice)

  if (await audioFileExists(textHash)) {
    return await getAudioFileURL(textHash)
  }

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode, name: voice },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.9,
            pitch: 0.0,
            effectsProfileId: ['headphone-class-device']
          }
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Google Cloud TTS error:', error)
      return ''
    }

    const data = await response.json()
    const buffer = Buffer.from(data.audioContent, 'base64')

    return await uploadAudioFile(textHash, buffer, {
      text,
      voice,
      languageCode,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error generating speech:', error)
    return ''
  }
}

/**
 * Play audio from text
 */
export const speakText = async (
  text: string,
  options: TTSOptions = {}
): Promise<void> => {
  try {
    const audioUrl = await generateSpeech(text, options)
    if (!audioUrl) return

    const audio = new Audio(audioUrl)
    await audio.play()
  } catch (error) {
    console.error('Error speaking text:', error)
  }
}
