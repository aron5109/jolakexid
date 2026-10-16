# Jólakexið

**Lítil spá fyrir stóra daga.** Jólakexið is an interactive Icelandic Christmas fortune cookie for employees. Visitors tap a golden-brown fortune cookie, it snaps in two, golden crumbs scatter, and a cream paper slip slides out with a funny, warm or slightly sarcastic Christmas fortune in Icelandic.

No login, no backend, no personal data. It is a static site hosted on GitHub Pages.

Intended URL: **https://aron5109.github.io/jolakexid/**

---

## Tech stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite (`base: '/jolakexid/'`) |
| Styling | Modern CSS with custom properties, SVG and CSS animation (no animation library) |
| Fonts | Playfair Display (display) and Manrope (UI), self-hosted in `src/assets/fonts` (SIL OFL) |
| Sound | Optional, synthesised in the browser with the Web Audio API: no audio files, never autoplays |
| Tests | Vitest + Testing Library (jsdom) |
| Quality | ESLint (typescript-eslint, react-hooks) and `tsc` |

The only runtime dependencies are `react` and `react-dom`. Nothing is fetched from external fonts, images, analytics or APIs at runtime.

## Local development

Requires Node 22 (see `.nvmrc`).

```bash
npm ci            # install exactly what package-lock.json pins
npm run dev       # dev server: http://localhost:5173/jolakexid/
npm run build     # production build into dist/
npm run preview   # serve the production build: http://localhost:4173/jolakexid/
```

