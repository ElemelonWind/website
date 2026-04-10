import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import { ProjectsDecorations } from '../components/PageDecorations';
import data from '../data/projects.json';
import { toSlug } from './ProjectDetail';

const ROUTE_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
const ROUTE_GLOWS = [
  'rgba(231,76,60,0.45)',
  'rgba(52,152,219,0.45)',
  'rgba(46,204,113,0.45)',
  'rgba(241,196,15,0.45)',
  'rgba(155,89,182,0.45)',
];

const W = 460;
const H = 680;
const HOLD_PADDING = 55; // inset from viewBox edges so holds + glow never clip
const PANEL_W = 92;
const PANEL_H = 113;
const MIN_HOLD_DIST = 40;

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function holdPath(type, size) {
  const s = size;
  switch (type) {
    case 'jug':
      return `M${-s * 1.1},${s * 0.15} C${-s * 1.1},${-s * 0.7} ${-s * 0.6},${-s * 0.95} 0,${-s * 0.9}
              C${s * 0.6},${-s * 0.95} ${s * 1.1},${-s * 0.7} ${s * 1.1},${s * 0.15}
              C${s * 0.9},${s * 0.7} ${s * 0.4},${s * 0.85} 0,${s * 0.8}
              C${-s * 0.4},${s * 0.85} ${-s * 0.9},${s * 0.7} ${-s * 1.1},${s * 0.15}Z`;
    case 'crimp':
      return `M${-s * 1.2},${s * 0.1} C${-s * 1.2},${-s * 0.35} ${-s * 0.7},${-s * 0.5} 0,${-s * 0.45}
              C${s * 0.7},${-s * 0.5} ${s * 1.2},${-s * 0.35} ${s * 1.2},${s * 0.1}
              C${s * 1.0},${s * 0.4} ${s * 0.5},${s * 0.48} 0,${s * 0.45}
              C${-s * 0.5},${s * 0.48} ${-s * 1.0},${s * 0.4} ${-s * 1.2},${s * 0.1}Z`;
    case 'sloper':
      return `M${-s * 0.9},${s * 0.3} C${-s * 1.1},${-s * 0.3} ${-s * 0.7},${-s * 0.95} ${s * 0.05},${-s * 0.85}
              C${s * 0.8},${-s * 0.9} ${s * 1.15},${-s * 0.2} ${s * 0.95},${s * 0.35}
              C${s * 0.75},${s * 0.8} ${s * 0.2},${s * 0.95} ${-s * 0.15},${s * 0.85}
              C${-s * 0.6},${s * 0.8} ${-s * 0.85},${s * 0.6} ${-s * 0.9},${s * 0.3}Z`;
    case 'pinch':
      return `M${-s * 0.5},${s * 0.95} C${-s * 0.7},${s * 0.4} ${-s * 0.65},${-s * 0.5} ${-s * 0.4},${-s * 0.9}
              C${-s * 0.2},${-s * 1.05} ${s * 0.2},${-s * 1.05} ${s * 0.4},${-s * 0.9}
              C${s * 0.65},${-s * 0.5} ${s * 0.7},${s * 0.4} ${s * 0.5},${s * 0.95}
              C${s * 0.25},${s * 1.05} ${-s * 0.25},${s * 1.05} ${-s * 0.5},${s * 0.95}Z`;
    case 'pocket':
      return `M${-s * 0.75},${s * 0.2} C${-s * 0.8},${-s * 0.4} ${-s * 0.45},${-s * 0.7} 0,${-s * 0.65}
              C${s * 0.45},${-s * 0.7} ${s * 0.8},${-s * 0.4} ${s * 0.75},${s * 0.2}
              C${s * 0.55},${s * 0.55} ${s * 0.3},${s * 0.65} 0,${s * 0.6}
              C${-s * 0.3},${s * 0.65} ${-s * 0.55},${s * 0.55} ${-s * 0.75},${s * 0.2}Z`;
    default:
      return `M${-s},${s * 0.1} C${-s * 0.95},${-s * 0.65} ${-s * 0.35},${-s} ${s * 0.1},${-s * 0.9}
              C${s * 0.55},${-s * 0.85} ${s},${-s * 0.45} ${s * 0.95},${s * 0.15}
              C${s * 0.9},${s * 0.7} ${s * 0.35},${s} ${-s * 0.1},${s * 0.9}
              C${-s * 0.6},${s * 0.85} ${-s * 0.95},${s * 0.6} ${-s},${s * 0.1}Z`;
  }
}

