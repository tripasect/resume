# Alireza Sadjadipour — Portfolio

Personal portfolio and résumé website built with Next.js (App Router), React 19, Three.js, and Framer Motion. Every chapter, project description, and technology keyword is pre-rendered into static HTML, so crawlers and AI indexers see the full content without executing JavaScript.

Built with:
- Next.js 16 (App Router, `output: 'export'`)
- React 19
- Three.js / @react-three/fiber + drei
- Framer Motion
- Express (FitCheck API only)
- Cloudflare Pages (deployment)

## Development

```bash
npm install
cp .env.example .env.local   # optional, see Environment below

npm run dev           # Next dev server + Express FitCheck API together
npm run dev:frontend  # Next dev server only (http://localhost:3000)
npm run dev:server    # Express API only (http://localhost:13203)
npm run build         # static export into out/
npm run preview       # serve the exported site from out/
npm run lint          # oxlint
```

## Environment

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | build-time, public | Origin of the FitCheck API. Leave empty to call same-origin `/api/*`. |
| `LLM_BASE_URL` | server | Upstream OpenAI-compatible endpoint used by the Express API. |
| `LLM_API_KEY` | server | Required by the Express API; it exits without it. |
| `LLM_MODEL` | server | Model name sent upstream. |
| `PORT` | server | Express port, defaults to `13203`. |

`NEXT_PUBLIC_*` values are inlined during `next build`, so set them in the build environment, not only at runtime.

## SEO

The page ships with:

- Pre-rendered HTML for all copy (headings `h1` → `h3`, chapter leads, project descriptions).
- `metadata` export covering title template, description, canonical, keywords, Open Graph, Twitter cards, icons, PWA manifest, robots directives, and theme color.
- A linked JSON-LD `@graph` (`WebSite`, `Person`, `ProfilePage`, `ImageObject`, `ItemList`) generated in `src/lib/schema.js`.
- `src/app/sitemap.js` → `/sitemap.xml` and `src/app/robots.js` → `/robots.txt`.
- A real `404.html` with `robots: noindex`.
- `public/_headers` for Cloudflare Pages: security headers and immutable caching for hashed assets.
- Self-hosted fonts via `next/font`, removing the previous render-blocking Google Fonts `@import`.

Content lives in `src/data/resume.js` (language-neutral) and `src/i18n/` (per-locale copy), and is the single source of truth for both the rendered page and the structured data.

## Internationalisation

Two locales are served from one static export:

| Locale | URL | `lang` / `dir` | Fonts |
| --- | --- | --- | --- |
| English (default) | `/` | `en` / `ltr` | Bebas Neue (display), Inter (UI), Alexandria (body) |
| Persian | `/fa/` | `fa` / `rtl` | Alexandria latin + arabic for all three roles |

English stays on the root URL so the existing canonical and accumulated authority are preserved; Persian lives on a sub-path.

Because `output: 'export'` cannot use Next's built-in `i18n` routing (that needs a server), each locale is its own **route group with its own root layout**, so `lang` and `dir` are correct in the server-rendered HTML:

```
src/app/(en)/layout.jsx   src/app/(en)/page.jsx       → /
src/app/(fa)/layout.jsx   src/app/(fa)/fa/page.jsx    → /fa/
```

Both delegate to `src/RootHtml.jsx`, which emits the shared document shell, the JSON-LD graph, and the language switcher.

### Adding or changing copy

1. Edit `src/i18n/en.js` and `src/i18n/fa.js` — both files must keep the same shape.
2. `src/data/resume.js` holds everything language-neutral (names, URLs, technology stacks, the keyword index).
3. Run `npm run build` and confirm both `/` and `/fa/` render.

Dictionaries are passed from server components into client components, so **they must stay serialisable** — no functions, `Date`, or class instances. Format at the render site instead (see `toLocaleDigits`).

### RTL

- Direction-sensitive CSS uses logical properties (`inset-inline-*`, `padding-inline-*`, `border-inline-*`), so the FitCheck panel, chapter numerals, rules, and layout gutters mirror automatically.
- `[dir='rtl']` remaps `--font-display`, `--font-body`, and `--font-ui` to the Arabic-capable Alexandria cut, and drops `letter-spacing` / `text-transform`, both of which break cursive Arabic joining.
- Latin-only strings (email, phone, technology stacks) are pinned with `dir="ltr"` and `unicode-bidi` isolation so the bidi algorithm cannot reorder them.
- `numeral` display uses `toLocaleDigits`: Persian digits in prose, ASCII digits in `tel:` hrefs, structured data, and technology names.

### Font preloading

Turbopack hoists all font CSS into one app-wide stylesheet, and `next/font` derives its preload tags from that global set rather than per route. Preloading every face would therefore force each visitor to download every locale's fonts. Only the small display cut is preloaded; other faces load on demand, and `next/font` emits metric-adjusted fallbacks so the swap causes no layout shift.

## Deployment

Deployed via Cloudflare Pages. Build command `npm run build`, build output directory `out/` (see `wrangler.toml`).

## License

© 2026 Alireza Sadjadipour
