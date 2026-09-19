'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const Chapter = ({ number, labelPrefix, title, accentColor, children, id }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Parallax for the watermark number
  const watermarkY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])

  const titleId = `${id}-title`

  return (
    <section ref={ref} className="chapter" id={id} aria-labelledby={titleId}>
      {/* Giant roman numeral watermark */}
      <motion.div
        className="chapter-watermark"
        style={{ y: watermarkY, color: accentColor }}
        aria-hidden="true"
      >
        {number}
      </motion.div>

      {/* Chapter header */}
      <motion.div
        className="chapter-header"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="chapter-number-label" style={{ color: accentColor }}>
          {labelPrefix} {number}
        </span>
        <h2 className="chapter-title" id={titleId} style={{ color: accentColor }}>{title}</h2>
        <div className="chapter-rule" style={{ backgroundColor: accentColor }} />
      </motion.div>

      {/* Chapter content */}
      <div className="chapter-content">
        {children}
      </div>
    </section>
  )
}

export default Chapter
