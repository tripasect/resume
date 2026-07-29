import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const NarrativeSection = ({ title, content, delay, scrollOffsetStart, scrollOffsetEnd }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [scrollOffsetStart, scrollOffsetEnd],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [200, 0, -200]);

  return (
    <motion.div
      ref={ref}
      className="narrative-section"
      style={{ opacity, y }}
      initial={{ opacity: 0, y: 200 }}
      // animate={{ opacity: 1, y: 0 }} handled by style
      transition={{ duration: 0.5, delay }}
    >
      <h2>{title}</h2>
      <p dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
    </motion.div>
  );
};

export default NarrativeSection;
