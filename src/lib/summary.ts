import type { LanguageModelV3 } from "@ai-sdk/provider";
import { streamText, createUIMessageStreamResponse} from "ai";
import type { AIProvider, LLMProvider } from "./providers";
import { PROVIDER_CONFIG, resolveProvider } from "./providers";
import { getApiKey } from "./api-keys";
import { DEMO_SUMMARY } from "./demo-data";
import { SUMMARY_SYSTEM_PROMPT } from "./prompts";

const MODELS: Record<LLMProvider, () => Promise<LanguageModelV3>> = {
  gemini: async () => {
    const { createGoogleGenerativeAI } = await import("@ai-sdk/google");
    const apiKey = getApiKey(PROVIDER_CONFIG.gemini.envVar);

    return createGoogleGenerativeAI({ apiKey })(PROVIDER_CONFIG.gemini.models.chat);
  },
  openai: async () => {
    const { createOpenAI } = await import("@ai-sdk/openai");
    const apiKey = getApiKey(PROVIDER_CONFIG.openai.envVar);

    return createOpenAI({ apiKey })(PROVIDER_CONFIG.openai.models.chat);
  },
};

async function summarizeWithMock(): Promise<Response> {
  const { createUIMessageStream, createUIMessageStreamResponse } = await import("ai");
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.write({ type: "text-start", id: "mock" });
      writer.write({ type: "text-delta", id: "mock", delta: DEMO_SUMMARY });
      writer.write({ type: "text-end", id: "mock" });
    },
  });
  return createUIMessageStreamResponse({ stream });
}

async function summarizeWithLLM(prompt: string, provider: LLMProvider): Promise<Response> {
  const model = await MODELS[provider]();
  const result = streamText({
    model,
    system: SUMMARY_SYSTEM_PROMPT,
    prompt,
  });
  return createUIMessageStreamResponse({ stream: result.toUIMessageStream() });
}

const SUMMARIZERS: Record<AIProvider, (prompt: string) => Promise<Response>> = {
  mock: summarizeWithMock,
  gemini: (prompt) => summarizeWithLLM(prompt, "gemini"),
  openai: (prompt) => summarizeWithLLM(prompt, "openai"),
};

export async function summarize(prompt: string, providerOverride?: unknown): Promise<Response> {
  const provider = resolveProvider(providerOverride);
  const summarizer = SUMMARIZERS[provider];
  if (!summarizer) throw new Error(`Unknown provider: ${provider}`);
  return summarizer(prompt);
}
