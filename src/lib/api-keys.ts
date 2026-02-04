export function hasApiKey(envVar: string | null): boolean {
  if (!envVar) return false;
  const key = process.env[envVar];
  return typeof key === "string" && key.trim().length > 0;
}

export function getApiKey(envVar: string): string {
  const key = process.env[envVar];
  if (!key) throw new Error(`${envVar} is not set`);
  return key;
}
