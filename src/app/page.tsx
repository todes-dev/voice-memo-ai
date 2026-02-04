import VoiceRecorder from "@/components/voice-recorder";
import { getAvailableProviders } from "@/app/actions";

export default async function Home() {
  const { providers } = await getAvailableProviders();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-100">
      <VoiceRecorder initialProviders={providers} />
    </main>
  );
}
