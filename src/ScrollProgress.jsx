import React from 'react';
import { motion, useTransform } from 'framer-motion';

const chapters = [
  { label: 'Overture',         number: '—'  },
  { label: 'Full-Stack Eng',   number: 'I'  },
  { label: 'Agentic AI',       number: 'II' },
  { label: 'Systems & Ops',    number: 'III'},
  { label: 'Soft Skills',      number: 'IV' },
  { label: 'Tech Index',       number: 'V'  },
  { label: 'Coda',             number: '∞'  },
];

const ACCENT_COLORS = ['#F5F0E8', '#ff2760', '#2DD4BF', '#F59E0B', '#A78BFA', '#48ec56', '#F5F0E8'];

const ScrollProgress = ({ scrollYProgress, activeChapter }) => {
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="scroll-progress">
      {/* The overall track */}
      <div className="scroll-track">
        <motion.div
          className="scroll-fill"
          style={{ scaleY, originY: 0, backgroundColor: ACCENT_COLORS[activeChapter] ?? '#F5F0E8' }}
        />
      </div>

      {/* Chapter dots */}
      <div className="chapter-dots">
        {chapters.map((ch, i) => (
          <div
            key={i}
            className={`chapter-dot-wrapper ${activeChapter === i ? 'active' : ''}`}
            title={ch.label}
          >
            <div
              className="chapter-dot"
              style={{
                backgroundColor: activeChapter >= i ? ACCENT_COLORS[i] : 'transparent',
                borderColor: ACCENT_COLORS[i],
              }}
            />
            <span className="chapter-dot-label">{ch.number}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollProgress;
