import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import { ProjectsDecorations } from '../components/PageDecorations';
import projects from '../data/projects.json';

const A = 'var(--accent-projects)';

function ProjectCard({ project, index }) {
  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="card"
      style={{ display: 'block', overflow: 'hidden', textDecoration: 'none' }}
    >
      <div style={{ position: 'relative', aspectRatio: '16/10', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
        <img
          src={project.image}
          alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, transition: 'all 0.5s' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-card), transparent, transparent)', opacity: 0.7 }} />
        <div style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s' }}>
          <ArrowUpRight size={16} color="white" />
        </div>
      </div>

      <div style={{ padding: '20px 24px 24px' }}>
        <h3 className="text-card-title" style={{ marginBottom: 8 }}>
          {project.title}
        </h3>
        <p className="text-small" style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
          {project.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {project.tools.map(tool => (
            <span key={tool} className="tag">{tool}</span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState('all');

  const allTools = [...new Set(projects.projects.flatMap(p => p.tools))].sort();
  const filtered = filter === 'all'
    ? projects.projects
    : projects.projects.filter(p => p.tools.includes(filter));

  return (
    <PageTransition>
      <div className="theme-projects" style={{ minHeight: '100vh', position: 'relative' }}>
        <ProjectsDecorations />

        <section className="page-hero" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ maxWidth: 600 }}
            >
              <h1 className="text-hero" style={{ marginBottom: 20 }}>Projects</h1>
              <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 480 }}>
                A collection of things I've built, broken, and occasionally won awards for.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section style={{ position: 'relative', zIndex: 10, paddingBottom: 48 }}>
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}
            >
              <button
                onClick={() => setFilter('all')}
                className="tag"
                style={{
                  cursor: 'pointer', background: filter === 'all' ? 'var(--accent-projects-dim)' : 'transparent',
                  borderColor: filter === 'all' ? A : undefined, color: filter === 'all' ? A : undefined,
                }}
              >All</button>
              {allTools.map(tool => (
                <button
                  key={tool}
                  onClick={() => setFilter(filter === tool ? 'all' : tool)}
                  className="tag"
                  style={{
                    cursor: 'pointer', background: filter === tool ? 'var(--accent-projects-dim)' : 'transparent',
                    borderColor: filter === tool ? A : undefined, color: filter === tool ? A : undefined,
                  }}
                >{tool}</button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Grid */}
        <section className="section-gap" style={{ position: 'relative', zIndex: 10, paddingTop: 0 }}>
          <div className="page-container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 400px), 1fr))', gap: 28 }}>
              <AnimatePresence mode="wait">
                {filtered.map((project, i) => (
                  <ProjectCard key={project.title} project={project} index={i} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
