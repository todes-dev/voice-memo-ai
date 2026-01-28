export type AIProvider = "mock" | "gemini" | "openai";

const VALID_PROVIDERS: AIProvider[] = ["mock", "gemini", "openai"];

export const AppConfig = {
  get aiProvider(): AIProvider {
    const raw = process.env.AI_PROVIDER || "mock";
    return VALID_PROVIDERS.includes(raw as AIProvider) ? (raw as AIProvider) : "mock";
  },
};

export function resolveProvider(override: unknown): AIProvider {
  const provider = typeof override === "string" ? override.trim().toLowerCase() : "";
  if (provider && VALID_PROVIDERS.includes(provider as AIProvider)) {
    return provider as AIProvider;
  }
  return AppConfig.aiProvider;
}

export function getStrategyForProvider<T>(
  strategies: Record<AIProvider, T>,
  override?: unknown
): T {
  return strategies[resolveProvider(override)];
}