import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import { AboutDecorations } from '../components/PageDecorations';
import personal from '../data/personal.json';
import experience from '../data/experience.json';

const A = 'var(--accent-about)';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, delay },
});

/* Photos carousel — cycles through images with crossfade */
function PhotoCarousel() {
  const photos = [
    '/images/me/me1.jpg',
    '/images/me/me2.jpg',
    '/images/me/me3.jpg',
    '/images/me/me4.jpg',
    '/images/me/me5.jpg',
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % photos.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      {...fadeUp(0.1)}
      style={{ position: 'relative', width: '100%', maxWidth: 420, aspectRatio: '3/4', borderRadius: 20, overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={photos[current]}
          alt={`Photo ${current + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => {
            e.target.style.opacity = '0';
          }}
        />
      </AnimatePresence>
      {/* Photo indicator dots */}
      <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 24 : 8, height: 8, borderRadius: 99,
              background: i === current ? 'var(--accent-about)' : 'rgba(255,255,255,0.3)',
              border: 'none', cursor: 'pointer', transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ContactForm() {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setStatus('success');
      formRef.current.reset();
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
        <input type="text" name="first_name" placeholder="First Name" required className="input-field" />
        <input type="text" name="last_name" placeholder="Last Name" required className="input-field" />
      </div>
      <input type="email" name="email" placeholder="Email" required className="input-field" style={{ marginBottom: 16 }} />
      <textarea name="message" placeholder="Your message..." rows={6} required className="input-field" style={{ marginBottom: 24, resize: 'none' }} />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-pad-lg"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 12, borderRadius: 14, fontWeight: 600, fontSize: '0.9rem', background: A, color: 'var(--bg-primary)', boxShadow: `0 4px 24px var(--accent-about-glow)`, border: 'none', cursor: 'pointer', opacity: status === 'sending' ? 0.5 : 1, fontFamily: 'inherit' }}
      >
        {status === 'sending' ? 'Sending...'
          : status === 'success' ? <><CheckCircle size={16} /> Sent!</>
          : status === 'error' ? <><AlertCircle size={16} /> Failed - try again</>
          : <><Send size={16} /> Send Message</>}
      </button>
    </form>
  );
}

function ExperienceCard({ title, subtitle, date, accentLine, delay = 0 }) {
  return (
    <motion.div {...fadeUp(delay)} className="card" style={{ display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>
      <div style={{ width: 5, flexShrink: 0, background: accentLine }} />
      <div style={{ padding: '18px 24px', flex: 1 }}>
        <p className="text-card-title">{title}</p>
        <p className="text-small" style={{ color: 'var(--text-secondary)', marginTop: 10 }}>{subtitle}</p>
        <p className="text-small" style={{ color: 'var(--text-dim)', marginTop: 6 }}>{date}</p>
      </div>
    </motion.div>
  );
}

export default function About() {
  return (
    <PageTransition>
      <div className="theme-about" style={{ minHeight: '100vh', position: 'relative' }}>
        <AboutDecorations />

        {/* Hero + Photos */}
        <style>{`
          .about-hero-grid { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: center; }
          @media (min-width: 768px) { .about-hero-grid { grid-template-columns: 1fr auto; gap: 64px; } }
        `}</style>
        <section className="page-hero" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <div className="about-hero-grid">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="text-hero" style={{ marginBottom: 20 }}>About Me</h1>
                <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 480 }}>
                  {personal.aboutText}
                </p>
              </motion.div>
              <PhotoCarousel />
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="section-gap" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <SectionHeading accent={A}>Experience</SectionHeading>
            <style>{`
              .exp-grid { display: grid; grid-template-columns: 1fr; gap: 48px; }
              @media (min-width: 1024px) { .exp-grid { grid-template-columns: 1fr 1fr; gap: 64px; } }
            `}</style>
            <div className="exp-grid">
              <div>
                <p className="text-label mb-xl" style={{ color: A }}>Education</p>
                <div className="stack-lg">
                  {experience.education.map((edu, i) => (
                    <ExperienceCard
                      key={i}
                      title={edu.institution}
                      subtitle={edu.degree}
                      date={edu.date}
                      accentLine={A}
                      delay={i * 0.07}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-label mb-xl" style={{ color: A }}>Work</p>
                <div className="stack-lg">
                  {experience.work.map((job, i) => (
                    <ExperienceCard
                      key={i}
                      title={`${job.title} @ ${job.company}`}
                      subtitle={job.company}
                      date={job.date}
                      accentLine={`hsl(${28 + i * 5}, 55%, ${68 - i * 5}%)`}
                      delay={i * 0.07}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="section-gap" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <SectionHeading accent={A}>Get In Touch</SectionHeading>
            <div style={{ maxWidth: 520 }}>
              <motion.p
                {...fadeUp()}
                className="text-body"
                style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 40 }}
              >
                Have a question or want to work together? Drop me a message.
              </motion.p>
              <motion.div {...fadeUp(0.1)}>
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
