/**
 * FitCheck.jsx
 * ─────────────
 * Desktop : fixed right-side panel, always visible while scrolling.
 * Mobile  : bottom sheet, revealed once Act II enters the viewport,
 *           toggled open/closed with a persistent tab handle.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Constants ─────────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL ?? '';

const VERDICT_META = {
  STRONG_FIT:  { label: 'Strong Fit',  color: '#22c55e' },
  GOOD_FIT:    { label: 'Good Fit',    color: '#84cc16' },
  PARTIAL_FIT: { label: 'Partial Fit', color: '#f59e0b' },
  POOR_FIT:    { label: 'Poor Fit',    color: '#ef4444' },
};

// ── Radar Chart ───────────────────────────────────────────────────────────────
function RadarChart({ skills }) {
  if (!skills?.length) return null;

  const SIZE = 260;
  const CENTER = SIZE / 2;
  const RADIUS = 72; // Decreased slightly to give labels more room
  const N = skills.length;
  const angle = (i) => (Math.PI * 2 * i) / N - Math.PI / 2;
  const pt    = (i, r) => ({
    x: CENTER + r * Math.cos(angle(i)),
    y: CENTER + r * Math.sin(angle(i)),
  });

  const rings = [0.25, 0.5, 0.75, 1].map((f) =>
    skills.map((_, i) => { const { x, y } = pt(i, RADIUS * f); return `${x},${y}`; }).join(' ')
  );
  const coverage = skills.map((s, i) => { const { x, y } = pt(i, RADIUS * (s.alireza_score / 100)); return `${x},${y}`; }).join(' ');
  const demand   = skills.map((s, i) => { const { x, y } = pt(i, RADIUS * (s.importance / 100));    return `${x},${y}`; }).join(' ');

  return (
    <div className="fc-radar-wrap">
      {/* Expanded viewBox to -45 to 305 horizontally (350 width) and -10 to 270 vertically (280 height) for extra legend clearance, centering the chart at 130,130 */}
      <svg viewBox="-45 -10 350 280" className="fc-radar" aria-label="Skills radar chart">
        {rings.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        ))}
        {skills.map((_, i) => {
          const { x, y } = pt(i, RADIUS);
          return <line key={i} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />;
        })}
        <polygon points={demand}   fill="rgba(239,68,68,0.12)"  stroke="rgba(239,68,68,0.45)"  strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points={coverage} fill="rgba(34,197,94,0.18)"  stroke="rgba(34,197,94,0.75)"  strokeWidth="2"   strokeLinejoin="round" />
        {skills.map((s, i) => {
          const LABEL_R = RADIUS + 12; // Decreased label offset slightly to stay within viewBox safety bounds
          const { x, y } = pt(i, LABEL_R);
          const anchor = x < CENTER - 4 ? 'end' : x > CENTER + 4 ? 'start' : 'middle';
          return (
            <text key={i} x={x} y={y} textAnchor={anchor} dominantBaseline="middle"
              fontSize="8" fill="rgba(245,240,232,0.7)" fontFamily="inherit">
              {s.name}
            </text>
          );
        })}
        {skills.map((s, i) => {
          const { x, y } = pt(i, RADIUS * (s.alireza_score / 100));
          return <circle key={i} cx={x} cy={y} r="3" fill="#22c55e" stroke="#000" strokeWidth="0.75" />;
        })}
      </svg>
      <div className="fc-radar-legend">
        <span className="fc-leg-swatch" style={{ background: 'rgba(34,197,94,0.75)' }} /> Coverage
        <span className="fc-leg-swatch" style={{ background: 'rgba(239,68,68,0.45)', marginLeft: 10 }} /> Demand
      </div>
    </div>
  );
}

