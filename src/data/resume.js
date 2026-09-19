/**
 * Language-neutral résumé data.
 *
 * Anything that differs per locale (descriptions, chapter titles, UI labels)
 * lives in `src/i18n/*`. Projects are keyed by `id` so dictionaries supply the
 * matching description.
 */

export const SITE = {
  url: 'https://alirezasadjadipour.com',
  name: 'Alireza Sadjadipour',
  givenName: 'Alireza',
  familyName: 'Sadjadipour',
  alternateName: 'علیرضا سجادی پور',
  email: 'hello@alirezasadjadipour.ir',
  phone: '+989387247153',
  phoneDisplay: '+98 938 724 7153',
  github: 'https://github.com/tripasect',
  addressCountry: 'IR',
  alumniOf: 'University of Tehran',
  alumniOfFa: 'دانشگاه تهران',
  degree: 'B.Sc. Mathematics and Applications',
  degreeFa: 'کارشناسی ریاضیات و کاربردها',
  knowsLanguage: ['English', 'Persian', 'French', 'German'],
  ogImage: '/social-media-share-asset.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  themeColor: '#080808',
}

/**
 * Chapter accent colors.
 * 0=hero, 1=Full-Stack Eng, 2=Agentic AI, 3=Systems & Ops, 4=Soft Skills, 5=Tech Index, 6=coda
 */
export const ACCENTS = [
  '#F5F0E8', // hero
  '#ff2760', // I  — Full-Stack Engineering & Web-Apps
  '#2DD4BF', // II — Agentic AI & RAG Engineering
  '#F59E0B', // III — Systems, Networking & Observability
  '#A78BFA', // IV — Soft Skills & Interdisciplinary Mastery
  '#48ec56', // V  — Machine-Readable Technology Index
  '#F5F0E8', // coda
]

/** Act I — Full-Stack & Web-Apps */
export const fullStackProjects = [
  {
    id: 'blipmatch',
    name: 'BlipMatch!',
    logotype: '/logotypes/BlipMatch.svg',
    tech: 'Python · Django · Celery · Asyncio · Redis · PostgreSQL · Telegram OAuth · Vue 3 · Pinia · Vue Router · Rive · Lottie · Three.js · i18n',
    href: 'https://t.me/blipmatchbot',
  },
  {
    id: 'nhpmentor',
    name: 'NHPMentor',
    logotype: '/logotypes/NHPMentor.svg',
    tech: 'Nuxt 3 · Vue 3 · Python · Vector Search · PostgreSQL · REST APIs',
    href: 'https://nhpmentor.com/',
  },
  {
    id: 'cafekalya',
    name: 'Cafekalya',
    logotype: '/logotypes/cafekalya.svg',
    tech: 'JavaScript · Node.js · Express · SQLite · Custom UI',
    href: 'https://cafekalya.ir',
  },
]

/** Act II — Agentic AI & RAG Systems */
export const aiProjects = [
  {
    id: 'dvt',
    name: 'dvt',
    logotype: '/logotypes/dvt.svg',
    tech: 'Python · LangChain · Multi-Agent Orchestration · Ollama / vLLM · Loop Engineering · Prompt Harnessing',
  },
  {
    id: 'zinoworld',
    name: 'Zino Bot & ZinoWorld',
    logotype: '/logotypes/ZinoWorld.svg',
    tech: 'Python · LangChain · RAG · Vector DB (Pinecone & FAISS) · OpenAI API · Nuxt 3 · Three.js',
    href: 'https://bot.zinoa.ai',
  },
]

export const ALL_PROJECTS = [...fullStackProjects, ...aiProjects]

/**
 * Act V — machine-readable technology index.
 * Intentionally kept in English in every locale: these are literal technology
 * names, and the index exists for keyword matching by recruiters and AI crawlers.
 */
export const SKILLS = [
  'Python', 'Django', 'Django REST Framework', 'FastAPI', 'Flask', 'Asyncio', 'Celery', 'Distributed Tasks', 'Redis', 'PostgreSQL',
  'SQLite', 'Monitoring', 'Observability', 'Grafana', 'Sentry', 'Prometheus', 'Airflow', 'Temporal', 'Unit Testing', 'PyTest',
  'Automated Testing', 'Load Testing', 'Google OAuth', 'Apple OAuth', 'Telegram OAuth', 'Telegram Bot API', 'WebSockets', 'RESTful APIs', 'GraphQL',
  'Microservices', 'Agentic AI', 'Autonomous AI Agents', 'Multi-Agent Systems', 'LangChain', 'LlamaIndex', 'RAG Systems',
  'Retrieval-Augmented Generation', 'Vector Databases', 'Pinecone', 'FAISS', 'ChromaDB', 'Vector Search', 'Semantic Search',
  'Ollama', 'vLLM', 'GGUF', 'Local LLMs', 'Prompt Harnessing', 'Loop Engineering', 'Agentic Workflows', 'OpenAI API',
  'Structured Outputs', 'JSON Mode', 'Docker', 'Containerization', 'Linux Administration', 'Reverse Proxy', 'Nginx',
  'CI/CD', 'Git', 'GitHub Actions', 'Vue.js', 'Vue 3', 'Nuxt 3', 'Pinia', 'Vue Router', 'React.js', "Next.js", 'React', 'Vite',
  'JavaScript (ES6+)', 'TypeScript', 'TailwindCSS', 'CSS3', 'HTML5', 'Three.js', 'Rive Runtime', 'Lottie', 'WebGL',
  'Canva', 'Figma', 'Photoshop', 'Affinity Suite', 'Illustrator', 'Pixelmator', 'Logic Pro', 'ffmpeg', 'imagemagick', 'D3.js',
  'Adobe After Effects',
  'Technical Documentation', 'Technical English (C2 IELTS)', 'Independent Problem Solving', 'Technical SEO',
  'System Architecture',
]
