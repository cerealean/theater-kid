# Theater Kid — Roadmap & Step-by-Step Plan
_Last updated: 2025-08-19_

## Context & Assumptions
- Angular app with Tailwind, CI (lint/format/test/build), Playwright, Husky/Commitlint, and a `docs/` folder are already set up. Releases exist (e.g., v1.2.0). We’ll build on that foundation.  
- README indicates provider support for OpenAI/OpenRouter and streaming; we will verify feature completeness and connect the full UI flows.

## Prioritization
- **P0 (MVP Functionality):** Core chat loop working end-to-end with at least one provider, minimal UX, safe markdown rendering.
- **P1 (Usability & Delight):** Theater/stage UX polish, character management & import, settings, persistence, QoL.
- **P2 (Power-User & Scale):** Model auditioning, tools/plugins, analytics, advanced theming, packaging & docs.

---

## P0 — Functional MVP (ship a usable chat)
**Goal:** A user can select a model, chat, see streamed responses, and export a transcript.

### Step-by-Step
1. **Provider Abstraction**
   - Define `AiProvider` interface (chat, stream, listModels, abort).
   - Create `providers/openai.provider.ts` and `providers/openrouter.provider.ts`.
   - Add provider registry + factory, typed configs, and runtime validation.

2. **Secrets & Config**
   - Settings form for API key + base URL + model; store encrypted at rest (localStorage + Web Crypto) with “Forget keys” control.
   - Environment guards: never bundle keys; keys only user-supplied at runtime.

3. **Chat Loop (Streaming)**
   - Hook UI send → provider.stream → incremental renderer.
   - Abort controller + cancel button; auto-scroll with “Pause autoscroll” toggle.

4. **Message & Session Model**
   - Types: `Message { id, role, text, parts, createdAt, ... }`, `Session { id, title, messages[], provider, model, settings }`.
   - Local persistence (IndexedDB via `idb` or Angular signal-store); session list with quick switch.

5. **Markdown Rendering (Safe)**
   - Strict sanitizer; fenced code blocks with copy button; collapsible long outputs.
   - Inline images disabled by default (toggle to enable).

6. **Error States & Retries**
   - Inline error toasts; retry last request; backoff on rate limits.

7. **Export/Import**
   - Export session as JSON/Markdown; import JSON into a new session.

8. **Minimal Theming**
   - Light/Dark toggle; base layout; keyboard shortcuts (Enter / Shift+Enter, Ctrl/Cmd+K quick switch).

9. **Tests & CI**
   - Unit tests for provider interfaces + sanitization.
   - Playwright smoke: load app, enter key, send prompt, see tokens streaming.
   - Ensure CI stays green.

**Acceptance Criteria**
- Can chat (streamed) with at least one provider, switch models, cancel, and export.
- No XSS; tests green in CI.

---

## P1 — Usability, Character UX, and “Theater” Delight
**Goal:** It feels like a polished, lovable product for AI Characters.

### Features
1. **Character System (Core)**
   - Schema: `Character { id, name, avatar, greeting, systemPrompt, style, tags, metadata }`.
   - Character Gallery (“Playbill”): cards, search, tags, favorites.
   - Attach a character to a Session; render system prompt as “Director’s Notes”.

2. **Character Import**
   - **Chub-style field import**: parse `.json`/`.png` with embedded metadata (EXIF/XMP). Non-blocking: if metadata missing, fall back to manual mapping wizard.
   - Import preview + diff; safe merges into character store.

3. **Theater Stage UI**
   - Rename/organize components: `theater/Stage`, `stage/Curtains`, `stage/Spotlight`, `stage/Audience`.
   - Message bubbles styled as script lines; roles get badges (🎭 Actor/🎬 Director/👤 User).
   - “Lighting presets” (warm spotlight, cool rehearsal, noir) that change backgrounds and subtle shadows.
   - Performance mode toggle: reduce visual effects for slower devices.

4. **Settings & Profiles**
   - Per-provider profiles (e.g., OpenAI vs OpenRouter) and per-character defaults (model, temperature, style).
   - Token/price estimator preview before send (rough estimate).

