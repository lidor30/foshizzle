import crypto from 'crypto'
import { audioFileExists, getAudioFileURL, uploadAudioFile } from './firebase'

const apiKey = process.env.GOOGLE_API_KEY || ''

const getTextHash = (text: string, voice: string): string => {
  return crypto.createHash('md5').update(`${text}-${voice}`).digest('hex')
}

export interface TTSOptions {
  voice?:
    | 'he-IL-Chirp3-HD-Achernar'
    | 'he-IL-Chirp3-HD-Achird'
    | 'he-IL-Chirp3-HD-Algenib'
    | 'he-IL-Chirp3-HD-Algieba'
    | 'he-IL-Chirp3-HD-Alnilam'
    | 'he-IL-Chirp3-HD-Aoede'
    | 'he-IL-Chirp3-HD-Autonoe'
    | 'he-IL-Chirp3-HD-Callirrhoe'
    | 'he-IL-Chirp3-HD-Charon'
    | 'he-IL-Chirp3-HD-Despina'
    | 'he-IL-Chirp3-HD-Enceladus'
    | 'he-IL-Chirp3-HD-Erinome'
    | 'he-IL-Chirp3-HD-Fenrir'
    | 'he-IL-Chirp3-HD-Gacrux'
    | 'he-IL-Chirp3-HD-Iapetus'
    | 'he-IL-Chirp3-HD-Kore'
    | 'he-IL-Chirp3-HD-Laomedeia'
    | 'he-IL-Chirp3-HD-Leda'
    | 'he-IL-Chirp3-HD-Orus'
    | 'he-IL-Chirp3-HD-Pulcherrima'
    | 'he-IL-Chirp3-HD-Puck'
    | 'he-IL-Chirp3-HD-Rasalgethi'
    | 'he-IL-Chirp3-HD-Sadachbia'
    | 'he-IL-Chirp3-HD-Sadaltager'
    | 'he-IL-Chirp3-HD-Schedar'
    | 'he-IL-Chirp3-HD-Sulafat'
    | 'he-IL-Chirp3-HD-Umbriel'
    | 'he-IL-Chirp3-HD-Vindemiatrix'
    | 'he-IL-Chirp3-HD-Zephyr'
    | 'he-IL-Chirp3-HD-Zubenelgenubi'
    | 'he-IL-Wavenet-A'
    | 'he-IL-Wavenet-B'
    | 'he-IL-Wavenet-C'
    | 'he-IL-Wavenet-D'
    | 'he-IL-Standard-A'
    | 'he-IL-Standard-B'
    | 'he-IL-Standard-C'
    | 'he-IL-Standard-D'
  languageCode?: string
}

/**
 * Generate speech from text using Google Cloud TTS and cache in Firebase Storage
 */
export const generateSpeech = async (
  text: string,
  options: TTSOptions = {}
): Promise<string> => {
  if (!text.trim()) return ''

  const voice = options.voice || 'he-IL-Chirp3-HD-Aoede'
  const languageCode = options.languageCode || 'he-IL'
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

    const metadata = {
      text,
      voice,
      languageCode,
      timestamp: new Date().toISOString()
    }

    return await uploadAudioFile(textHash, buffer, metadata)
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
