import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * ProjectItem
 * @param {string}  name       - Repo/project name (used as alt text / fallback)
 * @param {string}  [logotype] - Path to an SVG/PNG logotype; replaces the text name when present
 * @param {string}  tech       - Language/stack tag
 * @param {string}  description - What it does
 * @param {string}  accentColor - Chapter accent color for the tech tag
 */
const ProjectItem = ({ name, logotype, tech, description, accentColor, href }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end start'],
  });
  const isVisible = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <motion.div
      ref={ref}
      className="project-item"
      variants={itemVariants}
    >
      <a href={href} target="_blank" rel="noreferrer" className="project-link" style={{ display: 'contents' }}>
        <div className="project-item-header">
          {logotype ? (
            <span
              className="project-logotype"
              role="img"
              aria-label={name}
              style={{
                backgroundColor: accentColor,
                WebkitMaskImage: `url(${logotype})`,
                maskImage: `url(${logotype})`,
              }}
            />
          ) : (
            <span className="project-name" style={{ color: accentColor }}>
              {name}
            </span>
          )}
        </div>
        <p className="project-description">{description}</p>
        {tech && (
          <span className="project-tech" style={{ color: accentColor }}>
            {tech}
          </span>
        )}
        <div className="project-rule" />
      </a>
    </motion.div>
  );
};

/**
 * ProjectList
 * Wraps a list of ProjectItems with scroll-triggered stagger animation.
 */
export const ProjectList = ({ projects, accentColor }) => {
  const ref = useRef(null);

  return (
    <motion.div
      ref={ref}
      className="project-list"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {projects.map((p, i) => (
        <ProjectItem key={i} {...p} accentColor={accentColor} />
      ))}
    </motion.div>
  );
};

export default ProjectItem;
