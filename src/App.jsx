import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import './index.css';
import Triangles from './Triangles';
import Chapter from './Chapter';
import { ProjectList } from './ProjectItem';
import FitCheck from './FitCheck';
import blipMatchLogo from './assets/project-logotypes/BlipMatch!.svg';
import nhpMentorLogo from './assets/project-logotypes/NHPMentor.svg';
import ZinoWorldLogo from './assets/project-logotypes/ZinoWorld.svg';
import DvtLogo from './assets/project-logotypes/dvt-logo-no-bg.svg';
import cafekalyaLogo from './assets/project-logotypes/cafekalya.svg';


// ─── Chapter accent colors ─────────────────────────────────────────────────────
// 0=hero, 1=Apps, 2=AI, 3=Graphics, 4=Networks, 5=Sound, 6=Languages, 7=coda
const ACCENTS = [
  '#F5F0E8',   // hero
  '#ff2760',   // I  — Web-Apps
  '#2DD4BF',   // II — Agentic AI
  '#F59E0B',   // III — Motion & Craft
  '#EF4444',   // IV — The Network
  '#48ec56',   // V  — Sound
  '#A78BFA',   // VI — Languages
  '#F5F0E8',   // coda
];

// ─── Act I — Complex Web / Mobile Applications ────────────────────────────────
const appProjects = [
  {
    name: 'BlipMatch!',
    logotype: blipMatchLogo,
    tech: 'Vue · Vue Router · Pinia ·  Telegram SDK · Lottie',
    description:
      'An anti-swipe, ambient social-discovery app built inside Telegram. Features 200+ custom components, interactive icebreakers, FM co-listening, and digital gift conversions — built around a dark, late-night aesthetic.',
     href: 'https://t.me/blipmatchbot',
     screenshots: ['https://via.placeholder.com/400x200?text=BlipMatch+Screenshot+1', 'https://via.placeholder.com/400x200?text=BlipMatch+Screenshot+2'],
   },
   {
     name: 'Cafekalya',
     logotype: cafekalyaLogo,
     tech: 'Vanila JS · Node.js',
     description:
       'Digital menu with funny-looking aesthetic integrated with a built-in compact CRM/cashier system.',
     href: 'https://cafekalya.ir',
     screenshots: ['https://via.placeholder.com/400x200?text=Cafekalya+Screenshot+1', 'https://via.placeholder.com/400x200?text=Cafekalya+Screenshot+2'],
   }
];

