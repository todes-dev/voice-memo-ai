import { z } from "zod";

// Replaces 'isValidFile' and manual provider checks
export const TranscribeSchema = z.object({
  file: z
    .instanceof(File, { message: "Audio file is required" })
    .refine((file) => file.size > 0, "File is empty")
    .refine((file) => file.size < 10 * 1024 * 1024, "File size must be less than 10MB"),
  provider: z.string().optional(),
});

// Replaces 'extractPrompt', 'extractProvider', and 'isValidNonEmptyString'
export const SummarizeSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  provider: z.string().optional(),
});
