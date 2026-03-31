import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { GitHubIcon } from '../components/SocialIcons';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import { HomeDecorations } from '../components/PageDecorations';
import personal from '../data/personal.json';
import skills from '../data/skills.json';
import experience from '../data/experience.json';

const A = 'var(--accent-home)';
const currentYear = new Date().getFullYear();

function TypingHero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const role = personal.roles[roleIndex];

  useEffect(() => {
    const speed = deleting ? 40 : 80;
    const timer = setTimeout(() => {
      if (!deleting && charIndex === role.length) {
        setTimeout(() => setDeleting(true), 1500);
        return;
      }
      if (deleting && charIndex === 0) {
        setDeleting(false);
        setRoleIndex((roleIndex + 1) % personal.roles.length);
        return;
      }
      setCharIndex(charIndex + (deleting ? -1 : 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [charIndex, deleting, role, roleIndex]);

  return (
    <span className="typing-cursor" style={{ color: A }}>
      {role.substring(0, charIndex)}
    </span>
  );
}

function HeroVisual() {
  const c = '#00d4ff';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative', width: '100%', height: '100%', minHeight: 320 }}
    >
      {/* Outer rotating ring */}
      <motion.div
        style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1.5px solid ${c}18` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      {/* Middle ring dashed */}
      <motion.div
        style={{ position: 'absolute', inset: '15%', borderRadius: '50%', border: `1px dashed ${c}22` }}
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      {/* Inner ring */}
      <motion.div
        style={{ position: 'absolute', inset: '32%', borderRadius: '50%', border: `1.5px solid ${c}30` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
      {/* Orbiting dots */}
      {[
        { dur: 10, radius: '50%', size: 10, opacity: 1 },
        { dur: 7, radius: '35%', size: 7, opacity: 0.7 },
        { dur: 15, radius: '42%', size: 5, opacity: 0.5 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: 'linear' }}
        >
          <div style={{
            width: orb.size, height: orb.size, borderRadius: '50%',
            background: c, opacity: orb.opacity,
            boxShadow: `0 0 ${orb.size * 2}px ${orb.size / 2}px ${c}60`,
            transform: `translate(-50%, -50%) translateX(${orb.radius})`,
          }} />
        </motion.div>
      ))}
      {/* Center pulsing core */}
      <motion.div
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 14, height: 14, borderRadius: '50%',
          background: c, boxShadow: `0 0 40px 12px ${c}50`,
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Cross hairs */}
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${c}10 30%, ${c}10 70%, transparent)` }} />
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg, transparent, ${c}10 30%, ${c}10 70%, transparent)` }} />
    </motion.div>
  );
}

function SkillCategory({ category, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="card"
      style={{ overflow: 'hidden' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="card-pad"
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', cursor: 'pointer', background: 'transparent', border: 'none', color: 'inherit', fontFamily: 'inherit' }}
      >
        <span className="text-small" style={{ color: A, fontWeight: 600 }}>{category.name}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="text-tiny" style={{ color: 'var(--text-dim)' }}>{category.skills.length}</span>
          {open ? <ChevronUp size={14} color="var(--text-dim)" /> : <ChevronDown size={14} color="var(--text-dim)" />}
        </span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ padding: '12px 24px 24px', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px 32px' }}
        >
          {category.skills.map(skill => {
            const years = currentYear - skill.startYear;
            const pct = Math.min((years / 10) * 100, 100);
            return (
              <div key={skill.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span className="text-small" style={{ fontWeight: 500 }}>{skill.name}</span>
                  <span className="text-tiny" style={{ color: 'var(--text-dim)', fontVariantNumeric: 'tabular-nums' }}>{years}yr{years !== 1 ? 's' : ''}</span>
                </div>
                <div style={{ height: 5, background: 'var(--border-color)', borderRadius: 99, overflow: 'hidden' }}>
                  <div className="skill-bar-fill" style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${A}, ${A}80)`, borderRadius: 99 }} />
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}

