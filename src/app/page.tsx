import { getAvailableProviders } from "@/app/actions";
import VoiceRecorder from "@/components/voice-recorder";

export default async function Home() {
  const { providers } = await getAvailableProviders();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-100">
      <VoiceRecorder initialProviders={providers} />
    </main>
  );
}
