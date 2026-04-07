import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Music, BookOpen } from 'lucide-react';
import emailjs from '@emailjs/browser';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import { AboutDecorations } from '../components/PageDecorations';
import personal from '../data/personal.json';
import music from '../data/hobby.json';

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
  const [failed, setFailed] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % photos.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const isFailed = failed[current];

  return (
    <motion.div
      {...fadeUp(0.1)}
      style={{ position: 'relative', width: '75%', margin: '0 auto', maxWidth: 420, aspectRatio: '3/4', borderRadius: 20, overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
    >
      <AnimatePresence mode="wait">
        {isFailed ? (
          <motion.div
            key={`fallback-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 32, textAlign: 'center', background: 'var(--accent-about-dim)' }}
          >
            <div style={{ width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-about-glow)' }}>
              <Music size={26} style={{ color: A }} />
            </div>
            <p className="text-small" style={{ color: 'var(--text-secondary)', maxWidth: 240, lineHeight: 1.6 }}>
              Drop a photo at <code style={{ color: A, fontSize: '0.78rem' }}>{photos[current]}</code>
            </p>
          </motion.div>
        ) : (
          <motion.img
            key={current}
            src={photos[current]}
            alt={`Photo ${current + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={() => setFailed(prev => ({ ...prev, [current]: true }))}
          />
        )}
      </AnimatePresence>
      {/* Photo indicator dots */}
      <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 2 }}>
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

function MusicGallery({ images }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 24 }}>
      {images.map((img, i) => (
        <motion.figure
          key={i}
          {...fadeUp(i * 0.06)}
          className="card"
          style={{ margin: 0, overflow: 'hidden', borderRadius: 16, display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--bg-card)' }}>
            <img
              src={img.src}
              alt={img.caption}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
              <Music size={28} style={{ color: A, opacity: 0.4 }} />
            </div>
          </div>
          <figcaption className="text-small" style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
            {img.caption}
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}

function Bookshelf({ books }) {
  return (
    <div className="stack-lg">
      {books.map((book, i) => (
        <motion.div
          key={i}
          {...fadeUp(i * 0.06)}
          className="card"
          style={{ display: 'flex', alignItems: 'stretch', gap: 18, padding: 18 }}
        >
          <div style={{ width: 56, minHeight: 84, borderRadius: 6, overflow: 'hidden', flexShrink: 0, position: 'relative', background: 'var(--accent-about-glow)', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
            {book.cover && (
              <img
                src={book.cover}
                alt={book.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }}
                onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
              />
            )}
            <div style={{ display: book.cover ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
              <BookOpen size={20} style={{ color: A, opacity: 0.6 }} />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p className="text-card-title">{book.title}</p>
            <p className="text-tiny" style={{ color: A, marginTop: 4, fontWeight: 500, letterSpacing: '0.02em' }}>{book.author}</p>
            {book.note && (
              <p className="text-small mt-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{book.note}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
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
          .music-split { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: start; }
          @media (min-width: 1024px) { .music-split { grid-template-columns: 1.1fr 1fr; gap: 56px; } }
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

        {/* Music — intro + gallery */}
        <section className="section-gap" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <SectionHeading accent={A}>Music</SectionHeading>
            <motion.p
              {...fadeUp()}
              className="text-body"
              style={{ color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 720, marginBottom: 40 }}
            >
              {music.intro}
            </motion.p>
            <MusicGallery images={music.gallery} />
          </div>
        </section>

        {/* Compositions + Currently Listening — side by side on wide screens */}
        <section className="section-gap" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <div className="music-split">
              <div>
                <SectionHeading accent={A}>Bookshelf</SectionHeading>
                <motion.p
                  {...fadeUp()}
                  className="text-small"
                  style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 28 }}
                >
                  The ones I've talked my friends' ears off about.
                </motion.p>
                <Bookshelf books={music.books} />
              </div>
              <div>
                <SectionHeading accent={A}>On Repeat</SectionHeading>
                <motion.p
                  {...fadeUp()}
                  className="text-small"
                  style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 28 }}
                >
                  What's been soundtracking my life lately.
                </motion.p>
                <motion.div {...fadeUp(0.1)} className="card" style={{ overflow: 'hidden', padding: 12 }}>
                  <iframe
                    src={music.spotify.embedUrl}
                    width="100%"
                    height="380"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    style={{ borderRadius: 12, display: 'block' }}
                    title="Spotify Playlist"
                  />
                </motion.div>
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
                Want to roast this website? Drop me a message.
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
