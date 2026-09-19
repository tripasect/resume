import BackgroundCanvas from '@/BackgroundCanvas'
import Chapter from '@/Chapter'
import FitCheck from '@/FitCheck'
import PageShell from '@/PageShell'
import Reveal from '@/Reveal'
import TechIndex from '@/TechIndex'
import { ProjectList } from '@/ProjectItem'
import { ACCENTS, SITE, fullStackProjects, aiProjects } from '@/data/resume'
import { getDictionary, toLocaleDigits } from '@/i18n'

/** Attaches the locale-specific description to each language-neutral project. */
function localizeProjects(projects, dict) {
  return projects.map((project) => ({
    ...project,
    description: dict.projects[project.id].description,
  }))
}

function Hero({ locale, dict }) {
  return (
    <>
      <p className="hero-eyebrow">{dict.hero.eyebrow}</p>
      <h1 className="hero-name" id="hero-name">
        {dict.hero.nameLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h1>
      <p className="hero-title">{dict.hero.title}</p>
      <div className="hero-meta">
        {/* Latin contact strings stay LTR even inside the RTL layout, and the
            phone number keeps LTR ordering so its digit groups cannot be
            reordered by the bidi algorithm. */}
        <a href={`mailto:${SITE.email}`} dir="ltr">{SITE.email}</a>
        <span dir="ltr">{toLocaleDigits(SITE.phoneDisplay, locale)}</span>
        <span>{dict.hero.degreeLine}</span>
      </div>
    </>
  )
}

function ContactGate({ text, href, label, accent, isExternal }) {
  return (
    <Reveal className="contact-gate" y={20} duration={0.6} style={{ borderTopColor: accent }}>
      <p className="contact-gate-text">{text}</p>
      <a
        className="contact-gate-btn"
        href={href}
        style={{ color: accent }}
        {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {label}
      </a>
    </Reveal>
  )
}

function Coda({ dict }) {
  return (
    <Reveal as="section" className="coda" duration={1} y={0} margin="-100px">
      <p className="coda-statement" style={{ color: ACCENTS[0] }}>
        {dict.coda.statement}
      </p>
      <div className="coda-contact">
        <a className="coda-link" href={`mailto:${SITE.email}`}>{dict.coda.email}</a>
        <a className="coda-link" href={`tel:${SITE.phone}`}>{dict.coda.call}</a>
        <a className="coda-link" href={SITE.github} target="_blank" rel="noreferrer">{dict.coda.github}</a>
      </div>
      <p className="coda-copyright">{dict.coda.copyright}</p>
    </Reveal>
  )
}

export default function Home({ locale }) {
  const dict = getDictionary(locale)
  const chapters = dict.chapters

  return (
    <>
      {/* Fixed decorative WebGL background */}
      <BackgroundCanvas />

      {/* FitCheck — fixed start panel (desktop) / bottom sheet (mobile) */}
      <FitCheck locale={locale} strings={dict.fitCheck} />

      <PageShell
        hero={<Hero locale={locale} dict={dict} />}
        coda={<div data-chapter-index="6"><Coda dict={dict} /></div>}
      >
        {/* ── Act I: Full-Stack Engineering ─────────────────────────── */}
        <div data-chapter-index="1">
          <Chapter
            number={chapters.apps.number}
            labelPrefix={chapters.apps.labelPrefix}
            title={chapters.apps.title}
            accentColor={ACCENTS[1]}
            id="act-apps"
          >
            <p className="chapter-lead">{chapters.apps.lead}</p>
            <ProjectList
              projects={localizeProjects(fullStackProjects, dict)}
              accentColor={ACCENTS[1]}
            />
          </Chapter>
        </div>

        {/* ── Act II: Agentic AI & RAG Engineering ─────────────────── */}
        <div data-chapter-index="2">
          <Chapter
            number={chapters.ai.number}
            labelPrefix={chapters.ai.labelPrefix}
            title={chapters.ai.title}
            accentColor={ACCENTS[2]}
            id="act-ai"
          >
            <p className="chapter-lead">{chapters.ai.lead}</p>
            <ProjectList
              projects={localizeProjects(aiProjects, dict)}
              accentColor={ACCENTS[2]}
            />
          </Chapter>
        </div>

        {/* ── Act III: Systems, Networking & Infrastructure ──────────── */}
        <div data-chapter-index="3">
          <Chapter
            number={chapters.systems.number}
            labelPrefix={chapters.systems.labelPrefix}
            title={chapters.systems.title}
            accentColor={ACCENTS[3]}
            id="act-networks"
          >
            <p className="chapter-lead">{chapters.systems.lead}</p>
            <ContactGate
              text={dict.contactGate.text}
              href={`mailto:${SITE.email}?subject=Infrastructure %26 Systems Engineering`}
              label={dict.contactGate.label}
              accent={ACCENTS[3]}
              isExternal={false}
            />
          </Chapter>
        </div>

        {/* ── Act IV: Soft Skills & Interdisciplinary Mastery ────────── */}
        <div data-chapter-index="4">
          <Chapter
            number={chapters.softskills.number}
            labelPrefix={chapters.softskills.labelPrefix}
            title={chapters.softskills.title}
            accentColor={ACCENTS[4]}
            id="act-softskills"
          >
            <p className="chapter-lead">
              {chapters.softskills.lead.map((segment, i) =>
                typeof segment === 'string' ? (
                  <span key={i}>{segment}</span>
                ) : (
                  <a
                    key={i}
                    href={segment.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: ACCENTS[4], textDecoration: 'underline' }}
                  >
                    {segment.text}
                  </a>
                )
              )}
            </p>
          </Chapter>
        </div>

        {/* ── Act V: Machine-Readable Comprehensive Technology Index ──── */}
        <div data-chapter-index="5">
          <Chapter
            number={chapters.tech.number}
            labelPrefix={chapters.tech.labelPrefix}
            title={chapters.tech.title}
            accentColor={ACCENTS[5]}
            id="act-tech-index"
          >
            <p className="chapter-lead">{chapters.tech.lead}</p>
            <TechIndex accent={ACCENTS[5]} strings={dict.techIndex} />
          </Chapter>
        </div>
      </PageShell>
    </>
  )
}
