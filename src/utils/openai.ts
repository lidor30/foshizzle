import crypto from 'crypto'
import OpenAI from 'openai'
import { audioFileExists, getAudioFileURL, uploadAudioFile } from './firebase'

// Initialize OpenAI client
const apiKey = process.env.OPENAI_API_KEY || ''
const isEnabled = process.env.ENABLE_OPENAI_TTS === 'true'
const openai = new OpenAI({ apiKey })

// Create a hash of the text to use as filename
const getTextHash = (text: string, voice: string): string => {
  return crypto.createHash('md5').update(`${text}-${voice}`).digest('hex')
}

export interface TTSOptions {
  voice?: 'coral' | 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  model?: 'gpt-4o-mini-tts' | 'tts-1' | 'tts-1-hd'
}

/**
 * Generate speech from text and cache it in Firebase Storage
 * @param text Text to convert to speech
 * @param options TTS options (voice, model)
 * @returns URL to the audio file
 */
export const generateSpeech = async (
  text: string,
  options: TTSOptions = {}
): Promise<string> => {
  if (!text.trim()) return ''

  // Check if OpenAI TTS is enabled
  if (!isEnabled) {
    console.warn(
      'OpenAI TTS is disabled. Set ENABLE_OPENAI_TTS=true in .env to enable it.'
    )
    return ''
  }

  // Default options
  const voice = options.voice || 'coral'
  const model = options.model || 'gpt-4o-mini-tts'

  // Generate hash for the text and voice
  const textHash = getTextHash(text, voice)

  // Check if audio already exists in Firebase Storage
  if (await audioFileExists(textHash)) {
    return await getAudioFileURL(textHash)
  }

  const instructions =
    'הקול צריך להיות בעברית.\nהקול צריך להיות נעים לשמיעה, השימוש הוא עבור משחק לילדים בגיל 5.\nהקצב צריך להיות יחסית איטי והקול צריך להיות ברור ושמח.'

  try {
    // Generate speech with OpenAI
    const mp3 = await openai.audio.speech.create({
      model,
      voice,
      instructions,
      input: text
    })

    // Get the binary data
    const buffer = Buffer.from(await mp3.arrayBuffer())

    // Save to Firebase Storage with metadata
    const metadata = {
      text,
      voice,
      model,
      timestamp: new Date().toISOString()
    }

    // Upload file to Firebase Storage
    return await uploadAudioFile(textHash, buffer, metadata)
  } catch (error) {
    console.error('Error generating speech:', error)
    return ''
  }
}

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
      )
      return
    }

    const audioUrl = await generateSpeech(text, options)
    if (!audioUrl) return

    const audio = new Audio(audioUrl)
    await audio.play()
  } catch (error) {
    console.error('Error speaking text:', error)
  }
}
