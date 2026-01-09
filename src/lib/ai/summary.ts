import type { ISummaryStrategy } from '@/types/ai';
import { AppConfig } from '@/lib/config';
import { DEMO_SUMMARY } from '@/lib/demo-data';

async function summarizeWithMock(prompt: string): Promise<Response> {
  void prompt;
  const { createUIMessageStream, createUIMessageStreamResponse } = await import('ai');
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.write({ type: 'text-start', id: 'mock' });
      writer.write({ type: 'text-delta', id: 'mock', delta: DEMO_SUMMARY });
      writer.write({ type: 'text-end', id: 'mock' });
    },
  });
  return createUIMessageStreamResponse({ stream });
}

async function summarizeWithGemini(prompt: string): Promise<Response> {
  const { google } = await import('@ai-sdk/google');
  const { streamText, createUIMessageStreamResponse } = await import('ai');

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: `You are a concise assistant. Summarize the user's voice memo transcript into key takeaways and action items. Use markdown: ### Key Takeaways, ### Action Items, and bullet points.`,
    prompt,
  });

  return createUIMessageStreamResponse({ stream: result.toUIMessageStream() });
}

const mockSummaryStrategy: ISummaryStrategy = { summarize: summarizeWithMock };
const geminiSummaryStrategy: ISummaryStrategy = { summarize: summarizeWithGemini };

export function getSummaryStrategy(): ISummaryStrategy {
  return AppConfig.aiProvider === 'mock' ? mockSummaryStrategy : geminiSummaryStrategy;
}
