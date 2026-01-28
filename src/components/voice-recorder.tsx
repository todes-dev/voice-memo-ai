"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { transcribeAudio } from "@/app/actions";
import { useCompletion } from "@ai-sdk/react";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";

const PROVIDER_OPTIONS = [
  { value: "mock", label: "Mock (demo)" },
  { value: "gemini", label: "Gemini" },
  { value: "openai", label: "OpenAI" },
] as const;

export default function VoiceRecorder() {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [provider, setProvider] = useState<string>("mock");

  const { complete, completion, isLoading: isThinking } = useCompletion({
    api: "/api/summarize",
    experimental_throttle: 200,
    onError: (err) => {
      console.error("Stream error:", err);
      alert("Summary failed. Check console.");
    },
  });

  const handleStopAndProcess = async () => {
    try {
      const audioBlob = await stopRecording();
      setIsTranscribing(true);
      const formData = new FormData();
      formData.append("file", audioBlob);
      formData.append("provider", provider);
      const result = await transcribeAudio(formData);
      setIsTranscribing(false);

      if (result.success && result.text) {
        setTranscript(result.text);
        await complete(result.text, { body: { provider } });
      } else {
        alert(`Transcription failed: ${result.error ?? "Unknown error"}`);
      }
    } catch {
      setIsTranscribing(false);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Card className="p-6 w-full max-w-xl mx-auto flex flex-col items-center gap-6 shadow-xl bg-white/50 backdrop-blur-sm">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">VoiceMemo AI</h2>
        <p className="text-sm text-slate-500">Capture ideas. Get structured summaries.</p>
      </div>

      <div className="w-full flex flex-col gap-2">
        <label htmlFor="provider" className="text-sm font-medium text-slate-700">
          Provider
        </label>
        <select
          id="provider"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          disabled={isRecording || isTranscribing || isThinking}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
        >
          {PROVIDER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-6 items-center">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            disabled={isTranscribing || isThinking}
            className="h-20 w-20 rounded-full bg-red-500 hover:bg-red-600 shadow-red-200 shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
          </Button>
        ) : (
          <Button
            onClick={handleStopAndProcess}
            variant="outline"
            className="h-20 w-20 rounded-full border-4 border-red-100 bg-white hover:bg-red-50 animate-pulse"
          >
            <div className="w-8 h-8 bg-red-500 rounded-md" />
          </Button>
        )}
      </div>

      <div className="min-h-[24px] text-sm font-medium">
        {isRecording && <span className="text-red-500 flex items-center gap-2">● Recording...</span>}
        {isTranscribing && <span className="text-amber-500 flex items-center gap-2">⚡ Transcribing...</span>}
        {isThinking && !completion && <span className="text-indigo-500 flex items-center gap-2">🧠 Thinking...</span>}
      </div>

      <div className="w-full space-y-4">
        {transcript && (
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-600">
            <div className="font-semibold text-xs text-slate-400 uppercase mb-1">Transcript</div>
            {transcript}
          </div>
        )}
        {(completion || isThinking) && (
          <div className="p-6 rounded-xl bg-white border border-indigo-50 shadow-sm ring-1 ring-indigo-100">
            <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
              <span className="text-lg">✨</span> Smart Summary
            </h3>
            <div className="prose prose-sm prose-indigo max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed text-slate-800">{completion}</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