const HOLD_TYPES = ['jug', 'crimp', 'sloper', 'pinch', 'pocket', 'volume'];

function overlapsAny(cx, cy, placed) {
  for (const h of placed) {
    const dx = cx - h.x;
    const dy = cy - h.y;
    if (Math.sqrt(dx * dx + dy * dy) < MIN_HOLD_DIST) return true;
  }
  return false;
}

function generateRoutes(count) {
  const routes = [];
  const allPlaced = [];
  const wallUsable = W - HOLD_PADDING * 2;

  const rand = seededRandom(77);
  const startPositions = [];
  for (let r = 0; r < count; r++) {
    startPositions.push(HOLD_PADDING + (wallUsable / (count + 1)) * (r + 1) + (rand() - 0.5) * 30);
  }

  for (let r = 0; r < count; r++) {
    const routeRand = seededRandom((r + 1) * 251);
    const holds = [];
    const holdCount = 7;
    let curX = startPositions[r];

    for (let h = 0; h < holdCount; h++) {
      const vertBase = H - HOLD_PADDING - h * ((H - HOLD_PADDING * 2) / (holdCount - 1));
      const typeIdx = Math.floor(routeRand() * HOLD_TYPES.length);
      const size = 10 + routeRand() * 6;
      const rot = (routeRand() - 0.5) * 50;

      let x, y, attempts = 0;
      do {
        const drift = (routeRand() - 0.5) * wallUsable * 0.45;
        x = curX + drift;
        x = Math.max(HOLD_PADDING, Math.min(W - HOLD_PADDING, x));
        const vertJitter = (routeRand() - 0.5) * 28;
        y = Math.max(HOLD_PADDING, Math.min(H - HOLD_PADDING, vertBase + vertJitter));
        attempts++;
      } while (overlapsAny(x, y, allPlaced) && attempts < 30);

      curX = x;
      const hold = { x, y, size, rotation: rot, type: HOLD_TYPES[typeIdx] };
      holds.push(hold);
      allPlaced.push(hold);
    }
    routes.push(holds);
  }
  return routes;
}

function generateTNuts() {
  const rand = seededRandom(42);
  const nuts = [];
  for (let i = 0; i < 50; i++) {
    nuts.push({ x: 20 + rand() * (W - 40), y: 15 + rand() * (H - 30) });
  }
  return nuts;
}

function generateChalkMarks(routes) {
  const rand = seededRandom(999);
  const marks = [];
  routes.forEach((holds) => {
    holds.forEach((hold) => {
      if (rand() > 0.45) {
        marks.push({
          x: hold.x + (rand() - 0.5) * 20,
          y: hold.y + (rand() - 0.5) * 15,
          rx: 8 + rand() * 18,
          ry: 4 + rand() * 10,
          rot: rand() * 180,
        });
      }
    });
  });
  return marks;
}

function ClimbingHold({ x, y, size, rotation, type, color, isActive, isHovered, onClick, onMouseEnter, onMouseLeave }) {
  const glow = isHovered || isActive;
  const dimmed = !isActive && !isHovered;
  const path = holdPath(type, size);

  return (
    <g
      transform={`translate(${x},${y}) rotate(${rotation})`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: 'pointer' }}
    >
      <g transform="translate(2, 3)">
        <path d={path} fill="rgba(0,0,0,0.5)" />
      </g>

      {glow && (
        <circle cx={0} cy={0} r={size + 14} fill="none" stroke={color} strokeWidth={2.5} opacity={0.4}>
          <animate attributeName="opacity" values="0.4;0.2;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      {glow && (
        <circle cx={0} cy={0} r={size + 18} fill={color} opacity={0.08} />
      )}

      <path d={path} fill={color} opacity={dimmed ? 0.4 : 0.95} style={{ transition: 'opacity 0.3s ease' }} />
      <path d={path} fill="url(#holdHighlight)" opacity={dimmed ? 0.15 : 0.35} style={{ transition: 'opacity 0.3s ease' }} />
      <path d={path} fill="url(#holdGrain)" opacity={0.3} />
      <path d={path} fill="none" stroke={glow ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)'} strokeWidth={glow ? 1.2 : 0.8} style={{ transition: 'all 0.3s ease' }} />

      <circle cx={0} cy={0} r={2.2} fill="rgba(0,0,0,0.6)" />
      <circle cx={0} cy={0} r={3.2} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth={0.6} />
      <circle cx={0} cy={0} r={1.4} fill="rgba(120,120,130,0.5)" />
    </g>
  );
}

