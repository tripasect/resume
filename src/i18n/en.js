/**
 * English copy. Mirrors the shape of `fa.js` exactly.
 *
 * The Persian version is the source of truth for tone and content: this English
 * copy says the same things the same way — first person, relaxed, with the same
 * claims — rather than the older, more corporate angle.
 */
export const en = {
  meta: {
    title: 'Web & Systems Developer',
    displayName: 'Alireza Sadjadipour',
    description:
      'Alireza Sadjadipour — full-stack web developer with over a decade of experience building web apps and high-traffic backends, and more recently AI systems.',
    shortDescription:
      'Full-stack developer with over a decade of experience building and shipping web applications.',
    jobTitle: 'Senior Full-Stack & Systems Developer',
    ogImageAlt: 'Alireza Sadjadipour — Senior Full-Stack & Systems Developer',
    keywords: [
      'Alireza Sadjadipour',
      'full-stack developer',
      'senior backend developer',
      'Python developer',
      'Django',
      'FastAPI',
      'Celery',
      'Redis',
      'distributed asynchronous tasks',
      'agentic AI developer',
      'RAG',
      'LangChain',
      'vector databases',
      'large language models',
      'Nuxt 3',
      'Next.js',
      'Vue 3',
      'React',
      'Three.js',
      'WebGL',
      'Docker',
      'CI/CD',
      'resume',
      'portfolio',
    ],
  },

  hero: {
    eyebrow: 'Portfolio & Technology Spotlight — 2026',
    nameLines: ['Alireza', 'Sadjadipour'],
    title:
      'Senior Web (Full-Stack) & Systems Developer: my main focus is backend architecture, data processing, and building AI systems.',
    degreeLine: 'B.Sc. Mathematics and Applications — University of Tehran',
  },

  chapters: {
    apps: {
      number: 'I',
      labelPrefix: 'ACT',
      title: 'Full-Stack Web Developer',
      lead: "I write backends with the flow of data in mind and an eye on the resources under pressure. The most important thing is reaching for the standard, proven tool for each challenge instead of reinventing the wheel. I'm not shy about design either — colours, fonts, animations. I can build a PWA end to end, graphics included. A few projects where I did both the backend and the frontend are below.",
    },
    ai: {
      number: 'II',
      labelPrefix: 'ACT',
      title: 'Intelligent Systems',
      lead: "I like building systems that do their own work: multi-agent agents, RAGs, and running custom language models on our own server. I'm looking for fresh, interesting AI projects — as long as the client is serious about it!",
    },
    systems: {
      number: 'III',
      labelPrefix: 'ACT',
      title: 'DevOps & Infrastructure',
      lead: "I can bring your production infrastructure up and keep it running: I'm comfortable with containers, reverse proxies, monitoring with Grafana, Sentry and Prometheus, and CI/CD routines. I've worked with distributed workflows (Celery, Airflow/Temporal). Taking responsibility is the thing I care about most when it comes to infrastructure and keeping it alive.",
    },
    softskills: {
      number: 'IV',
      labelPrefix: 'ACT',
      title: 'Soft Skills & Interdisciplinary',
      lead: [
        "I enjoy solving technical problems and challenges. If I don't do a job properly I'm not happy, and I take documentation seriously. Reading and writing docs in English is easy for me (",
        { text: 'IELTS 8.0 — 2024', href: '/ielts-certificate.pdf' },
        "); I've taught English professionally, and right now I'm learning French (B1) and German (A2) for fun, since I'm into foreign languages and even linguistics. Pixel and vector design, motion graphics and 2D animation (After Effects), and audio production in DAWs are complementary interdisciplinary skills of mine too.",
      ],
    },
    tech: {
      number: 'V',
      labelPrefix: 'ACT',
      title: 'Technology Keyword Index',
      lead: "A concise list of the frameworks, tools and concepts I've worked with — ready for employers and AI-driven workflows.",
    },
  },

  projects: {
    blipmatch: {
      description:
        'A social discovery game inside a Telegram Mini App. We ran heavy work queues with Celery and Redis so verification happened in the background without slowing the app down; Telegram OAuth, rate limits, and real-time chat over WebSocket connections were just some of the backend challenges. The frontend app has 200+ Vue components, Rive and Lottie animations, multiple themes, Three.js shaders, and multilingual support.',
    },
    nhpmentor: {
      description:
        'A health diagnosis platform with server-side rendering for search visibility. A RAG system with fast vector search across thousands of Canadian government monographs, custom dosage recommendations, and a payment gateway outside Iran. I did the logo myself too.',
    },
    cafekalya: {
      description:
        'A lightweight point-of-sale (POS), digital menu and CRM system for managing orders, tables and the till together; it keeps working with no dependencies even when the internet goes down.',
    },
    dvt: {
      description:
        'An automated content production system with AI agents: several agents research together and produce SEO-friendly content for your website. Local language models (vLLM/Ollama) run it, and the research and writing happen in multiple stages with minimal human oversight.',
    },
    zinoworld: {
      description:
        'A RAG-based immigration consultation app. It supports a vector database for fast search across official government documents, and includes an admin panel, a payment gateway, and educational animations.',
    },
  },

  contactGate: {
    text: 'If you want the infrastructure details or the internal reports, just ask.',
    label: 'Contact me',
  },

  coda: {
    statement: 'Shall we talk? ☕️',
    email: 'Email',
    call: 'Call',
    github: 'GitHub',
    copyright: '© 2026 Alireza Sadjadipour',
  },

  techIndex: {
    selectAriaLabel: 'Technology index format',
    gears: {
      raw: 'Raw List',
      md: 'Markdown',
      ai: 'AI Prompt',
      json: 'JSON',
    },
    copy: 'Copy',
    copied: 'Copied!',
    mdHeading: '## Technology Index',
    mdGroups: {
      languages: 'Languages/Backends',
      ai: 'AI/Agents',
      frontend: 'Frontend/Design',
    },
    aiPromptPrefix:
      'Act as an expert technical recruiter analyzing this candidate: Evaluate these skills for a Senior Python/Django & AI Developer role',
  },

  fitCheck: {
    title:
      'Am I right for your project? Ask my AI — it knows my history and my work and will give you an evidence-based, unbiased opinion on whether I fit your project!',
    mobileTabLabel: 'Am I right for your project? Ask my AI.',
    closeLabel: 'Close',
    label: 'Describe your project or role:',
    placeholder:
      'E.g. a simple online store to take orders and sell accessories — delivered in under 4 weeks.',
    submit: 'Assess',
    assessing: 'Assessing…',
    strengths: 'Strengths',
    gaps: 'Gaps',
    chainOfThought: 'Chain of thought',
    recommendation: 'Recommendation:',
    me: 'Me',
    need: 'Need',
    skillBreakdown: 'Skill Breakdown',
    disclaimer:
      'Advisory only — generated by an LLM briefed on documented history. Conduct your own due diligence.',
    verdicts: {
      STRONG_FIT: 'Strong Fit',
      GOOD_FIT: 'Good Fit',
      PARTIAL_FIT: 'Partial Fit',
      POOR_FIT: 'Poor Fit',
    },
    loadingMessages: [
      'Reviewing history…',
      'Scanning contributions…',
      'Parsing requirements…',
      'Mapping stack…',
      'Cross-referencing skills…',
      'Analysing projects…',
      'Checking infrastructure…',
      'Evaluating capabilities…',
      'Balancing strengths…',
      'Calibrating fit…',
      'Generating verdict…',
      'Validating logic…',
    ],
    errors: {
      invalidResponse: 'The server returned an invalid response. Please try again.',
      // `{status}` is substituted client-side; dictionaries must stay serialisable.
      requestFailed: 'The request failed (HTTP {status}). Please try again.',
      unexpected: 'Unexpected response from server.',
      generic: 'Something went wrong.',
    },
  },

  notFound: {
    title: 'Page not found',
    heading: 'This page is not here',
    body: 'The page you were looking for is not here. Head back to the Alireza Sadjadipour portfolio to browse the work, the technology index, and contact details.',
    link: 'Back to the portfolio',
  },

  a11y: {
    skipToContent: 'Skip to content',
    languageSwitcherLabel: 'Change language',
  },
}

export default en