5. **Persistence & Sync**
   - Export/import all characters and sessions as a single archive.
   - Optional cloud sync (later; see P2) — P1 is local-only but with clean boundaries.

6. **Quality of Life**
   - Prompt templates + variables (e.g., {{tone}}, {{style}}).
   - Slash commands: `/system`, `/retry`, `/summarize`, `/compress`.
   - Quick “Rehearsal Mode” that shows raw prompts & tokens in a side panel.

7. **A11y & Perf**
   - Focus traps, ARIA on key controls, prefers-reduced-motion.
   - Virtualized message list for long sessions.

**Acceptance Criteria**
- Import an image/JSON and get a usable Character.
- Stage theming feels cohesive; characters usable in sessions.
- Settings persist and can be reset; performance acceptable on mid devices.

---

## P2 — Power-User, Tools, and Scale
**Goal:** Beyond chat — workflows for creators and rigorous testing.

### Features
1. **Audition Mode (Model Bake-off)**
   - Send the same prompt to multiple models; split view diff; “applause meter” (thumbs) per response.

2. **Tools/Function Calling**
   - Pluggable tools architecture (web search, dice roller, lorebook/knowledge, image caption).
   - UI affordance: “Props Table” listing available tools per session.

3. **Analytics & Telemetry (Opt-in)**
   - Local stats (tokens/messages per session). Optional telemetry with user consent.

4. **Collaboration**
   - “Backstage Share”: export a read-only session URL or archive.

5. **Theming & Skins**
   - Theme packs; user CSS overrides; downloadable presets.

6. **Packaging & Docs**
   - Guided onboarding; in-app help; docs pages for providers, characters, import format.

**Acceptance Criteria**
- Audition comparison works; at least one tool integrated.
- Opt-in telemetry; exportable share flow; docs linked in app.

---

## Implementation Notes
- **Foldering:** `src/app/core` (providers, storage, types), `src/app/features` (chat, characters, settings, theater), `src/app/shared` (ui, markdown).
- **Providers:** Strong typing; transparent abort; retries with jitter; user-supplied API keys only.
- **Security:** Sanitize markdown; strip HTML by default; CSP guidance in docs.
- **State:** Signals-based stores; ephemeral UI state vs persisted session/character stores.

---

## Backlog (Nice-to-Haves & Wishes)
- Director’s Commentary capture (inline notes that don’t get sent).
- Scene switching: multiple “sets” per session (tabs).
- Audio TTS playback; mic input; subtitles cue cards.
- Live prompt diff viewer (what actually went to the model).
- “Stage Manager” automations (auto-save, auto-title sessions, summarize on exit).
- Import/export compatibility shims (Chub.AI, TavernAI, Ooba, SillyTavern formats).

---

## Milestone Slices & Checklists
### Milestone M0 — Repo Hygiene (quick win)
- [ ] Add `docs/ROADMAP.md` and link from README.
- [ ] Ensure `npm run ci` passes locally and in CI.
- [ ] Verify Playwright smoke test stubs.

### Milestone M1 — P0 MVP
- [ ] Implement provider abstraction + OpenAI.
- [ ] Settings → key entry, encryption, test round-trip.
- [ ] Chat stream with markdown safe render.
- [ ] Abort, retry, export JSON/MD.
- [ ] Unit + Playwright smoke.

### Milestone M2 — Characters & Stage (P1)
- [ ] Character model + gallery.
- [ ] Chub import (JSON/PNG metadata).
- [ ] Stage theming & lighting presets.
- [ ] Settings profiles; token estimates.
- [ ] Virtualized message list.

### Milestone M3 — Power Features (P2)
- [ ] Audition mode (2+ models).
- [ ] First tool (dice roller or lorebook).
- [ ] Telemetry opt-in; basic analytics.
- [ ] Share/export improvements; docs.

---

## Open Questions
- Which provider ships as default demo? (We keep keys user-supplied.)
- Preferred character import priority: JSON first, PNG metadata second?
- Any target compatibility formats we should prioritize (Chub/Tavern/etc.)?
