'use client'

/**
 * FitCheck.jsx
 * ─────────────
 * Desktop : fixed inline-end panel, always visible while scrolling.
 * Mobile  : bottom sheet, toggled open/closed with a persistent tab handle.
 *
 * All copy comes from the locale dictionary, and the chosen locale is forwarded
 * to the API so the model answers in the language the visitor is reading.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLocaleMeta } from '@/i18n';

// ── Constants ─────────────────────────────────────────────────────────────────
// Inlined at build time by Next.js; empty string means same-origin `/api/*`.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

const VERDICT_COLORS = {
  STRONG_FIT: '#22c55e',
  GOOD_FIT: '#84cc16',
  PARTIAL_FIT: '#f59e0b',
  POOR_FIT: '#ef4444',
};

// ── Skill Bar ─────────────────────────────────────────────────────────────────
function SkillBar({ skill }) {
  const gap      = skill.alireza_score - skill.importance;
  const gapColor = gap >= 0 ? '#22c55e' : '#ef4444';
  return (
    <div className="fc-skill-row">
      <div className="fc-skill-header">
        <span className="fc-skill-name">{skill.name}</span>
        <span className="fc-skill-scores" dir="ltr">
          <span style={{ color: '#22c55e' }}>{skill.alireza_score}</span>
          <span className="fc-skill-sep">vs</span>
          <span style={{ color: '#ef4444' }}>{skill.importance}</span>
          {gap !== 0 && (
            <span style={{ color: gapColor, fontWeight: 700, marginLeft: 3 }}>
              ({gap > 0 ? '+' : ''}{gap})
            </span>
          )}
        </span>
      </div>
      <div className="fc-bar-track">
        <motion.div className="fc-bar-demand"
          initial={{ width: 0 }} animate={{ width: `${skill.importance}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }} />
        <motion.div className="fc-bar-cover"
          initial={{ width: 0 }} animate={{ width: `${skill.alireza_score}%` }}
          transition={{ duration: 0.5, delay: 0.12, ease: 'easeOut' }} />
      </div>
      {skill.note && <p className="fc-skill-note">{skill.note}</p>}
    </div>
  );
}

// ── Inner panel content (shared between desktop + mobile) ─────────────────────
function PanelContent({ locale, strings }) {
  const [text,     setText]     = useState('');
  const [status,   setStatus]   = useState('idle'); // idle | loading | done | error
  const [result,   setResult]   = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('');
  const bodyRef = useRef(null);

  const pickMessage = useCallback(() => {
    const pool = strings.loadingMessages;
    setLoadingMsg(pool[Math.floor(Math.random() * pool.length)]);
  }, [strings.loadingMessages]);

  useEffect(() => {
    if (status !== 'loading') return;
    let timer;
    const schedule = () => {
      const delay = 2000 + Math.random() * 2000;
      timer = setTimeout(() => { pickMessage(); schedule(); }, delay);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [status, pickMessage]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (text.trim().length < 20) return;
    setStatus('loading');
    setResult(null);
    setErrorMsg('');
    try {
      const res  = await fetch(`${API_URL}/api/fitcheck`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectDescription: text, locale }),
      });
      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          res.ok
            ? strings.errors.invalidResponse
            : strings.errors.requestFailed.replace('{status}', String(res.status)),
        );
      }
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      if (data.result) {
        setResult(data.result);
        setStatus('done');
        setTimeout(() => bodyRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 80);
      } else if (data.raw) {
        setResult({ raw: data.raw });
        setStatus('done');
      } else {
        throw new Error(strings.errors.unexpected);
      }
    } catch (err) {
      setErrorMsg(err.message ?? strings.errors.generic);
      setStatus('error');
    }
  }

  const verdictLabel = result && result.verdict ? strings.verdicts[result.verdict] : null;
  const verdictColor = result && result.verdict ? VERDICT_COLORS[result.verdict] : undefined;
  const vm = result
    ? {
        label: verdictLabel ?? strings.verdicts.PARTIAL_FIT,
        color: verdictColor ?? VERDICT_COLORS.PARTIAL_FIT,
      }
    : null;

  return (
    <div className="fc-panel-inner">
      {/* Header */}
      <div className="fc-panel-header">
        <div className="fc-panel-title-group">
          <span className="fc-panel-title">{strings.title}</span>
        </div>
      </div>

      {/* Scrollable body (results / error only) */}
      <div className="fc-panel-body" ref={bodyRef}>
        {status === 'loading' && (
          <div className="fc-loading-banner">
            <motion.p
              key={loadingMsg}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
            >{loadingMsg}</motion.p>
          </div>
        )}

        {/* Error */}
        <AnimatePresence>
          {status === 'error' && (
            <motion.p className="fc-error"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {errorMsg}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {status === 'done' && result && (
            <motion.div className="fc-results"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>

              {result.raw ? (
                <div className="fc-reasoning"><p>{result.raw}</p></div>
              ) : (
              <>

              {/* Verdict */}
              <div className="fc-verdict" style={{ borderColor: vm.color }}>
                <div className="fc-verdict-score" style={{ color: vm.color }} dir="ltr">
                  {result.overall_score}<span className="fc-score-denom">/100</span>
                </div>
                <div className="fc-verdict-right">
                  <span className="fc-verdict-label" style={{ color: vm.color }}>{vm.label}</span>
                  <div className="fc-overall-bar-track">
                    <motion.div className="fc-overall-bar-fill"
                      style={{ background: vm.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${result.overall_score}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }} />
                  </div>
                  <p className="fc-summary">{result.summary}</p>
                </div>
              </div>

              {/* Skill bars */}
              <div className="fc-skill-bars">
                <h4 className="fc-section-title">{strings.skillBreakdown}</h4>
                <div className="fc-bar-legend">
                  <span className="fc-bar-leg-swatch fc-bar-leg-cover" /> {strings.me} &nbsp;
                  <span className="fc-bar-leg-swatch fc-bar-leg-demand" /> {strings.need}
                </div>
                {result.skills_required?.map((s, i) => <SkillBar key={i} skill={s} />)}
              </div>

              {/* Pros / Cons */}
              <div className="fc-proscons">
                <div>
                  <h4 className="fc-section-title">{strings.strengths}</h4>
                  <ul className="fc-list fc-pros-list">
                    {result.pros?.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="fc-section-title">{strings.gaps}</h4>
                  <ul className="fc-list fc-cons-list">
                    {result.cons?.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              </div>

              {/* Reasoning */}
              <div className="fc-reasoning">
                <h4 className="fc-section-title">{strings.chainOfThought}</h4>
                <p>{result.reasoning}</p>
              </div>

              {result.recommendation && (
                <div className="fc-recommendation">
                  <strong>{strings.recommendation}</strong> {result.recommendation}
                </div>
              )}

              <p className="fc-disclaimer">{strings.disclaimer}</p>
              </>
            )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form pinned to bottom */}
      <form className="fc-form" onSubmit={handleSubmit}>
        <label className="fc-label" htmlFor="fc-input">
          {strings.label}
        </label>
        <textarea
          id="fc-input"
          className="fc-textarea"
          rows={4}
          maxLength={4000}
          placeholder={strings.placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={status === 'loading'}
        />
        <div className="fc-form-footer">
          <span className="fc-char-count" dir="ltr">{text.length}/4000</span>
          <button
            type="submit"
            className="fc-submit"
            disabled={status === 'loading' || text.trim().length < 20}
          >
            {status === 'loading' ? strings.assessing : strings.submit}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
/**
 * @param {{ locale: string, strings: object }} props
 *   locale   — forwarded to the API so the verdict matches the page language
 *   strings  — the `fitCheck` section of the active locale dictionary
 */
export default function FitCheck({ locale, strings }) {
  const isRtl = getLocaleMeta(locale).dir === 'rtl';

  // Mobile: bottom sheet toggled open/closed with a persistent tab handle
  const [mobileOpen, setMobileOpen] = useState(false);

  // Desktop panel resize
  const [panelWidth, setPanelWidth] = useState(320);
  const panelRef     = useRef(null);
  const isDragging   = useRef(false);
  const dragStartX   = useRef(0);
  const dragStartW   = useRef(0);

  const onResizeStart = useCallback((e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartW.current = panelRef.current?.offsetWidth ?? 320;
    e.preventDefault();
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging.current) return;
      // The panel is pinned to the inline-end edge. That edge is on the left in
      // RTL, so widening means dragging right and the delta sign must flip.
      const delta = (dragStartX.current - e.clientX) * (isRtl ? -1 : 1);
      setPanelWidth(Math.min(520, Math.max(260, dragStartW.current + delta)));
    };
    const onUp = () => { isDragging.current = false; };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [isRtl]);

  const closePanel = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* ── DESKTOP: fixed inline-end panel ────────────────── */}
      <div className="fc-desktop-panel" ref={panelRef} style={{ width: panelWidth }}>
        <div className="fc-drag-handle" onMouseDown={onResizeStart} />
        <PanelContent locale={locale} strings={strings} />
      </div>

      {/* ── MOBILE: bottom sheet ───────────────────────────── */}
      {!mobileOpen && (
        <motion.div
          className="fc-mobile-tab"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setMobileOpen(true)}
        >
          <span className="fc-mobile-tab-label">{strings.mobileTabLabel}</span>
        </motion.div>
      )}

      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fc-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePanel}
            />
            {/* Sheet */}
            <motion.div
              className="fc-bottom-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Drag handle */}
              <div className="fc-sheet-handle" onClick={closePanel} aria-label={strings.closeLabel} />
              <PanelContent locale={locale} strings={strings} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
