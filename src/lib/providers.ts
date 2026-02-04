import { hasApiKey } from "./api-keys";

export type AIProvider = "mock" | "gemini" | "openai";
export type LLMProvider = Exclude<AIProvider, "mock">;

export interface ProviderOption {
  value: AIProvider;
  label: string;
}

// Centralized provider configuration with all metadata
export const PROVIDER_CONFIG = {
  gemini: {
    label: "Gemini",
    envVar: "GOOGLE_GENERATIVE_AI_API_KEY",
    priority: 1,
    models: {
      chat: "gemini-2.5-flash",
      audio: "gemini-2.5-flash",
    },
  },
  openai: {
    label: "OpenAI",
    envVar: "OPENAI_API_KEY",
    priority: 2,
    models: {
      chat: "gpt-4o-mini",
      audio: "whisper-1",
    },
  },
  mock: {
    label: "Mock",
    envVar: null,
    priority: 3,
    models: {
      chat: "mock",
      audio: "mock",
    },
  },
} as const;

export function getProviderEnvVar(provider: AIProvider): string | null {
  return PROVIDER_CONFIG[provider]?.envVar ?? null;
}

export function getProviderLabel(provider: AIProvider): string {
  return PROVIDER_CONFIG[provider].label;
}

export function getValidProvidersSync(): AIProvider[] {
  const IS_DEV = process.env.NODE_ENV === "development";

  const available = (Object.keys(PROVIDER_CONFIG) as AIProvider[])
    .filter((p) => {
      if (p === "mock") return IS_DEV;
      return hasApiKey(PROVIDER_CONFIG[p]?.envVar ?? null);
    })
    .sort((a, b) => PROVIDER_CONFIG[a].priority - PROVIDER_CONFIG[b].priority);

  if (available.length === 0) {
    throw new Error(
      "No valid AI providers configured. Please set GOOGLE_GENERATIVE_AI_API_KEY or OPENAI_API_KEY in .env"
    );
  }

  return available;
}

export function resolveProvider(override: unknown): AIProvider {
  const validProviders = getValidProvidersSync();

  if (typeof override !== "string") return validProviders[0];

  const normalized = override.trim().toLowerCase() as AIProvider;
  return validProviders.includes(normalized) ? normalized : validProviders[0];
}
