import type { ITranscriptionStrategy } from '@/types/ai';
import { AppConfig } from '@/lib/config';
import { DEMO_TRANSCRIPT } from '@/lib/demo-data';

function transcribeWithMock(file: File): Promise<string> {
  void file;
  return Promise.resolve(DEMO_TRANSCRIPT);
}

async function transcribeWithGemini(file: File): Promise<string> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const arrayBuffer = await file.arrayBuffer();
  const base64Audio = Buffer.from(arrayBuffer).toString('base64');

  const result = await model.generateContent([
    { inlineData: { mimeType: 'audio/mp3', data: base64Audio } },
    { text: 'Transcribe this audio exactly.' },
  ]);

  return result.response.text();
}

const mockTranscriptionStrategy: ITranscriptionStrategy = { transcribe: transcribeWithMock };
const geminiTranscriptionStrategy: ITranscriptionStrategy = { transcribe: transcribeWithGemini };

export function getTranscriptionStrategy(): ITranscriptionStrategy {
  return AppConfig.aiProvider === 'mock' ? mockTranscriptionStrategy : geminiTranscriptionStrategy;
}
