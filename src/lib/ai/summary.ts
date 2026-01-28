import type { ISummaryStrategy } from "@/types/ai";
import type { AIProvider } from "@/lib/config";
import { getStrategyForProvider } from "@/lib/config";
import { DEMO_SUMMARY } from "@/lib/demo-data";

const SUMMARY_SYSTEM_PROMPT =
  "You are a concise assistant. Summarize the user's voice memo transcript into key takeaways and action items. Use markdown: ### Key Takeaways, ### Action Items, and bullet points.";

async function summarizeWithMock(prompt: string): Promise<Response> {
  void prompt;
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

async function summarizeWithLLM(
  prompt: string,
  provider: "gemini" | "openai"
): Promise<Response> {
  const model =
    provider === "gemini"
      ? (await import("@ai-sdk/google")).google("gemini-2.5-flash")
      : (await import("@ai-sdk/openai")).openai("gpt-4o-mini");

  const { streamText, createUIMessageStreamResponse } = await import("ai");
  const result = streamText({
    model,
    system: SUMMARY_SYSTEM_PROMPT,
    prompt,
  });

  return createUIMessageStreamResponse({ stream: result.toUIMessageStream() });
}

const strategies: Record<AIProvider, ISummaryStrategy> = {
  mock: { summarize: summarizeWithMock },
  gemini: { summarize: (prompt: string) => summarizeWithLLM(prompt, "gemini") },
  openai: { summarize: (prompt: string) => summarizeWithLLM(prompt, "openai") },
};

export function getSummaryStrategy(providerOverride?: unknown): ISummaryStrategy {
  return getStrategyForProvider(strategies, providerOverride);
}
