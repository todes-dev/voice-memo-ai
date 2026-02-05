export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("API key")) {
      return "Invalid API key. Please check your configuration.";
    }
    if (error.message.includes("rate limit") || error.message.includes("429")) {
      return "Too many requests. Please wait a moment and try again.";
    }
    if (error.message.includes("network") || error.message.includes("fetch failed")) {
      return "Network error. Please check your connection and try again.";
    }
    return error.message;
  }
  return "An unexpected error occurred";
}