function TimelineItem({ children, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      style={{ position: 'relative', paddingLeft: 24, paddingBottom: 28 }}
    >
      <div style={{ position: 'absolute', left: 0, top: 10, bottom: 0, width: 1, background: `${A}18` }} />
      <div style={{ position: 'absolute', left: -3.5, top: 9, width: 8, height: 8, borderRadius: '50%', background: A, boxShadow: `0 0 8px ${A}40` }} />
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <PageTransition>
      <div className="theme-home" style={{ minHeight: '100vh', position: 'relative' }}>
        <HomeDecorations />

        {/* Hero */}
        <style>{`
          .hero-grid { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: center; }
          @media (min-width: 1024px) { .hero-grid { grid-template-columns: 1.1fr 0.9fr; gap: 64px; } }
          .hero-visual-wrap { display: none; }
          @media (min-width: 1024px) { .hero-visual-wrap { display: block; } }
        `}</style>
        <section style={{ position: 'relative', zIndex: 10, minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
          <div className="page-container" style={{ width: '100%', paddingTop: 120, paddingBottom: 80 }}>
            <div className="hero-grid">
              {/* Text */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="text-hero" style={{ marginBottom: 12 }}>
                  I'm <span style={{ color: A }}>Cindy</span>,
                </h1>
                <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 28 }}>
                  a <TypingHero />
                </h2>
                <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 36, maxWidth: 480 }}>
                  {personal.heroText}
                </p>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <a href={personal.socials.github} target="_blank" rel="noopener noreferrer"
                    className="btn-pad-lg"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 12, borderRadius: 14, fontWeight: 600, fontSize: '0.9rem', background: A, color: 'var(--bg-primary)', boxShadow: `0 4px 24px ${A}30`, textDecoration: 'none' }}>
                    <GitHubIcon size={16} /> GitHub
                  </a>
                  <a href={personal.resumeUrl} target="_blank" rel="noopener noreferrer"
                    className="btn-pad-lg"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 12, borderRadius: 14, fontWeight: 600, fontSize: '0.9rem', border: `1px solid ${A}40`, color: A, textDecoration: 'none' }}>
                    <ExternalLink size={16} /> Resume
                  </a>
                </div>
              </motion.div>
              {/* Hero visual */}
              <div className="hero-visual-wrap">
                <HeroVisual />
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="section-gap" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <SectionHeading accent={A}>Skills</SectionHeading>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 400px), 1fr))', gap: 24 }}>
              {skills.categories.map((cat, i) => (
                <SkillCategory key={cat.name} category={cat} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="section-gap" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <SectionHeading accent={A}>Experience</SectionHeading>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 56 }}>
              {[
                { title: 'Education', items: experience.education, render: (item) => (
                  <>
                    <p className="text-card-title">{item.institution}</p>
                    <p className="text-small mt-md" style={{ color: 'var(--text-secondary)' }}>{item.degree}</p>
                    <p className="text-small mt-sm" style={{ color: 'var(--text-dim)' }}>{item.date}</p>
                  </>
                )},
                { title: 'Work', items: experience.work, render: (item) => (
                  <>
                    <p className="text-card-title">{item.title}</p>
                    <p className="text-small mt-md" style={{ color: A }}>{item.company}</p>
                    <p className="text-small mt-sm" style={{ color: 'var(--text-dim)' }}>{item.date}</p>
                  </>
                )},
                { title: 'Research', items: experience.research, render: (item) => (
                  <>
                    <p className="text-card-title">{item.title}</p>
                    <p className="text-small mt-md" style={{ color: 'var(--text-secondary)' }}>{item.role}</p>
                    <p className="text-small mt-sm" style={{ color: 'var(--text-dim)' }}>{item.date}</p>
                  </>
                )},
              ].map(col => (
                <div key={col.title}>
                  <p className="text-label mb-xl" style={{ color: A }}>{col.title}</p>
                  {col.items.map((item, i) => (
                    <TimelineItem key={i} index={i}>{col.render(item)}</TimelineItem>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
