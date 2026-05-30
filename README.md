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
- **AI-generated quizzes** — English and Burmese quizzes are generated on the fly
  by Gemini. Pass the final chapter quiz (≥ 80%) to unlock the next chapter.
- **Global language toggle** — a single English ⇄ မြန်မာ switch (in the sidebar
  and the chat) drives every AI feature. Your choice is persisted.
- **Accounts & sign-in** — email/password or Google sign-in via **Firebase Auth**.
- **Progress tracking** — per-chapter and overall progress saved to **Cloud
  Firestore**, scoped to each signed-in user and synced across devices.

## Tech stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **Redux Toolkit** + **redux-persist** for UI state
- **Firebase** — Authentication (email/password + Google) and Cloud Firestore
- **Google Gen AI SDK** (`@google/genai`) — Gemini models
- **Vitest** + **Testing Library** for tests

## Getting started

Requires Node.js 20+ and npm.

```sh
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#    then edit .env: set GEMINI_API_KEY and the VITE_FIREBASE_* web config
#    (see "Firebase setup" below)

# 3. Start the dev server (http://localhost:8080)
npm run dev
```

`npm run dev` also serves the `/api/gemini` and `/api/lessons` routes (via Vite
dev middleware using the same handlers as the deployed serverless functions), so
the AI tutor and lessons work locally without `vercel dev` or a separate API
process.

### Environment variables

See [`.env.example`](./.env.example). `.env` is git-ignored — never commit it.

| Variable             | Scope  | Required | Description                                                                                  |
| -------------------- | ------ | -------- | -------------------------------------------------------------------------------------------- |
| `GEMINI_API_KEY`     | Server | Yes      | Google Gemini API key ([get one](https://aistudio.google.com/app/apikey)). Read only by the `/api` functions — never shipped to the browser. |
| `GEMINI_MODEL`       | Server | No       | Gemini model id. Defaults to `gemini-flash-latest` (auto-updating Flash).                    |
| `VITE_FIREBASE_*`    | Client | Yes      | Firebase web config (`API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID`, `APP_ID`). Non-secret — access is enforced by Firestore rules. Copy from your Firebase project settings. |
| `VITE_GEMINI_PROXY_URL` | Client | No    | Override the AI proxy endpoint. Defaults to `/api/gemini`.                                   |

> **Security:** the Gemini key is **server-side only** (`GEMINI_API_KEY`, no
> `VITE_` prefix), so it and the `@google/genai` SDK never ship in the client
> bundle. Only `VITE_*` variables are exposed to the browser, and none of them
> are secret — including the Firebase web config, which merely identifies the
> project (Firestore security rules are the real access control). On Vercel, set
> `GEMINI_API_KEY` and the `VITE_FIREBASE_*` values in **Project Settings →
> Environment Variables** (not in a committed file).

### Firebase setup

Auth and progress data live in Firebase, so you need your own Firebase project:

1. Create a project at the [Firebase console](https://console.firebase.google.com/).
2. **Authentication → Sign-in method**: enable **Email/Password** and **Google**.
3. **Firestore Database**: create a database.
4. Deploy the security rules in [`firestore.rules`](./firestore.rules) so each
   user can read/write only their own `users/{uid}` document
   (`firebase deploy --only firestore:rules`, or paste them in the console).
5. **Project settings → General → Your apps**: register a Web app and copy the
   config values into `.env` as the `VITE_FIREBASE_*` variables.

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

The browser never calls Gemini directly. The client helper
[`src/lib/gemini.ts`](./src/lib/gemini.ts) `POST`s to the serverless proxy at
**`/api/gemini`** ([`api/gemini.ts`](./api/gemini.ts)), which holds the API key
and talks to Google server-side. The prompt-building and response-parsing logic
is pure and SDK-free in [`src/lib/gemini-core.ts`](./src/lib/gemini-core.ts),
shared by the client and the proxy handler
([`src/server/geminiHandler.ts`](./src/server/geminiHandler.ts)).

The client helper exposes three functions:

- `sendChat()` powers the tutor chat (`StudyChat` / `MainChatbot`).
- `explainTopic()` powers the **Explain in Burmese** buttons.
- `generateQuiz()` produces quizzes (English and Burmese) as structured JSON.

The active language lives in a persisted Redux slice
([`src/redux/language.slice.ts`](./src/redux/language.slice.ts)) and is applied
to the system prompt and quiz generation. All quizzes route through
[`src/lib/quiz.ts`](./src/lib/quiz.ts) to Gemini, in whichever language is
active. Burmese text renders via the bundled "Noto Sans Myanmar" font.

## Project structure

```
api/              Vercel serverless functions: gemini.ts (AI proxy), lessons.ts
firestore.rules   Firestore security rules (each user owns their users/{uid} doc)
src/
  components/
    ai/           StudyChat, MainChatbot, ExplainInBurmese
    layout/       Sidebar (language toggle + sign-out), Topbar (profile)
    ComputerScience/  lesson content per chapter
    Subjects/     chapter list with progress
    ProgressSync.tsx  loads Firestore progress into Redux on sign-in
  lib/            firebase.ts (init), auth.tsx (AuthProvider/useAuth),
                  progress.ts (Firestore data layer), gemini.ts (proxy client),
                  gemini-core.ts, quiz.ts, lessons.ts, utils.ts
  server/         geminiHandler.ts, lessons.ts (shared by /api + Vite dev middleware)
  pages/          Auth (LoginSignUp), Dashboard, Lessons, Quiz, FinalChapterQuiz, chapter pages
  redux/          store, slices (language, progress, latest lesson, overall progress)
```

## Testing & CI

Tests live next to the code as `*.test.ts(x)` and run with `npm run test`.
GitHub Actions ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) runs
lint, type-check, tests, and build on every push and pull request.

## Roadmap / follow-ups

- Map chapter content by sub-subject (currently the chapter content view is
  wired to the JavaScript track).
- Expand test coverage (component and integration tests).
