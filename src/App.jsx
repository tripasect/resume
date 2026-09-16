import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import './index.css';
import Triangles from './Triangles';
import Chapter from './Chapter';
import { ProjectList } from './ProjectItem';
import FitCheck from './FitCheck';
import TechIndex from './TechIndex';
import blipMatchLogo from './assets/project-logotypes/BlipMatch!.svg';
import nhpMentorLogo from './assets/project-logotypes/NHPMentor.svg';
import ZinoWorldLogo from './assets/project-logotypes/ZinoWorld.svg';
import DvtLogo from './assets/project-logotypes/dvt-logo-no-bg.svg';
import cafekalyaLogo from './assets/project-logotypes/cafekalya.svg';


// ─── Chapter accent colors ─────────────────────────────────────────────────────
// 0=hero, 1=Full-Stack Eng, 2=Agentic AI, 3=Systems & Ops, 4=Soft Skills, 5=Tech Index, 6=coda
const ACCENTS = [
  '#F5F0E8',   // hero
  '#ff2760',   // I  — Full-Stack Engineering & Web-Apps
  '#2DD4BF',   // II — Agentic AI & RAG Engineering
  '#F59E0B',   // III — Systems, Networking & Observability
  '#A78BFA',   // IV — Soft Skills & Interdisciplinary Mastery
  '#48ec56',   // V  — Machine-Readable Technology Index
  '#F5F0E8',   // coda
];

// ─── Act I — Full-Stack & Web-Apps ─────────────────────────────────────────────
const fullStackProjects = [
  {
    name: 'BlipMatch!',
    logotype: blipMatchLogo,
    tech: 'Python · Django · Celery · Asyncio · Redis · PostgreSQL · Telegram OAuth · Vue 3 · Pinia · Vue Router · Rive · Lottie · Three.js · i18n',
    description:
      'State-of-the-art social discovery platform & Telegram Mini App. Engineered high-throughput distributed task queues with Celery & Redis for asynchronous background AI verification, automated load-testing, Telegram OAuth authentication, and rate-limiting. Frontend features 200+ reactive components utilizing Vue 3, Pinia, Vue Router, interactive Rive & Lottie keyframe animations, Three.js canvas shaders, and multi-language i18n localization.',
    href: 'https://t.me/blipmatchbot',
  },
  {
    name: 'NHPMentor',
    logotype: nhpMentorLogo,
    tech: 'Nuxt 3 · Vue 3 · Python · Vector Search · PostgreSQL · REST APIs',
    description:
      'Hybrid Nuxt 3 e-commerce & AI health diagnosis platform. Combines SSR for search engine discoverability with interactive SPA user flows. Integrates real-time vector search, custom dosage recommendation engines, secure payment gateway integrations, and complete backend telemetry.',
    href: 'https://nhpmentor.com/',
  },
  {
    name: 'Cafekalya',
    logotype: cafekalyaLogo,
    tech: 'JavaScript · Node.js · Express · SQLite · Custom UI',
    description:
      'Lightweight POS, digital menu, and CRM system engineered for real-time order processing, table management, and cashier workflow automation with zero-dependency offline resilience.',
    href: 'https://cafekalya.ir',
  }
];

// ─── Act II — Agentic AI & RAG Systems ─────────────────────────────────────────
const aiProjects = [
  {
    name: 'dvt',
    logotype: DvtLogo,
    tech: 'Python · LangChain · Multi-Agent Orchestration · Ollama / vLLM · Loop Engineering · Prompt Harnessing',
    description:
      'Autonomous agentic AI content production suite leveraging modular, cooperating agents (Planner, Retriever, Drafting Agent, Quality Inspector, Executor) built with Python and LangChain. Integrates local LLM instances (vLLM/Ollama) with prompt harnessing and iterative evaluation loops to execute multi-step research and content generation completely hands-free.',
  },
  {
    name: 'Zino Bot & ZinoWorld',
    logotype: ZinoWorldLogo,
    tech: 'Python · LangChain · RAG · Vector DB (Pinecone & FAISS) · OpenAI API · Nuxt 3 · Three.js',
    href: 'https://bot.zinoa.ai',
    description:
      'Production RAG system and interactive brand portal. Features vector database indexing across legal knowledge bases with Pinecone and FAISS, fine-tuned hybrid retrieval algorithms, strict prompt guardrails, and a WebGL-enhanced frontend build.',
  },
];



// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [scrollY, setScrollY] = useState(0);
  const [accentIndex, setAccentIndex] = useState(0);
  const pageRef  = useRef(null);
  const act2Ref  = useRef(null); // passed to FitCheck for mobile trigger

  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end end'] });

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const chapters = document.querySelectorAll('[data-chapter-index]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.chapterIndex, 10);
            setAccentIndex(idx);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );
    chapters.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const heroY       = useTransform(scrollYProgress, [0, 0.06], [0, -60]);

  const ContactGate = ({ text, href, label, accent, isExternal }) => (
    <motion.div
      className="contact-gate"
      style={{ borderTopColor: accent }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="contact-gate-text">{text}</p>
      <a
        className="contact-gate-btn"
        href={href}
        style={{ color: accent }}
        {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {label}
      </a>
    </motion.div>
  );

  return (
    <>
      {/* Fixed 3D background */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 8], fov: 70 }}>
          <ambientLight intensity={0.3} />
          <Triangles scrollY={scrollY} accentIndex={accentIndex} />
        </Canvas>
      </div>

      {/* FitCheck — fixed right panel (desktop) / bottom sheet (mobile) */}
      <FitCheck act2Ref={act2Ref} />

      {/* Page content */}
      <div className="page-wrapper" ref={pageRef}>

        {/* ── Overture: Hero ─────────────────────────────────── */}
        <motion.section
          className="hero"
          data-chapter-index="0"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <p className="hero-eyebrow">Portfolio & Technology Spotlight — 2026</p>
          <h1 className="hero-name">
            <span>Alireza</span>
            <span>Sadjadipour</span>
          </h1>
          <p className="hero-title">
            Senior Full-Stack & Systems Engineer with a heavy focus on backend architecture, asynchronous task processing, distributed queue orchestration, observability, and agentic AI systems.
          </p>
          <div className="hero-meta">
            <a href="mailto:hello@alirezasadjadipour.ir">hello@alirezasadjadipour.ir</a>
            <span>+98 938 724 7153</span>
            <span>B.Sc. Mathemathics and Applications — University of Tehran</span>
          </div>
        </motion.section>

        {/* ── Act I: Full-Stack Engineering ─────────────────────────── */}
        <div data-chapter-index="1">
          <Chapter number="I" title="Full-Stack Engineering" accentColor={ACCENTS[1]} id="act-apps">
            <p className="chapter-lead">
              High-throughput backend systems engineered alongside rich, reactive frontend interfaces. Deep experience in Python/Django/FastAPI ecosystems, distributed task processing with Celery and Redis, load-testing, and real-time async communication coupled with state-of-the-art UI architectures.
            </p>
            <ProjectList projects={fullStackProjects} accentColor={ACCENTS[1]} />
          </Chapter>
        </div>

        {/* ── Act II: Agentic AI & RAG Engineering ─────────────────── */}
        <div data-chapter-index="2" ref={act2Ref}>
          <Chapter number="II" title="Agentic AI & RAG" accentColor={ACCENTS[2]} id="act-ai">
            <p className="chapter-lead">
              Autonomous multi-agent architectures, RAG pipelines, vector retrieval optimization, local model deployment, and AI workflow harnessing. Excited to join innovative, state-of-the-art generative AI initiatives.
            </p>
            <ProjectList projects={aiProjects} accentColor={ACCENTS[2]} />
          </Chapter>
        </div>

        {/* ── Act III: Systems, Networking & Infrastructure ──────────── */}
        <div data-chapter-index="3">
          <Chapter number="III" title="Systems & Infrastructure" accentColor={ACCENTS[3]} id="act-networks">
            <p className="chapter-lead">
              Production infrastructure management, containerized deployments, reverse proxy setups, and application monitoring. Experienced with observability stack integration (Grafana, Sentry, Prometheus), distributed task workflows (Celery, Airflow/Temporal paradigms), and robust CI/CD routines.
            </p>
            <ContactGate
              text="Detailed infrastructure configurations and internal telemetry setups available upon request."
              href="mailto:hello@alirezasadjadipour.ir?subject=Infrastructure & Systems Engineering"
              label="Contact me"
              accent={ACCENTS[3]}
              isExternal={false}
            />
          </Chapter>
        </div>

        {/* ── Act IV: Soft Skills & Interdisciplinary Mastery ────────── */}
        <div data-chapter-index="4">
          <Chapter number="IV" title="Soft Skills & Interdisciplinary" accentColor={ACCENTS[4]} id="act-softskills">
            <p className="chapter-lead">
              Autonomous problem solver with strong solo ownership (90%+ solo execution capacity), clear technical documentation habits, and disciplined daily routines. High proficiency in reading and writing technical English specifications (C1 IELTS certified). Taught English professionally; active learner of French (B1) and German (A2). Creative design, motion graphics (After Effects), and DAW audio production serve as complementary interdisciplinary skills to technical execution.
            </p>
          </Chapter>
        </div>

        {/* ── Act V: Machine-Readable Comprehensive Technology Index ──── */}
        <div data-chapter-index="5">
          <Chapter number="V" title="Technology Keyword Index" accentColor={ACCENTS[5]} id="act-tech-index">
            <p className="chapter-lead">
              A comprehensive, machine-readable keyword index of frameworks, libraries, tools, protocols, and architectural paradigms I comfortably operate with — provisioned for recruiters and AI indexing systems.
            </p>
            <TechIndex accent={ACCENTS[5]} />
          </Chapter>
        </div>

        {/* ── Coda ──────────────────────────────────────────── */}
        <div data-chapter-index="6">
          <motion.section
            className="coda"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1 }}
          >
            <p className="coda-statement" style={{ color: ACCENTS[0] }}>
              Let's talk. ☕️
            </p>
            <div className="coda-contact">
              <a className="coda-link" href="mailto:hello@alirezasadjadipour.ir">Email</a>
              <a className="coda-link" href="tel:+989387247153">Call</a>
              <a className="coda-link" href="https://github.com/tripasect" target="_blank" rel="noreferrer">GitHub</a>
            </div>
            <p className="coda-copyright">© 2026 Alireza Sadjadipour</p>
          </motion.section>
        </div>

      </div>
    </>
  );
}

export default App;
