import { motion } from 'framer-motion';
import { Music, Disc3 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import { HobbyDecorations } from '../components/PageDecorations';
import hobby from '../data/hobby.json';

const A = 'var(--accent-hobby)';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, delay },
});

function GallerySection({ section }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 28 }}>
      {section.images.map((img, i) => (
        <motion.div
          key={i}
          {...fadeUp(i * 0.08)}
          className="card"
          style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', borderRadius: 16 }}
        >
          <img
            src={img.src}
            alt={img.caption}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, transition: 'all 0.5s' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: 'absolute', inset: 0, background: 'var(--bg-card)' }}>
            <div style={{ textAlign: 'center', padding: 32 }}>
              <Music size={28} style={{ margin: '0 auto 16px', color: A, opacity: 0.4 }} />
              <p className="text-small" style={{ color: 'var(--text-dim)' }}>{img.caption}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function CompositionsSection({ section }) {
  return (
    <div className="stack-lg">
      {section.pieces.map((piece, i) => (
        <motion.div
          key={i}
          {...fadeUp(i * 0.08)}
          className="card"
          style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '18px 24px' }}
        >
          <div style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--accent-hobby-dim)' }}>
            <Disc3 size={20} style={{ color: A }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="text-card-title">{piece.title}</p>
            <p className="text-small mt-sm" style={{ color: 'var(--text-secondary)' }}>{piece.description}</p>
          </div>
          {piece.link && (
            <a href={piece.link} target="_blank" rel="noopener noreferrer" className="tag" style={{ flexShrink: 0 }}>
              Listen
            </a>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function SpotifySection({ section }) {
  return (
    <motion.div {...fadeUp()} className="card" style={{ overflow: 'hidden', padding: 12 }}>
      <iframe
        src={section.embedUrl}
        width="100%"
        height="352"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ borderRadius: 12, display: 'block' }}
        title="Spotify Playlist"
      />
    </motion.div>
  );
}

export default function Hobby() {
  const intro = hobby.sections.find(s => s.type === 'intro');
  const gallery = hobby.sections.find(s => s.type === 'gallery');
  const compositions = hobby.sections.find(s => s.type === 'compositions');
  const spotify = hobby.sections.find(s => s.type === 'spotify');

  return (
    <PageTransition>
      <div className="theme-hobby" style={{ minHeight: '100vh', position: 'relative' }}>
        <HobbyDecorations />

        <section className="page-hero" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ maxWidth: 600 }}
            >
              <h1 className="text-hero" style={{ marginBottom: 20 }}>
                {intro?.title || 'Hobby'}
              </h1>
              <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 480 }}>
                {intro?.text}
              </p>
            </motion.div>
          </div>
        </section>

        {gallery && (
          <section className="section-gap" style={{ position: 'relative', zIndex: 10 }}>
            <div className="page-container">
              <SectionHeading accent={A}>{gallery.title}</SectionHeading>
              <GallerySection section={gallery} />
            </div>
          </section>
        )}

        {compositions && (
          <section className="section-gap" style={{ position: 'relative', zIndex: 10 }}>
            <div className="page-container">
              <SectionHeading accent={A}>{compositions.title}</SectionHeading>
              <div style={{ maxWidth: 640 }}>
                <CompositionsSection section={compositions} />
              </div>
            </div>
          </section>
        )}

        {spotify && (
          <section className="section-gap" style={{ position: 'relative', zIndex: 10 }}>
            <div className="page-container">
              <SectionHeading accent={A}>{spotify.title}</SectionHeading>
              <div style={{ maxWidth: 640 }}>
                <SpotifySection section={spotify} />
              </div>
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
}
