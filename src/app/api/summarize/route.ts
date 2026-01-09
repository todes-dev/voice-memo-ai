import { getSummaryStrategy } from '@/lib/ai/summary';
import { extractPrompt } from '@/lib/validation';

export const maxDuration = 30;

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt = extractPrompt(body);

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing or empty prompt' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    return await getSummaryStrategy().summarize(prompt);
  } catch (error) {
    console.error('Error in summarize route:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while generating the summary' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}