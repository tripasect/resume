/**
 * FitCheck — Lean backend server
 * ──────────────────────────────
 * Proxies requests to the personal LLM endpoint defined in .env
 * so the API key never reaches the browser.
 *
 * Usage:
 *   node server/index.js          (production / standalone)
 *   npm run dev                   (runs next dev + this server together)
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import SYSTEM_PROMPT from './systemPrompt.js';

const {
  // FitCheck and the relay run on the same host. Going straight to the
  // loopback listener avoids the server's public-IP hairpin route and Nginx.
  LLM_BASE_URL = 'http://127.0.0.1:13001/api/v1',
  LLM_API_KEY,
  LLM_MODEL = 'google/gemini-3.7-flash',
  PORT = 13203,
} = process.env;

if (!LLM_API_KEY) {
  console.error('[FitCheck] LLM_API_KEY is not set in .env — aborting.');
  process.exit(1);
}

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:3000',  // default Next.js dev port
    'http://localhost:4173',
    /https:\/\/.*alirezasadjadipour\.ir$/,  // production domain
  ],
  methods: ['POST', 'GET'],
}));
app.use(express.json({ limit: '16kb' }));

// ── Output language ───────────────────────────────────────────────────────────
// The JSON keys never change; only the human-readable string values are
// translated, so the frontend can parse every locale identically.
const LOCALE_INSTRUCTIONS = {
  en: 'Write every human-readable string value in English.',
  fa: 'CRITICAL: You MUST write ALL human-readable string values in Persian (Farsi). This is non-negotiable. Use a professional, formal register and Persian numerals for quantities. Keep technology names, product names, and version numbers in their original Latin form (for example Python, Django, Vue 3, RAG, Pinecone). The summary, reasoning, recommendation, pros, cons, and skill notes — everything readable by a human — MUST be in Persian. No English prose is allowed in the output.',
};

function normalizeLocale(value) {
  return typeof value === 'string' && Object.hasOwn(LOCALE_INSTRUCTIONS, value) ? value : 'en';
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// ── FitCheck endpoint ─────────────────────────────────────────────────────────
app.post('/api/fitcheck', async (req, res) => {
  const { projectDescription, locale } = req.body ?? {};

  if (!projectDescription || typeof projectDescription !== 'string') {
    return res.status(400).json({ error: 'projectDescription is required.' });
  }

  const trimmed = projectDescription.trim();
  if (trimmed.length < 20) {
    return res.status(400).json({ error: 'Please describe the project in at least 20 characters.' });
  }
  if (trimmed.length > 4000) {
    return res.status(400).json({ error: 'Description is too long (max 4000 characters).' });
  }

  const messages = [
    {
      role: 'system',
      content: `${SYSTEM_PROMPT}\n\n── OUTPUT LANGUAGE ──\n${LOCALE_INSTRUCTIONS[normalizeLocale(locale)]}`,
    },
    {
      role: 'user',
      content: `Here is the project / role I need help with:\n\n${trimmed}`,
    },
  ];

  let llmRes;
  try {
    llmRes = await fetch(`${LLM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages,
        temperature: 0.2,
        max_tokens: 4000,
      }),
    });
  } catch (networkErr) {
    console.error('[FitCheck] Network error contacting LLM:', networkErr.message);
    return res.status(502).json({ error: 'Could not reach the LLM endpoint.' });
  }

  if (!llmRes.ok) {
    const errText = await llmRes.text().catch(() => '');
    console.error('[FitCheck] LLM returned HTTP', llmRes.status, errText.slice(0, 300));
    return res.status(502).json({ error: `LLM endpoint error (HTTP ${llmRes.status}).` });
  }

  let data;
  try {
    data = await llmRes.json();
  } catch {
    return res.status(502).json({ error: 'Invalid JSON from LLM endpoint.' });
  }

  const raw = data?.choices?.[0]?.message?.content ?? '';

  // Parse the structured JSON the LLM returned
  let result;
  try {
    // Sometimes models wrap JSON in triple backticks even when told not to
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
    result = JSON.parse(cleaned);
  } catch {
    // Return raw text so the frontend can still show something
    console.warn('[FitCheck] Could not parse LLM JSON.');
    console.warn('[FitCheck] Raw content (first 500 chars):', raw.slice(0, 500));
    return res.json({ raw });
  }

  return res.json({ result });
});

// ── Static files (the exported Next.js site in `out/`) ────────────────────────
app.use(express.static(new URL('../out', import.meta.url).pathname));

// Any unmatched route serves the exported 404 page.
app.get('*', (_req, res) => {
  res.status(404).sendFile(new URL('../out/404.html', import.meta.url).pathname);
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[FitCheck] Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[FitCheck] Port ${PORT} is in use — is another instance already running?`);
  } else {
    console.error('[FitCheck] Failed to start:', err.message);
  }
  process.exit(1);
});