function RouteLine({ holds, color, isActive, isHovered }) {
  if (!isActive && !isHovered) return null;
  const points = [...holds].sort((a, b) => b.y - a.y);
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    d += ` C ${prev.x} ${prev.y - (prev.y - curr.y) * 0.4}, ${curr.x} ${curr.y + (prev.y - curr.y) * 0.4}, ${curr.x} ${curr.y}`;
  }

  return (
    <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="8 6"
      opacity={isActive ? 0.35 : 0.2} style={{ transition: 'opacity 0.3s' }} />
  );
}

const displayProjects = data.featured;
const remainingProjects = data.projects;
const routes = generateRoutes(displayProjects.length);
const tNuts = generateTNuts();
const chalkMarks = generateChalkMarks(routes);

// Fixed height for the two-column area so the SVG never re-slices on content swap
const WALL_HEIGHT = 620;

export default function ProjectsClimbing() {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(null);

  const activeProject = displayProjects[selected];

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
                An abridged collection of things I've built, broken, and occasionally won awards for. Pick a route to explore a project.
              </p>
            </motion.div>
          </div>
        </section>

        <section style={{ position: 'relative', zIndex: 10, paddingBottom: 100 }}>
          <div className="page-container">
            {/* ── Desktop: two columns ── */}
            <div className="climbing-desktop" style={{ display: 'flex', gap: 36, height: WALL_HEIGHT }}>
              {/* Wall */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{ width: 440, flexShrink: 0, height: '100%' }}
              >
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  style={{ width: '100%', height: '100%', display: 'block', overflow: 'hidden' }}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <clipPath id="wallClip">
                      <rect width={W} height={H} rx="16" ry="16" />
                    </clipPath>
                    <linearGradient id="plywoodBase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c4a67a" />
                      <stop offset="50%" stopColor="#b8986a" />
                      <stop offset="100%" stopColor="#a88c5e" />
                    </linearGradient>
                    <pattern id="woodGrain" x="0" y="0" width="200" height="12" patternUnits="userSpaceOnUse">
                      <rect width="200" height="12" fill="transparent" />
                      <line x1="0" y1="2" x2="200" y2="2.5" stroke="rgba(100,70,30,0.12)" strokeWidth="0.8" />
                      <line x1="0" y1="5" x2="200" y2="4.5" stroke="rgba(100,70,30,0.08)" strokeWidth="0.5" />
                      <line x1="0" y1="8" x2="200" y2="8.8" stroke="rgba(100,70,30,0.1)" strokeWidth="0.6" />
                      <line x1="0" y1="11" x2="200" y2="10.5" stroke="rgba(100,70,30,0.06)" strokeWidth="0.4" />
                    </pattern>
                    <linearGradient id="panelDark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(0,0,0,0.04)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
                    </linearGradient>
                    <linearGradient id="panelLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.03)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.02)" />
                    </linearGradient>
                    <linearGradient id="holdHighlight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                      <stop offset="40%" stopColor="rgba(255,255,255,0.1)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
                    </linearGradient>
                    <pattern id="holdGrain" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
                      <rect width="6" height="6" fill="transparent" />
                      <circle cx="1" cy="1" r="0.4" fill="rgba(0,0,0,0.15)" />
                      <circle cx="4" cy="3" r="0.3" fill="rgba(255,255,255,0.08)" />
                      <circle cx="2" cy="5" r="0.35" fill="rgba(0,0,0,0.1)" />
                    </pattern>
                    <linearGradient id="gymLighting" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,245,220,0.12)" />
                      <stop offset="30%" stopColor="rgba(255,245,220,0.03)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.06)" />
                    </linearGradient>
                    <radialGradient id="vignette" cx="50%" cy="50%" r="60%">
                      <stop offset="0%" stopColor="transparent" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
                    </radialGradient>
                    <linearGradient id="topShadow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(0,0,0,0.25)" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>

                  <g clipPath="url(#wallClip)">
                  <rect width={W} height={H} fill="url(#plywoodBase)" />
                  <rect width={W} height={H} fill="url(#woodGrain)" />

                  {Array.from({ length: Math.ceil(W / PANEL_W) }).map((_, col) =>
                    Array.from({ length: Math.ceil(H / PANEL_H) }).map((_, row) => (
                      <rect key={`p-${col}-${row}`}
                        x={col * PANEL_W} y={row * PANEL_H} width={PANEL_W} height={PANEL_H}
                        fill={(col + row) % 2 === 0 ? 'url(#panelDark)' : 'url(#panelLight)'} />
                    ))
                  )}

                  {Array.from({ length: Math.ceil(W / PANEL_W) - 1 }).map((_, i) => {
                    const x = (i + 1) * PANEL_W;
                    return (
                      <g key={`vs-${i}`}>
                        <line x1={x} y1={0} x2={x} y2={H} stroke="rgba(80,55,25,0.3)" strokeWidth="1.5" />
                        <line x1={x + 1} y1={0} x2={x + 1} y2={H} stroke="rgba(200,175,130,0.15)" strokeWidth="0.5" />
                      </g>
                    );
                  })}
                  {Array.from({ length: Math.ceil(H / PANEL_H) - 1 }).map((_, i) => {
                    const y = (i + 1) * PANEL_H;
                    return (
                      <g key={`hs-${i}`}>
                        <line x1={0} y1={y} x2={W} y2={y} stroke="rgba(80,55,25,0.3)" strokeWidth="1.5" />
                        <line x1={0} y1={y + 1} x2={W} y2={y + 1} stroke="rgba(200,175,130,0.15)" strokeWidth="0.5" />
                      </g>
                    );
                  })}

                  {tNuts.map((nut, i) => (
                    <g key={`tn-${i}`}>
                      <circle cx={nut.x} cy={nut.y} r={2.5} fill="rgba(60,40,15,0.35)" />
                      <circle cx={nut.x} cy={nut.y} r={1.8} fill="rgba(40,25,10,0.5)" />
                    </g>
                  ))}

                  {chalkMarks.map((m, i) => (
                    <ellipse key={`ch-${i}`} cx={m.x} cy={m.y} rx={m.rx} ry={m.ry}
                      transform={`rotate(${m.rot}, ${m.x}, ${m.y})`} fill="rgba(255,255,255,0.06)" />
                  ))}

                  <rect width={W} height={H} fill="url(#gymLighting)" />
                  <rect width={W} height={H} fill="url(#vignette)" />
                  <rect x={0} y={0} width={W} height={18} fill="url(#topShadow)" />

                  {routes.map((holds, i) => (
                    <RouteLine key={`rl-${i}`} holds={holds} color={ROUTE_COLORS[i]}
                      isActive={selected === i} isHovered={hovered === i} />
                  ))}

                  {routes.map((holds, routeIdx) =>
                    holds.map((hold, holdIdx) => (
                      <ClimbingHold key={`${routeIdx}-${holdIdx}`} {...hold}
                        color={ROUTE_COLORS[routeIdx]}
                        isActive={selected === routeIdx}
                        isHovered={hovered === routeIdx}
                        onClick={() => setSelected(routeIdx)}
                        onMouseEnter={() => setHovered(routeIdx)}
                        onMouseLeave={() => setHovered(null)} />
                    ))
                  )}

                  </g>
                  <rect width={W} height={H} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2" rx="16" ry="16" />
                </svg>
              </motion.div>

              {/* Card column */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, flexShrink: 0 }}>
                  {displayProjects.map((p, i) => (
                    <button key={p.title}
                      onClick={() => setSelected(i)}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '5px 11px', borderRadius: 99,
                        background: selected === i ? `${ROUTE_COLORS[i]}18` : 'transparent',
                        border: `1px solid ${selected === i ? ROUTE_COLORS[i] : 'var(--border-color)'}`,
                        color: selected === i || hovered === i ? ROUTE_COLORS[i] : 'var(--text-secondary)',
                        cursor: 'pointer', fontSize: '0.7rem', fontWeight: 500,
                        fontFamily: 'var(--font-body)', transition: 'all 0.25s',
                      }}
                    >
                      <span style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: ROUTE_COLORS[i],
                        opacity: selected === i ? 1 : 0.5,
                        transition: 'opacity 0.25s',
                        boxShadow: selected === i ? `0 0 8px ${ROUTE_GLOWS[i]}` : 'none',
                      }} />
                      {p.title}
                    </button>
                  ))}
                </div>

                <div style={{ flex: 1, minHeight: 0 }}>
                  <AnimatePresence mode="wait">
                    <motion.div key={selected}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: '100%' }}
                    >
                      <div className="card" style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ position: 'relative', background: 'var(--bg-secondary)', overflow: 'hidden', flexShrink: 0, height: '45%' }}>
                          <img src={activeProject.image} alt={activeProject.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }} />
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 35%)',
                            opacity: 0.6, pointerEvents: 'none',
                          }} />
                          <div style={{
                            position: 'absolute', top: 0, left: 0, bottom: 0, width: 4,
                            background: ROUTE_COLORS[selected],
                            boxShadow: `0 0 16px ${ROUTE_GLOWS[selected]}`,
                          }} />
                        </div>

                        <div style={{ padding: '20px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          {/* <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                            <span style={{
                              padding: '3px 10px', borderRadius: 6,
                              background: `${ROUTE_COLORS[selected]}18`,
                              color: ROUTE_COLORS[selected],
                              fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.7rem',
                            }}>
                              V{selected + 3}
                            </span>
                            <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
                              Route {selected + 1} of {displayProjects.length}
                            </span>
                          </div> */}

                          <h2 style={{
                            fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700,
                            color: ROUTE_COLORS[selected], marginBottom: 8,
                          }}>
                            {activeProject.title}
                          </h2>

                          <p className="text-small" style={{
                            color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16,
                          }}>
                            {activeProject.description}
                          </p>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {activeProject.tools.map(tool => (
                              <span key={tool} className="tag">{tool}</span>
                            ))}
                          </div>

                          <div style={{ marginTop: 'auto', paddingTop: 20 }}>
                            <Link
                              to={`/projects/${toSlug(activeProject.title)}`}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '10px 22px', borderRadius: 10,
                                background: `${ROUTE_COLORS[selected]}18`,
                                border: `1px solid ${ROUTE_COLORS[selected]}44`,
                                color: ROUTE_COLORS[selected],
                                fontSize: '0.85rem', fontWeight: 600,
                                fontFamily: 'var(--font-heading)',
                                transition: 'all 0.2s',
                                textDecoration: 'none',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = `${ROUTE_COLORS[selected]}30`;
                                e.currentTarget.style.borderColor = ROUTE_COLORS[selected];
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = `${ROUTE_COLORS[selected]}18`;
                                e.currentTarget.style.borderColor = `${ROUTE_COLORS[selected]}44`;
                              }}
                            >
                              View project <ArrowUpRight size={15} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ── Mobile: stacked ── */}
            <div className="climbing-mobile" style={{ display: 'none' }}>
              {/* Wall */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  style={{ width: '100%', maxWidth: 360, height: 'auto', display: 'block', margin: '0 auto', overflow: 'hidden' }}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <clipPath id="wallClipM">
                      <rect width={W} height={H} rx="16" ry="16" />
                    </clipPath>
                    <linearGradient id="plywoodBaseM" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c4a67a" />
                      <stop offset="50%" stopColor="#b8986a" />
                      <stop offset="100%" stopColor="#a88c5e" />
                    </linearGradient>
                    <pattern id="woodGrainM" x="0" y="0" width="200" height="12" patternUnits="userSpaceOnUse">
                      <rect width="200" height="12" fill="transparent" />
                      <line x1="0" y1="2" x2="200" y2="2.5" stroke="rgba(100,70,30,0.12)" strokeWidth="0.8" />
                      <line x1="0" y1="5" x2="200" y2="4.5" stroke="rgba(100,70,30,0.08)" strokeWidth="0.5" />
                      <line x1="0" y1="8" x2="200" y2="8.8" stroke="rgba(100,70,30,0.1)" strokeWidth="0.6" />
                      <line x1="0" y1="11" x2="200" y2="10.5" stroke="rgba(100,70,30,0.06)" strokeWidth="0.4" />
                    </pattern>
                    <linearGradient id="panelDarkM" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(0,0,0,0.04)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
                    </linearGradient>
                    <linearGradient id="panelLightM" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.03)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.02)" />
                    </linearGradient>
                    <linearGradient id="holdHighlightM" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                      <stop offset="40%" stopColor="rgba(255,255,255,0.1)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
                    </linearGradient>
                    <pattern id="holdGrainM" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
                      <rect width="6" height="6" fill="transparent" />
                      <circle cx="1" cy="1" r="0.4" fill="rgba(0,0,0,0.15)" />
                      <circle cx="4" cy="3" r="0.3" fill="rgba(255,255,255,0.08)" />
                      <circle cx="2" cy="5" r="0.35" fill="rgba(0,0,0,0.1)" />
                    </pattern>
                    <linearGradient id="gymLightingM" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,245,220,0.12)" />
                      <stop offset="30%" stopColor="rgba(255,245,220,0.03)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.06)" />
                    </linearGradient>
                    <radialGradient id="vignetteM" cx="50%" cy="50%" r="60%">
                      <stop offset="0%" stopColor="transparent" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
                    </radialGradient>
                    <linearGradient id="topShadowM" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(0,0,0,0.25)" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>

                  <g clipPath="url(#wallClipM)">
                  <rect width={W} height={H} fill="url(#plywoodBaseM)" />
                  <rect width={W} height={H} fill="url(#woodGrainM)" />

                  {Array.from({ length: Math.ceil(W / PANEL_W) }).map((_, col) =>
                    Array.from({ length: Math.ceil(H / PANEL_H) }).map((_, row) => (
                      <rect key={`pm-${col}-${row}`}
                        x={col * PANEL_W} y={row * PANEL_H} width={PANEL_W} height={PANEL_H}
                        fill={(col + row) % 2 === 0 ? 'url(#panelDarkM)' : 'url(#panelLightM)'} />
                    ))
                  )}

                  {Array.from({ length: Math.ceil(W / PANEL_W) - 1 }).map((_, i) => {
                    const x = (i + 1) * PANEL_W;
                    return (
                      <g key={`vsm-${i}`}>
                        <line x1={x} y1={0} x2={x} y2={H} stroke="rgba(80,55,25,0.3)" strokeWidth="1.5" />
                        <line x1={x + 1} y1={0} x2={x + 1} y2={H} stroke="rgba(200,175,130,0.15)" strokeWidth="0.5" />
                      </g>
                    );
                  })}
                  {Array.from({ length: Math.ceil(H / PANEL_H) - 1 }).map((_, i) => {
                    const y = (i + 1) * PANEL_H;
                    return (
                      <g key={`hsm-${i}`}>
                        <line x1={0} y1={y} x2={W} y2={y} stroke="rgba(80,55,25,0.3)" strokeWidth="1.5" />
                        <line x1={0} y1={y + 1} x2={W} y2={y + 1} stroke="rgba(200,175,130,0.15)" strokeWidth="0.5" />
                      </g>
                    );
                  })}

                  {tNuts.map((nut, i) => (
                    <g key={`tnm-${i}`}>
                      <circle cx={nut.x} cy={nut.y} r={2.5} fill="rgba(60,40,15,0.35)" />
                      <circle cx={nut.x} cy={nut.y} r={1.8} fill="rgba(40,25,10,0.5)" />
                    </g>
                  ))}

                  {chalkMarks.map((m, i) => (
                    <ellipse key={`chm-${i}`} cx={m.x} cy={m.y} rx={m.rx} ry={m.ry}
                      transform={`rotate(${m.rot}, ${m.x}, ${m.y})`} fill="rgba(255,255,255,0.06)" />
                  ))}

                  <rect width={W} height={H} fill="url(#gymLightingM)" />
                  <rect width={W} height={H} fill="url(#vignetteM)" />
                  <rect x={0} y={0} width={W} height={18} fill="url(#topShadowM)" />

                  {routes.map((holds, i) => (
                    <RouteLine key={`rlm-${i}`} holds={holds} color={ROUTE_COLORS[i]}
                      isActive={selected === i} isHovered={hovered === i} />
                  ))}

                  {routes.map((holds, routeIdx) =>
                    holds.map((hold, holdIdx) => (
                      <ClimbingHold key={`m-${routeIdx}-${holdIdx}`} {...hold}
                        color={ROUTE_COLORS[routeIdx]}
                        isActive={selected === routeIdx}
                        isHovered={hovered === routeIdx}
                        onClick={() => setSelected(routeIdx)}
                        onMouseEnter={() => setHovered(routeIdx)}
                        onMouseLeave={() => setHovered(null)} />
                    ))
                  )}

                  </g>
                  <rect width={W} height={H} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2" rx="16" ry="16" />
                </svg>
              </motion.div>

              {/* Route legend */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 20, marginBottom: 20 }}>
                {displayProjects.map((p, i) => (
                  <button key={p.title}
                    onClick={() => setSelected(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '5px 11px', borderRadius: 99,
                      background: selected === i ? `${ROUTE_COLORS[i]}18` : 'transparent',
                      border: `1px solid ${selected === i ? ROUTE_COLORS[i] : 'var(--border-color)'}`,
                      color: selected === i || hovered === i ? ROUTE_COLORS[i] : 'var(--text-secondary)',
                      cursor: 'pointer', fontSize: '0.7rem', fontWeight: 500,
                      fontFamily: 'var(--font-body)', transition: 'all 0.25s',
                    }}
                  >
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: ROUTE_COLORS[i],
                      opacity: selected === i ? 1 : 0.5,
                      boxShadow: selected === i ? `0 0 8px ${ROUTE_GLOWS[i]}` : 'none',
                    }} />
                    {p.title}
                  </button>
                ))}
              </div>

              {/* Card */}
              <AnimatePresence mode="wait">
                <motion.div key={selected}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ position: 'relative', aspectRatio: '16/10', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                      <img src={activeProject.image} alt={activeProject.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }} />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 35%)',
                        opacity: 0.6, pointerEvents: 'none',
                      }} />
                      <div style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0, width: 4,
                        background: ROUTE_COLORS[selected],
                        boxShadow: `0 0 16px ${ROUTE_GLOWS[selected]}`,
                      }} />
                    </div>

                    <div style={{ padding: '20px 24px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 6,
                          background: `${ROUTE_COLORS[selected]}18`,
                          color: ROUTE_COLORS[selected],
                          fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.7rem',
                        }}>
                          V{selected + 3}
                        </span>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
                          Route {selected + 1} of {displayProjects.length}
                        </span>
                      </div>

                      <h2 style={{
                        fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700,
                        color: ROUTE_COLORS[selected], marginBottom: 8,
                      }}>
                        {activeProject.title}
                      </h2>

                      <p className="text-small" style={{
                        color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16,
                      }}>
                        {activeProject.description}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {activeProject.tools.map(tool => (
                          <span key={tool} className="tag">{tool}</span>
                        ))}
                      </div>

                      <Link
                        to={`/projects/${toSlug(activeProject.title)}`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          marginTop: 20,
                          padding: '10px 22px', borderRadius: 10,
                          background: `${ROUTE_COLORS[selected]}18`,
                          border: `1px solid ${ROUTE_COLORS[selected]}44`,
                          color: ROUTE_COLORS[selected],
                          fontSize: '0.85rem', fontWeight: 600,
                          fontFamily: 'var(--font-heading)',
                          transition: 'all 0.2s',
                          textDecoration: 'none',
                        }}
                      >
                        View project <ArrowUpRight size={15} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ── More Projects grid ── */}
        <section className="section-gap" style={{ position: 'relative', zIndex: 10, paddingTop: 0 }}>
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginBottom: 36 }}
            >
              <h2 className="text-section">More Projects</h2>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: 24 }}>
              {remainingProjects.map((project, i) => (
                <motion.a
                  key={project.title}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="card"
                  style={{ display: 'block', overflow: 'hidden', textDecoration: 'none' }}
                >
                  <div style={{ position: 'relative', aspectRatio: '16/10', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                    <img
                      src={project.image}
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 35%)', opacity: 0.6, pointerEvents: 'none' }} />
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
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
