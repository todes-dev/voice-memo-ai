import type { ITranscriptionStrategy } from "@/types/ai";
import type { AIProvider } from "@/lib/config";
import { getStrategyForProvider } from "@/lib/config";
import { DEMO_TRANSCRIPT } from "@/lib/demo-data";

function transcribeWithMock(file: File): Promise<string> {
  void file;
  return Promise.resolve(DEMO_TRANSCRIPT);
}

async function transcribeWithGemini(file: File): Promise<string> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const arrayBuffer = await file.arrayBuffer();
  const base64Audio = Buffer.from(arrayBuffer).toString("base64");

  const result = await model.generateContent([
    { inlineData: { mimeType: "audio/mp3", data: base64Audio } },
    { text: "Transcribe this audio exactly." },
  ]);

  return result.response.text();
}

async function transcribeWithOpenAI(file: File): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("model", "whisper-1");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI Whisper failed: ${res.status} ${err}`);
  }

  const data = (await res.json()) as { text?: string };
  return data.text ?? "";
}

const strategies: Record<AIProvider, ITranscriptionStrategy> = {
  mock: { transcribe: transcribeWithMock },
  gemini: { transcribe: transcribeWithGemini },
  openai: { transcribe: transcribeWithOpenAI },
};

export function getTranscriptionStrategy(providerOverride?: unknown): ITranscriptionStrategy {
  return getStrategyForProvider(strategies, providerOverride);
}
