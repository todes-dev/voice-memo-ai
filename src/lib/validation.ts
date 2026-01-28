export function isValidNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidFile(value: unknown): value is File {
  return value instanceof File && value.size > 0;
}

export function extractPrompt(body: unknown): string | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const prompt = "prompt" in body ? body.prompt : undefined;
  return isValidNonEmptyString(prompt) ? prompt : null;
}

export function extractProvider(body: unknown): string | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }
  const provider = "provider" in body ? body.provider : undefined;
  return typeof provider === "string" && provider.trim().length > 0 ? provider.trim() : null;
}
