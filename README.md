# VoiceMemo AI

A voice memo app that records audio and transcribes it using AI, and generates structured summaries with key takeaways and action items.

## ✨ Features

- **Voice Recording** - Browser-based audio capture
- **AI Transcription** - Gemini AI or OpenAI Whisper
- **Smart Summaries** - AI-generated key takeaways with streaming
- **Multi-Provider** - Switch between Gemini, OpenAI, or Mock (dev)
- **UI** - Built with shadcn/ui and Tailwind CSS

## 🛠️ Tech Stack

**Framework:** Next.js 16 (App Router) • TypeScript  
**UI:** React • Tailwind CSS • shadcn/ui  
**AI:** Vercel AI SDK • Google Gemini • OpenAI  

## 🏗️ Architecture

- **State Machine Pattern** - Type-safe workflow (idle → recording → transcribing → thinking → complete)
- **Map-based Providers** - Provider switching

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys to .env

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

```bash
# OpenAI (Whisp
# AI Providers are auto-detected based on which API keys you set
# The app will show only the providers with valid API keys

# Google Gemini (transcription + summary)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key

# OpenAI (Whisper transcription + GPT summary)
OPENAI_API_KEY=your_openai_key
```

**Note:** In development, a "Mock" provider is always available for testing without API keys. Just leave the API key variables unset.

## 🗺️ Roadmap

**Current version**
- Voice recording & transcription
- AI-powered summaries with streaming
- Multi-provider support
- State machine architecture

**Next steps**
- User authentication (login/signup)
- Database persistence (Prisma + PostgreSQL?)
- Memo history & search
- User-specific memos
- PWA with offline support
- Background sync
