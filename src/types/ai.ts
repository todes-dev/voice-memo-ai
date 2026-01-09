export interface ISummaryStrategy {
  summarize(prompt: string): Promise<Response>;
}

export interface ITranscriptionStrategy {
  transcribe(file: File): Promise<string>;
}
