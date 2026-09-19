'use client'

import { motion } from 'framer-motion'

/* Explicit map instead of a dynamic `motion[as]` lookup: keeps the element
   type stable across renders and avoids proxying an unknown tag. */
const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
}

/**
 * Scroll-triggered fade/rise wrapper. Renders server-rendered children inside
 * a client motion container.
 */
export default function Reveal({
  children,
  className,
  as = 'div',
  delay = 0,
  duration = 0.6,
  y = 20,
  margin = '-60px',
  style,
}) {
  const Tag = TAGS[as] ?? motion.div

  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  )
}
