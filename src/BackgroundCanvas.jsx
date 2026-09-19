'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

/* WebGL is decorative and browser-only, so it is loaded after hydration and
   kept out of the pre-rendered HTML entirely. */
const Canvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false },
)

const Triangles = dynamic(() => import('@/Triangles'), { ssr: false })

export default function BackgroundCanvas() {
  const [scrollY, setScrollY] = useState(0)
  const [accentIndex, setAccentIndex] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Follow whichever chapter currently owns the viewport centre.
  useEffect(() => {
    const chapters = document.querySelectorAll('[data-chapter-index]')
    if (!chapters.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAccentIndex(parseInt(entry.target.dataset.chapterIndex, 10))
          }
        })
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    )

    chapters.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="canvas-container" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 8], fov: 70 }}>
        <ambientLight intensity={0.3} />
        <Triangles scrollY={scrollY} accentIndex={accentIndex} />
      </Canvas>
    </div>
  )
}
