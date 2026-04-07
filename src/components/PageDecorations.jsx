import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════
   HOME — animated circuit board with traces drawing themselves,
   orbiting rings, and a pulsing node network
   ═══════════════════════════════════════════════════ */
export function HomeDecorations() {
  const c = '#a855f7';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Large orbiting rings — right side */}
      <div className="absolute top-[10%] right-[3%] w-[300px] h-[300px] hidden lg:block">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `1px solid ${c}12` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
        {/* Middle ring */}
        <motion.div
          className="absolute inset-[25%] rounded-full"
          style={{ border: `1px dashed ${c}18` }}
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute inset-[45%] rounded-full"
          style={{ border: `1px solid ${c}25` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        {/* Orbiting dot on outer ring */}
        <motion.div
          className="absolute"
          style={{ top: '50%', left: '50%', marginTop: -5, marginLeft: -5 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: c, boxShadow: `0 0 16px 4px ${c}60`, transform: 'translateX(150px)' }}
          />
        </motion.div>
        {/* Orbiting dot on middle ring, opposite direction */}
        <motion.div
          className="absolute"
          style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: c, opacity: 0.7, boxShadow: `0 0 10px 2px ${c}40`, transform: 'translateX(90px)' }}
          />
        </motion.div>
        {/* Center pulsing core */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: 8, height: 8, background: c, boxShadow: `0 0 30px 8px ${c}40` }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Vertical animated circuit trace — left side with flowing dashes */}
      <svg className="absolute left-[4%] top-0 h-full w-12 hidden xl:block">
        <motion.line
          x1="6" y1="0" x2="6" y2="100%"
          stroke={c}
          strokeWidth="1"
          strokeDasharray="4 8"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -120 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ opacity: 0.15 }}
        />
        {/* Branch lines */}
        <line x1="6" y1="25%" x2="40" y2="25%" stroke={c} strokeWidth="1" opacity="0.1" />
        <line x1="6" y1="50%" x2="30" y2="50%" stroke={c} strokeWidth="1" opacity="0.08" />
        <line x1="6" y1="75%" x2="35" y2="75%" stroke={c} strokeWidth="1" opacity="0.1" />
        {/* Junction dots */}
        <circle cx="6" cy="25%" r="3" fill={c} opacity="0.25" />
        <circle cx="6" cy="50%" r="2.5" fill={c} opacity="0.2" />
        <circle cx="6" cy="75%" r="3" fill={c} opacity="0.25" />
        <circle cx="40" cy="25%" r="2" fill={c} opacity="0.15" />
        <circle cx="30" cy="50%" r="2" fill={c} opacity="0.12" />
        <circle cx="35" cy="75%" r="2" fill={c} opacity="0.15" />
      </svg>

      {/* Horizontal flowing trace — bottom area */}
      <svg className="absolute bottom-[8%] left-0 w-full h-12 hidden lg:block">
        <motion.line
          x1="0" y1="6" x2="100%" y2="6"
          stroke={c}
          strokeWidth="1"
          strokeDasharray="6 10"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -160 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{ opacity: 0.1 }}
        />
      </svg>

      {/* Scattered pulsing nodes */}
      {[
        { top: '20%', right: '25%', size: 6, delay: 0 },
        { top: '40%', right: '18%', size: 4, delay: 1 },
        { top: '65%', right: '30%', size: 5, delay: 2 },
        { top: '35%', left: '12%', size: 4, delay: 0.5 },
        { top: '80%', left: '15%', size: 5, delay: 1.5 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full hidden lg:block"
          style={{ width: dot.size, height: dot.size, background: c, top: dot.top, right: dot.right, left: dot.left }}
          animate={{ opacity: [0.15, 0.5, 0.15], scale: [1, 1.8, 1], boxShadow: [`0 0 0px ${c}00`, `0 0 12px ${c}50`, `0 0 0px ${c}00`] }}
          transition={{ duration: 3, delay: dot.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Ambient glows */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full" style={{ background: `radial-gradient(circle, ${c}0a 0%, transparent 65%)` }} />
      <div className="absolute top-[60%] -left-40 w-[500px] h-[500px] rounded-full" style={{ background: `radial-gradient(circle, ${c}06 0%, transparent 65%)` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HOBBY — tall equalizer spanning the right edge,
   large floating notes, piano key stripe at bottom
   ═══════════════════════════════════════════════════ */
export function HobbyDecorations() {
  const c = '#f0a500';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* TALL equalizer — right side, spanning 70% of viewport height */}
      <div className="absolute right-[3%] top-[10%] bottom-[10%] flex items-end gap-[5px] hidden lg:flex">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-[4px] rounded-full origin-bottom"
            style={{ background: `linear-gradient(to top, ${c}, ${c}40)` }}
            animate={{
              height: [
                `${8 + Math.random() * 12}%`,
                `${30 + Math.random() * 60}%`,
                `${8 + Math.random() * 12}%`,
              ],
              opacity: [0.12, 0.35, 0.12],
            }}
            transition={{
              duration: 1.0 + Math.random() * 1.2,
              delay: i * 0.06,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Large floating music notes */}
      {[
        { char: '♪', left: '8%', top: '15%', size: '4rem' },
        { char: '♫', left: '85%', top: '25%', size: '3rem' },
        { char: '♩', left: '15%', top: '60%', size: '3.5rem' },
        { char: '♬', left: '75%', top: '70%', size: '2.5rem' },
        { char: '♪', left: '45%', top: '85%', size: '2rem' },
      ].map((note, i) => (
        <motion.div
          key={i}
          className="absolute select-none hidden lg:block"
          style={{ color: c, left: note.left, top: note.top, fontSize: note.size }}
          animate={{
            y: [0, -40, 0],
            x: [0, 15, -10, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.06, 0.15, 0.06],
          }}
          transition={{
            duration: 7 + i * 2,
            delay: i * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {note.char}
        </motion.div>
      ))}

      {/* Waveform line across middle */}
      <svg className="absolute left-0 top-[45%] w-full h-24 hidden lg:block" preserveAspectRatio="none" viewBox="0 0 1200 100">
        <motion.path
          d="M0,50 Q50,20 100,50 Q150,80 200,50 Q250,20 300,50 Q350,80 400,50 Q450,10 500,50 Q550,90 600,50 Q650,15 700,50 Q750,85 800,50 Q850,20 900,50 Q950,80 1000,50 Q1050,25 1100,50 Q1150,75 1200,50"
          fill="none"
          stroke={c}
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.1 }}
          transition={{ duration: 4, ease: 'easeOut' }}
        />
      </svg>

      {/* Ambient glows */}
      <div className="absolute -top-20 left-[20%] w-[600px] h-[600px] rounded-full" style={{ background: `radial-gradient(circle, ${c}0c 0%, transparent 60%)` }} />
      <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] rounded-full" style={{ background: `radial-gradient(circle, ${c}08 0%, transparent 60%)` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PROJECTS — climbing holds + rope + chalk
   (keeping this one since you liked it)
   ═══════════════════════════════════════════════════ */
export function ProjectsDecorations() {
  const c = '#f43f5e';
  const c2 = 'rgba(236, 72, 153, 0.8)';

  const holds = [
    { top: '12%', right: '6%', size: 14, color: c, delay: 0 },
    { top: '28%', right: '10%', size: 10, color: c2, delay: 0.5 },
    { top: '40%', right: '4%', size: 12, color: c, delay: 1 },
    { top: '55%', right: '12%', size: 9, color: c2, delay: 1.5 },
    { top: '70%', right: '7%', size: 11, color: c, delay: 2 },
    { top: '85%', right: '9%', size: 13, color: c2, delay: 0.8 },
    { top: '18%', left: '4%', size: 10, color: c, delay: 0.3 },
    { top: '45%', left: '6%', size: 8, color: c2, delay: 1.2 },
    { top: '72%', left: '3%', size: 11, color: c, delay: 1.8 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {holds.map((hold, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full hidden lg:block"
          style={{
            width: hold.size, height: hold.size,
            background: hold.color, opacity: 0.15,
            top: hold.top, right: hold.right, left: hold.left,
          }}
          animate={{ opacity: [0.1, 0.25, 0.1], scale: [1, 1.15, 1] }}
          transition={{ duration: 4, delay: hold.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <svg className="absolute right-[7%] top-0 h-full w-8 hidden xl:block" viewBox="0 0 32 1000" preserveAspectRatio="none">
        <motion.path
          d="M16,0 Q24,100 8,200 Q-4,300 20,400 Q32,500 12,600 Q0,700 24,800 Q32,900 16,1000"
          fill="none"
          stroke={c}
          strokeWidth="1.5"
          strokeDasharray="8 12"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.15 }}
          transition={{ duration: 3, ease: 'easeOut' }}
        />
      </svg>

      {[
        { top: '22%', right: '18%', w: 30, h: 2 },
        { top: '50%', right: '22%', w: 20, h: 2 },
        { top: '78%', left: '12%', w: 25, h: 2 },
      ].map((mark, i) => (
        <div
          key={i}
          className="absolute rounded-full hidden lg:block"
          style={{
            width: mark.w, height: mark.h,
            background: 'rgba(255,255,255,0.04)',
            top: mark.top, right: mark.right, left: mark.left,
            transform: `rotate(${-15 + i * 20}deg)`,
          }}
        />
      ))}

      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full" style={{ background: `radial-gradient(circle, ${c}08 0%, transparent 60%)` }} />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full" style={{ background: `radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 60%)` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ABOUT — cascading books/pages falling, large quill pen SVG,
   ink splatter dots, tall bookshelf spines
   ═══════════════════════════════════════════════════ */
export function AboutDecorations() {
  const c = '#4ade80';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Tall bookshelf spines — right side, varying widths/heights/colors */}
      <div className="absolute right-[2%] bottom-0 flex items-end gap-[6px] hidden lg:flex" style={{ height: '85%' }}>
        {[
          { w: 12, h: '60%', color: `${c}12` },
          { w: 8, h: '75%', color: `${c}0e` },
          { w: 14, h: '50%', color: `${c}10` },
          { w: 10, h: '82%', color: `${c}0c` },
          { w: 6, h: '65%', color: `${c}14` },
          { w: 11, h: '70%', color: `${c}0e` },
          { w: 9, h: '55%', color: `${c}10` },
          { w: 13, h: '78%', color: `${c}0c` },
        ].map((spine, i) => (
          <motion.div
            key={i}
            className="rounded-t-sm"
            style={{ width: spine.w, background: spine.color }}
            initial={{ height: 0 }}
            animate={{ height: spine.h }}
            transition={{ duration: 1.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>

      {/* Cascading falling pages — larger and more visible */}
      {[
        { right: '12%', w: 20, h: 26, dur: 14, delay: 0, rot: 540 },
        { right: '8%', w: 16, h: 22, dur: 18, delay: 3, rot: -360 },
        { right: '18%', w: 24, h: 30, dur: 22, delay: 6, rot: 720 },
        { right: '5%', w: 14, h: 18, dur: 16, delay: 9, rot: -540 },
        { left: '8%', w: 18, h: 24, dur: 20, delay: 4, rot: 360 },
        { left: '12%', w: 14, h: 20, dur: 17, delay: 8, rot: -480 },
      ].map((page, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:block"
          style={{
            right: page.right, left: page.left,
            top: '-8%',
            width: page.w, height: page.h,
            border: `1px solid ${c}`,
            borderRadius: 3,
            background: `${c}06`,
          }}
          animate={{
            y: ['-10vh', '115vh'],
            rotate: [0, page.rot],
            opacity: [0, 0.2, 0.2, 0],
          }}
          transition={{
            duration: page.dur,
            delay: page.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Ink splatter dots — scattered */}
      {[
        { top: '15%', left: '5%', size: 20 },
        { top: '35%', right: '22%', size: 14 },
        { top: '60%', left: '8%', size: 16 },
        { top: '80%', right: '28%', size: 12 },
        { top: '50%', left: '15%', size: 10 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full hidden lg:block"
          style={{
            width: dot.size, height: dot.size,
            background: `radial-gradient(circle, ${c}15 0%, ${c}05 70%, transparent 100%)`,
            top: dot.top, left: dot.left, right: dot.right,
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4 + i, delay: i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Quill/pen stroke — decorative SVG curve on left */}
      <svg className="absolute left-[2%] top-[10%] h-[80%] w-16 hidden xl:block" viewBox="0 0 60 800" preserveAspectRatio="none">
        <motion.path
          d="M30,0 C35,80 10,160 30,240 C50,320 15,400 30,480 C45,560 10,640 30,720 C40,760 25,800 30,800"
          fill="none"
          stroke={c}
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.12 }}
          transition={{ duration: 4, ease: 'easeOut' }}
        />
      </svg>

      {/* Ambient glows */}
      <div className="absolute top-[10%] -right-20 w-[600px] h-[600px] rounded-full" style={{ background: `radial-gradient(circle, ${c}0c 0%, transparent 55%)` }} />
      <div className="absolute -bottom-20 left-[15%] w-[500px] h-[500px] rounded-full" style={{ background: `radial-gradient(circle, ${c}08 0%, transparent 55%)` }} />
    </div>
  );
}
