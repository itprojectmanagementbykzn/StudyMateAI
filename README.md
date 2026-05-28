# StudyMateAI

An AI-powered e-learning platform for Computer Science. Students learn through
structured lessons, get help from a **bilingual (English / Burmese) AI tutor**,
and test themselves with **AI-generated quizzes** — all with progress tracking.

## Features

- **Structured CS curriculum** — JavaScript, Frontend (HTML/CSS/DOM/React), and
  Backend (Node.js/Express), organised into chapters and topics.
- **Bilingual AI tutor (StudyBuddy)** — chat with a Gemini-powered tutor that
  answers in English or Burmese, aware of the chapter you're currently studying.
- **Explain in Burmese / မြန်မာလို ရှင်းပြပါ** — one click on any lesson topic for
  a Burmese explanation from Gemini.
- **AI-generated quizzes** — English quizzes from the backend; Burmese quizzes
  generated on the fly by Gemini. Pass the final chapter quiz (≥ 80%) to unlock
  the next chapter.
- **Global language toggle** — a single English ⇄ မြန်မာ switch (in the sidebar
  and the chat) drives every AI feature. Your choice is persisted.
- **Progress tracking** — per-chapter and overall progress, persisted across
  sessions.

## Tech stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **Redux Toolkit** (incl. RTK Query) + **redux-persist**
- **Google Gen AI SDK** (`@google/genai`) — Gemini models
- **Vitest** + **Testing Library** for tests

## Getting started

Requires Node.js 20+ and npm.

```sh
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#    then edit .env and add your Gemini API key

# 3. Start the dev server (http://localhost:8080)
npm run dev
```

### Environment variables

See [`.env.example`](./.env.example). `.env` is git-ignored — never commit it.

| Variable               | Required | Description                                                        |
| ---------------------- | -------- | ------------------------------------------------------------------ |
| `VITE_GEMINI_API_KEY`  | Yes      | Google Gemini API key ([get one](https://aistudio.google.com/app/apikey)). |
| `VITE_API_URL`         | No       | Backend base URL. Defaults to the hosted hackathon API.            |
| `VITE_GEMINI_MODEL`    | No       | Gemini model id. Defaults to `gemini-3.5-flash`.                   |

> **Security note:** Vite exposes `VITE_*` variables to the browser, so the
> Gemini key ships to the client. For production, proxy Gemini calls through a
> backend and restrict the key. See _Roadmap_ below.

## Scripts

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start the Vite dev server.                   |
| `npm run build`     | Production build.                            |
| `npm run preview`   | Preview the production build.                |
| `npm run lint`      | Run ESLint.                                  |
| `npm run typecheck` | Type-check the app with the TypeScript compiler. |
| `npm run test`      | Run the Vitest suite.                        |

## How the AI + Burmese mode works

All Gemini access goes through a single helper, [`src/lib/gemini.ts`](./src/lib/gemini.ts):

- `sendChat()` powers the tutor chat (`StudyChat` / `MainChatbot`).
- `explainTopic()` powers the **Explain in Burmese** buttons.
- `generateQuiz()` produces Burmese quizzes as structured JSON.

The active language lives in a persisted Redux slice
([`src/redux/language.slice.ts`](./src/redux/language.slice.ts)) and is applied
to the system prompt and quiz generation. Quizzes route through
[`src/lib/quiz.ts`](./src/lib/quiz.ts): English from the backend, Burmese from
Gemini. Burmese text renders via the bundled "Noto Sans Myanmar" font.

## Project structure

```
src/
  api/            RTK Query endpoints (auth, progress) + base config
  components/
    ai/           StudyChat, MainChatbot, ExplainInBurmese
    layout/       Sidebar (with language toggle), Topbar
    ComputerScience/  lesson content per chapter
    Subjects/     chapter list with progress
  lib/            gemini.ts, quiz.ts, env.ts, keys.ts, utils.ts
  pages/          Dashboard, Lessons, Quiz, FinalChapterQuiz, chapter pages
  redux/          store, slices (auth, language, progress, latest lesson)
```

## Testing & CI

Tests live next to the code as `*.test.ts(x)` and run with `npm run test`.
GitHub Actions ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) runs
lint, type-check, tests, and build on every push and pull request.

## Roadmap / follow-ups

- Proxy the Gemini API key through a backend instead of exposing it client-side.
- Tighten the TypeScript config (`strict` / `strictNullChecks` / `noImplicitAny`)
  incrementally across the codebase.
- Map chapter content by sub-subject (currently the chapter content view is
  wired to the JavaScript track).
- Expand test coverage (component and integration tests).
