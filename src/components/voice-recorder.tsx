"use client";

import { useState } from "react";

import { useCompletion } from "@ai-sdk/react";

import { transcribeAudio } from "@/app/actions";
import { ProviderSelect } from "@/components/provider-select";
import { RecordButton } from "@/components/record-button";
import { ResultCard } from "@/components/result-card";
import { StatusIndicator } from "@/components/status-indicator";
import { Card } from "@/components/ui/card";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import type { ProviderOption } from "@/lib/providers";
import type { AppState } from "@/types/app-state";
import { getDisplayStatus } from "@/types/app-state";

interface Props {
  initialProviders: ProviderOption[];
}

export default function VoiceRecorder({ initialProviders }: Props) {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();

  const [state, setState] = useState<AppState>({ status: "idle" });
  const [provider, setProvider] = useState<string>(initialProviders[0]?.value || "");

  const {
    complete,
    completion,
    isLoading: isThinking,
  } = useCompletion({
    api: "/api/summarize",
    experimental_throttle: 200,
    onFinish: (_, summary) => {
      if (state.status === "thinking") {
        setState({ status: "complete", transcript: state.transcript, summary });
      }
    },
    onError: (err) => {
      console.error("Summary error:", err);
      setState({ status: "error", message: "Summary failed. Please try again." });
    },
  });

  const handleStopAndProcess = async () => {
    try {
      const audioBlob = await stopRecording();
      setState({ status: "transcribing" });

      const formData = new FormData();
      formData.append("file", audioBlob);
      formData.append("provider", provider);
      const result = await transcribeAudio(formData);

      if (result.success && result.text) {
        setState({ status: "thinking", transcript: result.text });
        await complete(result.text, { body: { provider } });
      } else {
        const errorMsg = `Transcription failed: ${result.error ?? "Unknown error"}`;
        console.error(errorMsg);
        setState({ status: "error", message: errorMsg });
      }
    } catch (err) {
      console.error("Unexpected error during transcription:", err);
      setState({ status: "error", message: "An unexpected error occurred. Please try again." });
    }
  };

  const handleStartRecording = () => {
    setState({ status: "recording" });
    startRecording();
  };

  const isBusy = state.status === "transcribing" || isThinking;
  const displayStatus = getDisplayStatus(state, !!completion);

  return (
    <Card className="p-6 w-full max-w-xl mx-auto flex flex-col items-center gap-6 shadow-xl bg-white/50 backdrop-blur-sm">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">VoiceMemo AI</h2>
        <p className="text-sm text-slate-500">Capture ideas. Get structured summaries.</p>
      </div>

      <ProviderSelect
        value={provider}
        onChange={setProvider}
        disabled={isRecording || isBusy}
        options={initialProviders}
      />

      <div className="flex gap-6 items-center">
        <RecordButton
          isRecording={isRecording}
          onStart={handleStartRecording}
          onStop={handleStopAndProcess}
          disabled={isBusy}
        />
      </div>

      <StatusIndicator status={displayStatus} />

      <div className="w-full space-y-4">
        {(state.status === "thinking" || state.status === "complete") && (
          <ResultCard title="Transcript" content={state.transcript} variant="transcript" />
        )}
        {(completion || state.status === "complete") && (
          <ResultCard
            title="Smart Summary"
            content={state.status === "complete" ? state.summary : completion}
            variant="summary"
          />
        )}
      </div>
    </Card>
  );
}