// ─── Act II — Agentic AI Systems ──────────────────────────────────────────────
const aiProjects = [
  {
    name: 'dvt',
    logotype: DvtLogo,
    tech: 'Python · LangChain · Multi-Agent',
    description:
      'An agentic AI system made up of modular, autonomous components that collaborate toward the shared goal of generating SEO-optimized ready-to-publish multi-media articles. Each module covers a specialized domain — planning, retrieval, execution, validation — passing control without requiring human input between steps.',
    screenshots: ['https://via.placeholder.com/400x200?text=DVT+Screenshot+1', 'https://via.placeholder.com/400x200?text=DVT+Screenshot+2'],
  },
  {
    name: 'Zino Bot',
    logotype: ZinoWorldLogo,
    tech: 'Python · LangChain · RAG · Pinecone',
    href: 'https://bot.zinoa.ai',
    description:
      'A RAG-powered chatbot for navigating immigration law. Supports multilingual queries across Pinecone/FAISS vector stores, with LangChain pipelines and a curated legal knowledge base.',
    screenshots: ['https://via.placeholder.com/400x200?text=ZinoBot+Screenshot+1', 'https://via.placeholder.com/400x200?text=ZinoBot+Screenshot+2'],
  },
  {
    name: 'NHPMentor',
    logotype: nhpMentorLogo,
    tech: 'Nuxt 3 · Vue · Python · AI',
    description:
      'A hybrid Nuxt 3 platform for a natural health brand — combining SSR for discoverability with SPA interactivity. Includes AI-assisted Q&A, product search, dosage evaluation, and an admin panel.',
    href: 'https://nhpmentor.com/',
    screenshots: ['https://via.placeholder.com/400x200?text=NHPMentor+Screenshot+1', 'https://via.placeholder.com/400x200?text=NHPMentor+Screenshot+2'],
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
          <p className="hero-eyebrow">Portfolio — 2026</p>
          <h1 className="hero-name">
            <span>Alireza</span>
            <span>Sadjadipour</span>
          </h1>
          <p className="hero-title">
            A builder across disciplines — software, AI, design, and sound. Here is a selection of what I've worked on.
          </p>
          <div className="hero-meta">
            <a href="mailto:hello@alirezasadjadipour.ir">hello@alirezasadjadipour.ir</a>
            <span>+98 938 724 7153</span>
            <span>B.Sc. Mathematics — University of Tehran</span>
          </div>
        </motion.section>

        {/* ── Act I: Web-Apps ─────────────────────────── */}
        <div data-chapter-index="1">
          <Chapter number="I" title="Web-Apps" accentColor={ACCENTS[1]} id="act-apps">
            <p className="chapter-lead">
              Web and mobile applications with a focus on detail — component-rich interfaces, Lottie animations, and interactive icons that try to feel considered rather than generic.
            </p>
            <ProjectList projects={appProjects} accentColor={ACCENTS[1]} />
          </Chapter>
        </div>

        {/* ── Act II: Agentic AI ────────────────────────────── */}
        <div data-chapter-index="2" ref={act2Ref}>
          <Chapter number="II" title="Agentic AI" accentColor={ACCENTS[2]} id="act-ai">
            <p className="chapter-lead">
              AI systems built around modular, cooperating agents — planners, retrievers, validators, and executors working toward a shared goal with minimal human intervention.
            </p>
            <ProjectList projects={aiProjects} accentColor={ACCENTS[2]} />
          </Chapter>
        </div>

        {/* ── Act III: Motion & Craft ───────────────────────── */}
        <div data-chapter-index="3">
          <Chapter number="III" title="Motion & Craft" accentColor={ACCENTS[3]} id="act-graphics">
            <p className="chapter-lead">
              Graphical assets, animated icons, After Effects sequences, and photography — a quieter side of the work, available to view on request.
            </p>
            <ContactGate
              text="Work not publicly listed — reach out to see the gallery."
              href="mailto:hello@alirezasadjadipour.ir?subject=Gallery Request"
              label="Contact me"
              accent={ACCENTS[3]}
              isExternal={false}
            />
          </Chapter>
        </div>

        {/* ── Act IV: The Network ───────────────────────────── */}
        <div data-chapter-index="4">
          <Chapter number="IV" title="The Network" accentColor={ACCENTS[4]} id="act-networks">
            <p className="chapter-lead">
              Infrastructure work — routing, load balancing, containers, and inter-service connectivity. Mostly practical solutions to real constraints.
            </p>
            <ContactGate
              text="Deeper infrastructure and networking work is not publicly available. Contact me to discuss further."
              href="mailto:hello@alirezasadjadipour.ir?subject=Networking Work"
              label="Contact me"
              accent={ACCENTS[4]}
              isExternal={false}
            />
          </Chapter>
        </div>

        {/* ── Act V: Sound ──────────────────────────────────── */}
        <div data-chapter-index="5">
          <Chapter number="V" title="Sound" accentColor={ACCENTS[5]} id="act-Sound">
            <p className="chapter-lead">
              Audio recording, DAW production, vocal work, podcasts, and mixtapes. Probably not on the job description, but it shapes how I think about rhythm and attention.
            </p>
            <ContactGate
              text="Listen on SoundCloud."
              href="https://soundcloud.com/tripasect"
              label="soundcloud.com/tripasect"
              accent={ACCENTS[5]}
              isExternal
            />
          </Chapter>
        </div>

        {/* ── Act VI: Languages ─────────────────────────────── */}
        <div data-chapter-index="6">
          <Chapter number="VI" title="Languages" accentColor={ACCENTS[6]} id="act-languages">
            <p className="chapter-lead">
              I've taught English, hold an IELTS certificate, have a working knowledge of French, and run a small YouTube series on learning German. Language learning has been a consistent thread.
            </p>
          </Chapter>
        </div>

        {/* ── Coda ──────────────────────────────────────────── */}
        <div data-chapter-index="7">
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
