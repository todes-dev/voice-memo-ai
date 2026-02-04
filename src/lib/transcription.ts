import type { AIProvider,  } from "./providers";
import { resolveProvider, PROVIDER_CONFIG } from "./providers";
import { getApiKey } from "./api-keys";
import { DEMO_TRANSCRIPT } from "./demo-data";
import { TRANSCRIBE_PROMPT } from "./prompts";

async function transcribeWithMock(): Promise<string> {
  return DEMO_TRANSCRIPT;
}

async function transcribeWithGemini(file: File): Promise<string> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");

  const apiKey = getApiKey(PROVIDER_CONFIG.gemini.envVar);
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({ model: PROVIDER_CONFIG.gemini.models.audio });

  const arrayBuffer = await file.arrayBuffer();
  const base64Audio = Buffer.from(arrayBuffer).toString("base64");

  const result = await model.generateContent([
    { inlineData: { mimeType: file.type, data: base64Audio } },
    { text: TRANSCRIBE_PROMPT },
  ]);

  return result.response.text();
}

async function transcribeWithOpenAI(file: File): Promise<string> {
  const { experimental_transcribe: transcribe } = await import("ai");
  const { createOpenAI } = await import("@ai-sdk/openai");

  const apiKey = getApiKey(PROVIDER_CONFIG.openai.envVar);
  const openai = createOpenAI({ apiKey });

  const transcript = await transcribe({
    model: openai.transcription(PROVIDER_CONFIG.openai.models.audio),
    audio: await file.arrayBuffer(),
  });

  return transcript.text;
}

const TRANSCRIBERS: Record<AIProvider, (file: File) => Promise<string>> = {
  mock: transcribeWithMock,
  gemini: transcribeWithGemini,
  openai: transcribeWithOpenAI,
};

export async function transcribe(file: File, providerOverride?: unknown): Promise<string> {
  const provider = resolveProvider(providerOverride);
  const transcriber = TRANSCRIBERS[provider];
  if (!transcriber) throw new Error(`Unknown provider: ${provider}`);
  return transcriber(file);
}
