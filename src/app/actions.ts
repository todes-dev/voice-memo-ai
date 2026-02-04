"use server";

import type { ProviderOption } from "@/lib/providers";
import { PROVIDER_CONFIG, getValidProvidersSync } from "@/lib/providers";
import { transcribe } from "@/lib/transcription";
import { TranscribeSchema } from "@/lib/validation";

export async function transcribeAudio(formData: FormData) {
  try {
    const result = TranscribeSchema.safeParse({
      file: formData.get("file"),
      provider: formData.get("provider"),
    });

    if (!result.success) {
      return { success: false, error: result.error.message };
    }

    const { file, provider } = result.data;

    const text = await transcribe(file, provider);
    return { success: true, text };
  } catch (error) {
    console.error("Transcription error:", error);
    return { success: false, error: "Transcription failed" };
  }
}

export async function getAvailableProviders(): Promise<{
  providers: ProviderOption[];
}> {
  const available = getValidProvidersSync();

  const providers: ProviderOption[] = available.map((p) => ({
    value: p,
    label: PROVIDER_CONFIG[p].label,
  }));

  return {
    providers,
  };
}
