'use client'

import React from 'react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

/**
 * ProjectItem
 * @param {string}  name        - Project name; doubles as the heading and alt text
 * @param {string}  [logotype]  - SVG path used as a CSS mask instead of the text name
 * @param {string}  tech        - Language/stack tag
 * @param {string}  description - What it does
 * @param {string}  accentColor - Chapter accent color for the tech tag
 * @param {string}  [href]      - Live URL; when absent the card renders unlinked
 */
const ProjectItem = ({ name, logotype, tech, description, accentColor, href }) => {
  const body = (
    <>
      <div className="project-item-header">
        {logotype ? (
          <>
            {/* Masked logotypes carry no text, so the name is exposed to
                crawlers and screen readers as a real heading. */}
            <h3 className="sr-only">{name}</h3>
            <span
              className="project-logotype"
              aria-hidden="true"
              style={{
                backgroundColor: accentColor,
                WebkitMaskImage: `url(${logotype})`,
                maskImage: `url(${logotype})`,
              }}
            />
          </>
        ) : (
          <h3 className="project-name" style={{ color: accentColor }}>
            {name}
          </h3>
        )}
      </div>
      <p className="project-description">{description}</p>
      {tech && (
        <span className="project-tech" dir="ltr" style={{ color: accentColor }}>
          {tech}
        </span>
      )}
      <div className="project-rule" />
    </>
  )

  return (
    <motion.article className="project-item" variants={itemVariants}>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="project-link"
          style={{ display: 'contents' }}
        >
          {body}
        </a>
      ) : (
        <div className="project-link" style={{ display: 'contents' }}>
          {body}
        </div>
      )}
    </motion.article>
  )
}

/**
 * ProjectList
 * Wraps a list of ProjectItems with scroll-triggered stagger animation.
 */
export const ProjectList = ({ projects, accentColor }) => {
  return (
    <motion.div
      className="project-list"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {projects.map((p) => (
        <ProjectItem key={p.name} {...p} accentColor={accentColor} />
      ))}
    </motion.div>
  )
}

export default ProjectItem
