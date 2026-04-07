import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Cpu, Plane, Wrench, Code2, Terminal } from 'lucide-react';
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

/* ─── Hero visual: a faux code editor with self-typing code,
       wrapped in an animated circuit/PCB-style backdrop ─── */
function HeroVisual() {
  const c = '#a855f7';   // primary purple
  const c2 = '#22d3ee';  // cyan accent (cables / data)
  const c3 = '#f472b6';  // pink accent (strings)

  // Lines of code that "type" themselves into the editor
  const codeLines = [
    { tokens: [{ t: 'const ', cls: 'kw' }, { t: 'cindy ', cls: 'fn' }, { t: '= ', cls: 'op' }, { t: '{', cls: 'pn' }] },
    { indent: 1, tokens: [{ t: 'role', cls: 'pr' }, { t: ': ', cls: 'pn' }, { t: "'engineer'", cls: 'st' }, { t: ',', cls: 'pn' }] },
    { indent: 1, tokens: [{ t: 'stack', cls: 'pr' }, { t: ': ', cls: 'pn' }, { t: '[', cls: 'pn' }, { t: "'react'", cls: 'st' }, { t: ', ', cls: 'pn' }, { t: "'python'", cls: 'st' }, { t: '],', cls: 'pn' }] },
    { indent: 1, tokens: [{ t: 'build', cls: 'fn' }, { t: ': ', cls: 'pn' }, { t: '() => ', cls: 'op' }, { t: 'ship', cls: 'fn' }, { t: '(', cls: 'pn' }, { t: 'ideas', cls: 'pr' }, { t: '),', cls: 'pn' }] },
    { tokens: [{ t: '};', cls: 'pn' }] },
  ];

  // Compute total length and step a "cursor" through it for typing animation
  const total = codeLines.reduce((acc, l) => acc + l.tokens.reduce((a, t) => a + t.t.length, 0), 0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    let raf;
    let start;
    const cycle = 7000; // ms full cycle
    const step = (ts) => {
      if (!start) start = ts;
      const elapsed = (ts - start) % (cycle + 1500);
      const progress = Math.min(1, elapsed / cycle);
      setTyped(Math.floor(progress * total));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [total]);

  // Token color map
  const tokenColor = {
    kw: c,           // keyword purple
    fn: c2,          // function cyan
    pr: '#e2e8f0',   // property light
    st: c3,          // string pink
    pn: '#64748b',   // punctuation muted
    op: '#94a3b8',   // operator
  };

  // Render code lines, only revealing chars up to `typed`
  let remaining = typed;
  const renderedLines = codeLines.map((line) => {
    const parts = [];
    for (const tok of line.tokens) {
      if (remaining <= 0) break;
      const slice = tok.t.slice(0, remaining);
      remaining -= slice.length;
      parts.push({ ...tok, t: slice });
    }
    return { indent: line.indent || 0, parts };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative', width: '100%', aspectRatio: '1/1', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Ambient gradient glow behind */}
      <motion.div
        style={{
          position: 'absolute', inset: '5%', borderRadius: 28,
          background: `radial-gradient(circle at 30% 20%, ${c}40, transparent 55%), radial-gradient(circle at 80% 80%, ${c2}25, transparent 55%)`,
          filter: 'blur(48px)',
        }}
        animate={{ opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* PCB / circuit-board SVG backdrop with animated trace and pulses */}
      <svg
        viewBox="0 0 400 400"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="trace-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c} stopOpacity="0.7" />
            <stop offset="100%" stopColor={c2} stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Static thin grid */}
        {Array.from({ length: 9 }).map((_, i) => (
          <g key={i}>
            <line x1="0" y1={i * 50} x2="400" y2={i * 50} stroke={c} strokeWidth="0.5" opacity="0.06" />
            <line x1={i * 50} y1="0" x2={i * 50} y2="400" stroke={c} strokeWidth="0.5" opacity="0.06" />
          </g>
        ))}

        {/* Animated drawing PCB traces */}
        {[
          'M20,80 L80,80 L80,140 L160,140',
          'M380,60 L320,60 L320,120 L240,120 L240,180',
          'M30,340 L100,340 L100,280 L180,280 L180,240',
          'M380,340 L300,340 L300,260 L220,260',
        ].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="url(#trace-grad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.55 }}
            transition={{ duration: 2.2, delay: 0.4 + i * 0.25, ease: 'easeOut' }}
          />
        ))}

        {/* Solder pads / junction nodes */}
        {[
          { x: 80, y: 140, r: 4 },
          { x: 240, y: 180, r: 5 },
          { x: 180, y: 240, r: 4 },
          { x: 220, y: 260, r: 5 },
          { x: 20, y: 80, r: 3 },
          { x: 380, y: 60, r: 3 },
          { x: 30, y: 340, r: 3 },
          { x: 380, y: 340, r: 3 },
        ].map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={i % 2 === 0 ? c : c2}
            animate={{ opacity: [0.4, 1, 0.4], r: [p.r, p.r * 1.4, p.r] }}
            transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Data pulse traveling along a trace */}
        <motion.circle
          r="3.5"
          fill={c2}
          style={{ filter: `drop-shadow(0 0 6px ${c2})` }}
          animate={{
            cx: [20, 80, 80, 160],
            cy: [80, 80, 140, 140],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </svg>

      {/* Floating coding glyphs — subtle, slow drift */}
      {[
        { ch: '{ }', top: '8%', left: '6%', size: 22, dur: 9, delay: 0 },
        { ch: '</>', top: '12%', right: '8%', size: 20, dur: 11, delay: 1.5 },
        { ch: '01', top: '78%', left: '10%', size: 18, dur: 10, delay: 0.8 },
        { ch: '=>', top: '82%', right: '12%', size: 22, dur: 12, delay: 2 },
        { ch: '#', top: '46%', left: '2%', size: 26, dur: 13, delay: 0.4 },
        { ch: '$_', top: '50%', right: '3%', size: 22, dur: 10, delay: 1.2 },
      ].map((g, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: g.top, left: g.left, right: g.right,
            fontFamily: 'ui-monospace, "JetBrains Mono", "Fira Code", monospace',
            fontSize: g.size,
            fontWeight: 600,
            color: i % 2 === 0 ? c : c2,
            opacity: 0.4,
            textShadow: `0 0 12px ${i % 2 === 0 ? c : c2}80`,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          animate={{ y: [-6, 8, -6], opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: g.dur, delay: g.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {g.ch}
        </motion.div>
      ))}

      {/* The code editor card itself */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          width: '78%',
          background: 'linear-gradient(180deg, #14141e 0%, #0d0d16 100%)',
          border: `1px solid ${c}40`,
          borderRadius: 14,
          boxShadow: `0 30px 80px -20px ${c}55, 0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 60px ${c}25`,
          overflow: 'hidden',
          zIndex: 5,
          fontFamily: 'ui-monospace, "JetBrains Mono", "Fira Code", Menlo, monospace',
        }}
      >
        {/* Title bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
          <span style={{ marginLeft: 12, fontSize: 11, color: '#64748b', letterSpacing: '0.05em' }}>
            cindy.js
          </span>
        </div>

        {/* Code body */}
        <div style={{ padding: '16px 14px 18px', fontSize: 'clamp(0.72rem, 1.1vw, 0.9rem)', lineHeight: 1.65, minHeight: 178 }}>
          {renderedLines.map((line, i) => (
            <div key={i} style={{ display: 'flex', whiteSpace: 'pre' }}>
              <span style={{ width: 22, color: '#3a3a52', userSelect: 'none', flexShrink: 0, textAlign: 'right', paddingRight: 12 }}>
                {i + 1}
              </span>
              <span>
                {'  '.repeat(line.indent)}
                {line.parts.map((p, pi) => (
                  <span key={pi} style={{ color: tokenColor[p.cls] || '#e2e8f0' }}>{p.t}</span>
                ))}
                {/* Blinking cursor on the line currently being typed */}
                {i === renderedLines.findIndex((_, idx) =>
                  idx === renderedLines.length - 1 ||
                  renderedLines.slice(idx + 1).every(ll => ll.parts.length === 0)
                ) && line.parts.length > 0 && (
                  <motion.span
                    style={{ display: 'inline-block', width: 7, height: '0.95em', background: c2, marginLeft: 2, verticalAlign: 'text-bottom', boxShadow: `0 0 8px ${c2}` }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

const CATEGORY_ICONS = { Cpu, Plane, Wrench, Code2, Terminal };

function SkillCategory({ category, index }) {
  const Icon = CATEGORY_ICONS[category.icon] || Code2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="card card-pad"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${A}, ${A}00)` }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${A}15`, border: `1px solid ${A}30`,
          color: A, flexShrink: 0,
        }}>
          <Icon size={18} />
        </div>
        <span className="text-card-title" style={{ fontWeight: 600 }}>{category.name}</span>
      </div>

      {/* Chip cloud */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {category.skills.map(skill => {
          const years = currentYear - skill.startYear;
          return (
            <span
              key={skill.name}
              className="skill-chip"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 99,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                fontSize: '0.78rem', fontWeight: 500,
                color: 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
            >
              {skill.name}
              <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem', fontVariantNumeric: 'tabular-nums' }}>
                {years}y
              </span>
            </span>
          );
        })}
      </div>
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
                { title: 'Research & Teams', items: experience.projects, render: (item) => (
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