// ── Skill Bar ─────────────────────────────────────────────────────────────────
function SkillBar({ skill }) {
  const gap      = skill.alireza_score - skill.importance;
  const gapColor = gap >= 0 ? '#22c55e' : '#ef4444';
  return (
    <div className="fc-skill-row">
      <div className="fc-skill-header">
        <span className="fc-skill-name">{skill.name}</span>
        <span className="fc-skill-scores">
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
function PanelContent({ onClose }) {
  const [text,     setText]     = useState('');
  const [status,   setStatus]   = useState('idle'); // idle | loading | done | error
  const [result,   setResult]   = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('');
  const bodyRef = useRef(null);

  const pickMessage = useCallback(() => {
    const pool = [
      'Reviewing history…',
      'Scanning contributions…',
      'Parsing requirements…',
      'Mapping stack…',
      'Cross-referencing skills…',
      'Analysing projects…',
      'Checking infrastructure…',
      'Evaluating capabilities…',
      'Balancing strengths…',
      'Calibrating fit…',
      'Generating verdict…',
      'Validating logic…',
    ];
    setLoadingMsg(pool[Math.floor(Math.random() * pool.length)]);
  }, []);

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
        body: JSON.stringify({ projectDescription: text }),
      });
      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          res.ok
            ? 'The server returned an invalid response. Please try again.'
            : `The request failed (HTTP ${res.status}). Please try again.`,
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
        throw new Error('Unexpected response from server.');
      }
    } catch (err) {
      setErrorMsg(err.message ?? 'Something went wrong.');
      setStatus('error');
    }
  }

  const vm = result ? (VERDICT_META[result.verdict] ?? VERDICT_META.PARTIAL_FIT) : null;

  return (
    <div className="fc-panel-inner">
      {/* Header */}
      <div className="fc-panel-header">
        <div className="fc-panel-title-group">
          {/* <span className="fc-panel-eyebrow">fit check</span> */}
          <span className="fc-panel-title">Am I right for your project? Ask my AI — it knows my history and will give you an evidence-based, unbiased opinion on whether I&rsquo;m a fit.</span>
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
                <div className="fc-verdict-score" style={{ color: vm.color }}>
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

              {/* Radar */}
              <RadarChart skills={result.skills_required} />

              {/* Skill bars */}
              <div className="fc-skill-bars">
                <h4 className="fc-section-title">Skill Breakdown</h4>
                <div className="fc-bar-legend">
                  <span className="fc-bar-leg-swatch fc-bar-leg-cover" /> Me &nbsp;
                  <span className="fc-bar-leg-swatch fc-bar-leg-demand" /> Need
                </div>
                {result.skills_required?.map((s, i) => <SkillBar key={i} skill={s} />)}
              </div>

              {/* Pros / Cons */}
              <div className="fc-proscons">
                <div>
                  <h4 className="fc-section-title">Strengths</h4>
                  <ul className="fc-list fc-pros-list">
                    {result.pros?.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="fc-section-title">Gaps</h4>
                  <ul className="fc-list fc-cons-list">
                    {result.cons?.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              </div>

              {/* Reasoning */}
              <div className="fc-reasoning">
                <h4 className="fc-section-title">Chain of thought</h4>
                <p>{result.reasoning}</p>
              </div>

              {result.recommendation && (
                <div className="fc-recommendation">
                  <strong>Recommendation:</strong> {result.recommendation}
                </div>
              )}

              <p className="fc-disclaimer">
                Advisory only — generated by an LLM briefed on documented history.
                Conduct your own due diligence.
              </p>
              </>
            )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form pinned to bottom */}
      <form className="fc-form" onSubmit={handleSubmit}>
        <label className="fc-label" htmlFor="fc-input">
          Describe your project or role:
        </label>
        <textarea
          id="fc-input"
          className="fc-textarea"
          rows={4}
          maxLength={4000}
          placeholder="E.g. Full-stack SaaS MVP with React + Node, LLM content generation, 6-week timeline…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={status === 'loading'}
        />
        <div className="fc-form-footer">
          <span className="fc-char-count">{text.length}/4000</span>
          <button
            type="submit"
            className="fc-submit"
            disabled={status === 'loading' || text.trim().length < 20}
          >
            {status === 'loading' ? 'Assessing…' : 'Assess'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
/**
 * @param {{ act2Ref: React.RefObject }} props
 *   act2Ref  — ref attached to the Act II section element in App.jsx
 */
export default function FitCheck({ act2Ref }) {
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
      const delta = dragStartX.current - e.clientX;
      setPanelWidth(Math.min(520, Math.max(260, dragStartW.current + delta)));
    };
    const onUp = () => { isDragging.current = false; };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  const closePanel = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* ── DESKTOP: fixed right panel ─────────────────────── */}
      <div className="fc-desktop-panel" ref={panelRef} style={{ width: panelWidth }}>
        <div className="fc-drag-handle" onMouseDown={onResizeStart} />
        <PanelContent />
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
          <span className="fc-mobile-tab-label">Am I right for your project? Ask my AI.</span>
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
              <div className="fc-sheet-handle" onClick={closePanel} aria-label="Close" />
              <PanelContent onClose={closePanel} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
