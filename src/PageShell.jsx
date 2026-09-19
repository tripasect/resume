'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * Owns the scrolling container and the scroll-linked hero fade.
 * `hero`, `coda`, and `children` are passed in as already server-rendered
 * nodes, so all résumé copy still lands in the pre-rendered HTML.
 */
export default function PageShell({ hero, coda, children }) {
  const pageRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ['start start', 'end end'],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.06], [0, -60])

  return (
    <main className="page-wrapper" id="main" ref={pageRef}>
      <motion.section
        className="hero"
        data-chapter-index="0"
        aria-labelledby="hero-name"
        style={{ opacity: heroOpacity, y: heroY }}
      >
        {hero}
      </motion.section>

      {children}

      {coda}
    </main>
  )
}
