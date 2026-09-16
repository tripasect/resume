import React, { useState } from 'react';

const SKILLS = [
  'Python', 'Django', 'Django REST Framework', 'FastAPI', 'Flask', 'Asyncio', 'Celery', 'Distributed Tasks', 'Redis', 'PostgreSQL', 
  'SQLite', 'Monitoring', 'Observability', 'Grafana', 'Sentry', 'Prometheus', 'Airflow', 'Temporal', 'Unit Testing', 'PyTest', 
  'Automated Testing', 'Load Testing', 'Telegram OAuth', 'Telegram Bot API', 'WebSockets', 'RESTful APIs', 'GraphQL', 
  'Microservices', 'Agentic AI', 'Autonomous AI Agents', 'Multi-Agent Systems', 'LangChain', 'LlamaIndex', 'RAG Systems', 
  'Retrieval-Augmented Generation', 'Vector Databases', 'Pinecone', 'FAISS', 'ChromaDB', 'Vector Search', 'Semantic Search', 
  'Ollama', 'vLLM', 'GGUF', 'Local LLMs', 'Prompt Harnessing', 'Loop Engineering', 'Agentic Workflows', 'OpenAI API', 
  'Structured Outputs', 'JSON Mode', 'Docker', 'Containerization', 'Linux Administration', 'Reverse Proxy', 'Nginx', 
  'CI/CD', 'Git', 'GitHub Actions', 'Vue.js', 'Vue 3', 'Nuxt 3', 'Pinia', 'Vue Router', 'React.js', 'React', 'Vite', 
  'JavaScript (ES6+)', 'TypeScript', 'TailwindCSS', 'CSS3', 'HTML5', 'Three.js', 'Rive Runtime', 'Lottie', 'WebGL', 
  'Shader Programming', 'D3.js', 'Technical Documentation', 'Technical English (C1 IELTS)', 'Independent Problem Solving', 
  'System Architecture'
];

const GEARS = [
  { name: 'Raw List', id: 'raw' },
  { name: 'Markdown', id: 'md' },
  { name: 'AI Prompt', id: 'ai' },
  { name: 'JSON', id: 'json' },
];

export default function TechIndex({ accent }) {
  const [gear, setGear] = useState('raw');
  const [copied, setCopied] = useState(false);

  const getContent = () => {
    switch (gear) {
      case 'raw': return SKILLS.join(', ');
      case 'md': return `## Technology Index\n\n- **Languages/Backends:** ${SKILLS.slice(0, 15).join(', ')}\n- **AI/Agents:** ${SKILLS.slice(15, 30).join(', ')}\n- **Frontend/Design:** ${SKILLS.slice(30).join(', ')}`;
      case 'ai': return `Act as an expert technical recruiter analyzing this candidate: Evaluate these skills for a Senior Python/Django/AI Engineer role: ${SKILLS.join(', ')}`;
      case 'json': return JSON.stringify({ skills: SKILLS }, null, 2);
      default: return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '0' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
        <select 
          onChange={(e) => setGear(e.target.value)} 
          style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '0.25rem', borderRadius: '0' }}
        >
          {GEARS.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <button 
          onClick={handleCopy}
          style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '0.25rem 0.5rem', cursor: 'pointer' }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: accent, overflow: 'auto', maxHeight: '200px' }}>
        {getContent()}
      </div>
    </div>
  );
}
