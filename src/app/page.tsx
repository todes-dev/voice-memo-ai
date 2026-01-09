import VoiceRecorder from '@/components/voice-recorder';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-100">
      <VoiceRecorder />
    </main>
  );
}
