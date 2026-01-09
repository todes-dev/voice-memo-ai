export type AIProvider = 'mock' | 'gemini';

export const AppConfig = {
  aiProvider: (process.env.AI_PROVIDER || 'mock') as AIProvider,
};