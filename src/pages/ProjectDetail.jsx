import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { ProjectsDecorations } from '../components/PageDecorations';
import data from '../data/projects.json';

function toSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export { toSlug };

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = data.featured.find(p => toSlug(p.title) === slug);

  if (!project) {
    return (
      <PageTransition>
        <div className="theme-projects" style={{ minHeight: '100vh' }}>
          <section className="page-hero">
            <div className="page-container">
              <h1 className="text-hero">Project not found</h1>
              <Link to="/projects" style={{ color: 'var(--accent-projects)', marginTop: 20, display: 'inline-block' }}>
                Back to projects
              </Link>
            </div>
          </section>
        </div>
      </PageTransition>
    );
  }

  const detail = project.detail;

  return (
    <PageTransition>
      <div className="theme-projects" style={{ minHeight: '100vh', position: 'relative' }}>
        <ProjectsDecorations />

        <section className="page-hero" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container" style={{ maxWidth: 800 }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to="/projects"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  color: 'var(--text-secondary)', fontSize: '0.85rem',
                  marginBottom: 32, transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-projects)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <ArrowLeft size={16} /> Back to projects
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12, flexWrap: 'wrap' }}>
                {project.context && (
                  <span style={{
                    padding: '4px 12px', borderRadius: 6,
                    background: 'var(--accent-projects-dim)',
                    border: '1px solid var(--accent-projects)',
                    color: 'var(--accent-projects)',
                    fontFamily: 'var(--font-heading)', fontWeight: 600,
                    fontSize: '0.7rem', letterSpacing: '0.03em',
                  }}>
                    {project.context}
                  </span>
                )}
              </div>

              <h1 className="text-hero" style={{ marginBottom: 16 }}>{project.title}</h1>
              <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                {project.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
                {project.tools.map(tool => (
                  <span key={tool} className="tag">{tool}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '10px 20px', borderRadius: 10,
                      background: 'var(--accent-projects-dim)',
                      border: '1px solid var(--accent-projects)',
                      color: 'var(--accent-projects)',
                      fontSize: '0.85rem', fontWeight: 600,
                      fontFamily: 'var(--font-heading)',
                      transition: 'all 0.2s', textDecoration: 'none',
                    }}
                  >
                    GitHub <ExternalLink size={14} />
                  </a>
                )}
                {project.report && (
                  <a
                    href={project.report}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '10px 20px', borderRadius: 10,
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem', fontWeight: 600,
                      fontFamily: 'var(--font-heading)',
                      transition: 'all 0.2s', textDecoration: 'none',
                    }}
                  >
                    Report <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="section-gap" style={{ position: 'relative', zIndex: 10, paddingTop: 0 }}>
          <div className="page-container" style={{ maxWidth: 800 }}>
            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="card"
              style={{ overflow: 'hidden' }}
            >
              <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--bg-secondary)' }}>
                <img
                  src={project.image}
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-dim);font-size:0.85rem;">Image coming soon</div>';
                  }}
                />
              </div>
            </motion.div>

            {detail ? (
              <>
                {/* Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{ marginTop: 48 }}
                >
                  <h2 className="text-section" style={{ marginBottom: 16 }}>Overview</h2>
                  <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.9 }}>
                    {detail.overview}
                  </p>
                </motion.div>

                {/* Highlights */}
                {detail.highlights && detail.highlights.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    style={{ marginTop: 40 }}
                  >
                    <h2 className="text-section" style={{ marginBottom: 16 }}>Highlights</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {detail.highlights.map((item, i) => (
                        <li key={i} style={{
                          display: 'flex', gap: 12, alignItems: 'flex-start',
                          padding: '12px 0',
                          borderBottom: i < detail.highlights.length - 1 ? '1px solid var(--border-color)' : 'none',
                        }}>
                          <span style={{
                            flexShrink: 0, width: 6, height: 6, borderRadius: '50%',
                            background: 'var(--accent-projects)', marginTop: 8,
                          }} />
                          <span className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Role */}
                {detail.role && (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    style={{ marginTop: 40 }}
                  >
                    <h2 className="text-section" style={{ marginBottom: 16 }}>My Role</h2>
                    <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.9 }}>
                      {detail.role}
                    </p>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{
                  marginTop: 48, padding: '48px 32px',
                  border: '1px dashed var(--border-color)',
                  borderRadius: 16, textAlign: 'center', color: 'var(--text-dim)',
                }}
              >
                <p style={{ fontSize: '0.9rem' }}>Project details coming soon.</p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
