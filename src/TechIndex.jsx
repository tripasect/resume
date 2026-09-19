'use client'

import React, { useState } from 'react'
import { SKILLS } from '@/data/resume'

export default function TechIndex({ accent, strings }) {
  const [gear, setGear] = useState('raw')
  const [copied, setCopied] = useState(false)

  const gears = [
    { id: 'raw', name: strings.gears.raw },
    { id: 'md', name: strings.gears.md },
    { id: 'ai', name: strings.gears.ai },
    { id: 'json', name: strings.gears.json },
  ]

  const getContent = () => {
    switch (gear) {
      case 'raw': return SKILLS.join(', ')
      case 'md':
        return `${strings.mdHeading}\n\n- **${strings.mdGroups.languages}:** ${SKILLS.slice(0, 15).join(', ')}\n- **${strings.mdGroups.ai}:** ${SKILLS.slice(15, 30).join(', ')}\n- **${strings.mdGroups.frontend}:** ${SKILLS.slice(30).join(', ')}`
      case 'ai': return `${strings.aiPromptPrefix}: ${SKILLS.join(', ')}`
      case 'json': return JSON.stringify({ skills: SKILLS }, null, 2)
      default: return ''
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getContent())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* `raw` and `json` are pure technology names, so they stay LTR in every
     locale. The prose formats inherit the page direction. */
  const isCode = gear === 'raw' || gear === 'json'
  const outputDir = isCode ? 'ltr' : undefined

  return (
    <div className="tech-index" style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '0' }}>
      <div className="tech-index-controls" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
        <select
          className="tech-index-select"
          aria-label={strings.selectAriaLabel}
          onChange={(e) => setGear(e.target.value)}
          style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '0.25rem', borderRadius: '0' }}
        >
          {gears.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <button
          type="button"
          className="tech-index-copy"
          onClick={handleCopy}
          style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '0.25rem 0.5rem', cursor: 'pointer' }}
        >
          {copied ? strings.copied : strings.copy}
        </button>
      </div>
      <div
        className="tech-index-output"
        dir={outputDir}
        style={{
          fontFamily: isCode ? 'monospace' : 'var(--font-body)',
          fontSize: '0.8rem',
          color: accent,
          overflow: 'auto',
          maxHeight: '200px',
          whiteSpace: 'pre-wrap',
        }}
      >
        {getContent()}
      </div>
    </div>
  )
}