## Testing

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm test            # Vitest, single run
npm run test:watch  # Vitest in watch mode
npm run check       # all of the above
```

The suite covers:

- **Fortune dataset**: at least 50 fortunes, no duplicates, every category used, tidy text.
- **Fortune selection**: random choice, no repeats of recently shown fortunes, corrupt or blocked `localStorage` never breaks anything.
- **State machine**: every allowed transition, invalid events ignored, timers cleaned up on unmount.
- **The app end to end**: breaking via the button and the cookie itself, revealing, opening again and again, copying (success and failure), the sound toggle, keyboard focus and reduced motion.

## Adding or editing fortunes

All fortunes live in **`src/data/fortunes.ts`**, grouped into four categories:

| Key | Label in UI | Theme |
|---|---|---|
| `jolaspeki` | Jólaspeki | Christmas wisdom |
| `vinnuspa` | Vinnuspá | Workplace predictions |
| `jolaheppni` | Jólaheppni | Christmas luck |
| `nyarsspa` | Nýársspá 2027 | New Year predictions for 2027 |

To add a fortune, add a string to the right list. IDs are derived from the text automatically, so there is nothing to number. To add a category, add its key to `FORTUNE_CATEGORIES`, a label to `CATEGORY_LABELS` and a list to `FORTUNE_TEXTS`.

Guidelines:

- Avoid adjectives that inflect for the reader's gender ("þú verður glaður/glöð") so every fortune fits everyone.
- No jokes about specific colleagues, protected characteristics or sensitive personal circumstances.
- Keep each fortune at 160 characters or fewer, ending with punctuation (the tests enforce this).

The system scales to 150–200 fortunes without architectural changes: selection skips recently shown fortunes (half the pool, at most 40) using a small history in the browser's `localStorage`.

## How the animation works

The interaction is driven by a small, pure state machine (`src/lib/cookieMachine.ts`):

```
idle → cracking → revealing → revealed → resetting → idle
```

- `useCookieMachine` (`src/hooks/useCookieMachine.ts`) holds the state and mirrors it synchronously in a ref, so two clicks in the same frame can never draw two fortunes. A fortune is drawn **once**, on the `idle → cracking` transition.
- Each timed phase owns exactly one timer, cleared when the phase changes or the component unmounts, so stale timers cannot corrupt the sequence.
- CSS reads the phase from a `data-phase` attribute and does all the motion:
  1. **Anticipation**: the cookie squashes slightly and springs back.
  2. **Glow**: the golden halo flares and a flash blooms at the seam.
  3. **Split**: the two halves (separate SVG layers) rotate and move apart with a springy ease.
  4. **Crumbs**: biscuit crumbs and golden sparks scatter and fall.
  5. **Paper**: the cream slip unrolls with `clip-path` and its text fades in, line by line.
- Tap to readable fortune takes about **1.26 s** (`cracking` 620 ms + `revealing` 640 ms).
- **The cookie** (`CookieHalf.tsx`, `cookieGeometry.ts`) is layered SVG. Only the left half is described; the right half is its mirror. Surface texture comes from SVG filters (`feTurbulence` with `feDiffuseLighting` and `feSpecularLighting`) that give a baked relief and sugary glints, on top of layers for colour, crease shadow, toasted spots and highlights.
- Only `transform` and `opacity` are animated, so it stays smooth on phones.

### Reduced motion

With `prefers-reduced-motion: reduce`, phases shorten to 60/220/200 ms, floating and twinkling stop, and the cookie switches to its broken state with a gentle fade instead of movement.

### Accessibility

- `lang="is"` and semantic HTML (`main`, `header`, `h1`/`h2`, `footer`, a list).
- Everything works from the keyboard: the cookie and all controls are native `<button>`s with visible focus rings.
- Focus moves to "Fá annað kex" when a fortune appears and back to the cookie when a new one arrives.
- The fortune is announced through an `aria-live` region, as is "Afritað!".
- The sound toggle uses `aria-pressed`, and sound never plays unless the visitor turns it on.
- Touch targets are at least 44 px and text contrast meets WCAG AA.

## Project structure

```
src/
  App.tsx                      Page composition, copy, sound, focus handling
  components/
    ChristmasBackground.tsx    Gradient, bokeh, pine boughs, baubles, twinkles
    FortuneCookie.tsx          The cookie button, glow, shadow and crumbs
    CookieHalf.tsx             One SVG half of the cookie
    cookieGeometry.ts          Cookie shape (mirrored for the right half)
    FortuneReveal.tsx          The stage: cookie, sparks and paper
    FortunePaper.tsx           The fortune slip
    ActionButtons.tsx          "Brjóttu jólakexið", "Fá annað kex", "Afrita boðskap"
    SoundToggle.tsx            Sound on/off
    Ornament.tsx, icons.tsx    Decorations and icons
  data/fortunes.ts             The fortune dataset
  hooks/useCookieMachine.ts    State machine with timers
  hooks/useReducedMotion.ts    prefers-reduced-motion
  lib/cookieMachine.ts         Pure state machine
  lib/fortunePicker.ts         Fortune selection and recent history
  lib/clipboard.ts             Clipboard with fallback
  lib/sound.ts                 Web Audio sounds
  styles/                      Fonts and all styling
```

## GitHub Pages deployment

`.github/workflows/deploy.yml` uses only official GitHub actions:

1. `npm ci` (lockfile)
2. typecheck, lint and tests
3. `npm run build` into `dist/`
4. `actions/upload-pages-artifact` uploads `dist/`
5. `actions/deploy-pages` publishes it

Pull requests only run validation and the build. Deployment happens on every push to `main` (or manually via *Run workflow*). The build job has only `contents: read`; the deploy job adds `pages: write` and `id-token: write`.

Vite's `base: '/jolakexid/'` makes every asset path (JS, CSS, fonts, favicon) resolve under `https://aron5109.github.io/jolakexid/`.

### One-time manual GitHub settings

1. **Settings → Pages → Build and deployment → Source: "GitHub Actions".**
2. The repository is **private**. GitHub Pages on private repositories needs a paid plan (GitHub Pro, Team or Enterprise). On a free account, either upgrade the plan or make the repository public; that is the owner's decision.
3. After the first deployment, the URL appears under **Settings → Pages** and on the `github-pages` environment.

Note: on a private repository with GitHub Pro, the published site itself is still public to anyone with the URL (only Enterprise Cloud offers access-controlled Pages).
