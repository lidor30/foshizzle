import { listTTSCacheEntries } from '@/utils/firebase';
import { generateSpeech } from '@/utils/openai';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const isEnabled = process.env.ENABLE_OPENAI_TTS === 'true';

export async function POST(request: NextRequest) {
  if (!isEnabled) {
    return NextResponse.json(
      {
        error:
          'OpenAI TTS is disabled. Set ENABLE_OPENAI_TTS=true in .env to enable it.'
      },
      { status: 400 }
    );
  }

  try {
    const { text, voice, model } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const audioUrl = await generateSpeech(text, { voice, model });

    if (!audioUrl) {
      return NextResponse.json(
        { error: 'Failed to generate speech' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: audioUrl });
  } catch (error) {
    console.error('Error in TTS API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Route to serve cached audio files
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const fileHash = url.searchParams.get('file');
    const listAll = url.searchParams.get('list') === 'true';

    // If list=true is provided, return all cache entries
    if (listAll) {
      const entries = await listTTSCacheEntries();
      return NextResponse.json({ entries });
    }

    if (!fileHash) {
      return NextResponse.json(
        { error: 'File hash is required' },
        { status: 400 }
      );
    }

    const cacheDir = path.join(process.cwd(), 'public', 'cache', 'tts');
    const filePath = path.join(cacheDir, `${fileHash}.mp3`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `inline; filename="${fileHash}.mp3"`
      }
    });
  } catch (error) {
    console.error('Error serving audio file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
