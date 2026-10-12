'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const ACCENT_HEX = [
  '#F5F0E8',
  '#ff2760',
  '#2DD4BF',
  '#F59E0B',
  '#A78BFA',
  '#48ec56',
  '#F5F0E8',
]

export default function BackgroundCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    } catch {
      // The background is decorative; keep the page usable without WebGL.
      return undefined
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 100)
    camera.position.set(0, 0, 8)

    const count = 10
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([
      0, 0, 0,
      1, 0, 0,
      0, 1, 0,
    ], 3))

    const material = new THREE.MeshBasicMaterial({
      color: '#FFFFFF',
      transparent: true,
      opacity: 0.12,
    })
    const mesh = new THREE.InstancedMesh(geometry, material, count)
    scene.add(mesh)

    const positions = Array.from({ length: count }, () => new THREE.Vector3(
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 14,
      0,
    ))
    const scales = Array.from({ length: count }, () => 0.3 + Math.random() * 0.8)
    const dummy = new THREE.Object3D()
    const targetColor = new THREE.Color(ACCENT_HEX[0])
    const currentColor = new THREE.Color(ACCENT_HEX[0])
    const scroll = { y: window.scrollY, accentIndex: 0 }

    const resize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    const onScroll = () => { scroll.y = window.scrollY }
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })

    const chapters = document.querySelectorAll('[data-chapter-index]')
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            scroll.accentIndex = Number.parseInt(entry.target.dataset.chapterIndex, 10) || 0
          }
        })
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    )
    chapters.forEach((chapter) => observer?.observe(chapter))

    let frameId
    const animate = (now) => {
      const time = now * 0.001
      const accentIndex = Math.min(scroll.accentIndex, ACCENT_HEX.length - 1)
      targetColor.set(ACCENT_HEX[accentIndex])
      currentColor.lerp(targetColor, 0.03)
      material.color.copy(currentColor)

      for (let i = 0; i < count; i += 1) {
        const position = positions[i]
        const scale = scales[i] * (1 + Math.sin(time * 0.05 + i) * 0.05)
        dummy.position.set(
          position.x + Math.sin(time * 0.03 + i * 0.7) * 0.15,
          position.y + Math.cos(time * 0.02 + i * 0.5) * 0.1 - scroll.y * 0.0008,
          position.z,
        )
        dummy.rotation.set(0, 0, Math.sin(time * 0.02 + i * 0.4) * Math.PI)
        dummy.scale.set(scale * 2, scale, scale)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(animate)
    }

    frameId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      observer?.disconnect()
      scene.remove(mesh)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div className="canvas-container" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
