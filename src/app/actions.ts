'use server';

import { getTranscriptionStrategy } from '@/lib/ai/transcription';
import { isValidFile } from '@/lib/validation';

export async function transcribeAudio(formData: FormData) {
  try {
    const file = formData.get('file');

    if (!isValidFile(file)) {
      return { success: false, error: 'Invalid or missing audio file' };
    }

    const text = await getTranscriptionStrategy().transcribe(file);

    return { success: true, text };
  } catch (error) {
    console.error('Transcription error:', error);
    return { success: false, error: 'Transcription failed' };
  }
}