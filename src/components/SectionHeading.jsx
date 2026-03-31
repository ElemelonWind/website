import { motion } from 'framer-motion';

export default function SectionHeading({ children, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="mb-xl"
      style={{ display: 'flex', alignItems: 'center', gap: 24 }}
    >
      <h2 className="text-section" style={{ whiteSpace: 'nowrap' }}>
        {children}
      </h2>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}30, transparent)` }} />
    </motion.div>
  );
}
