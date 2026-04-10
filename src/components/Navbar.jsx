import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', theme: 'home' },
  { path: '/projects', label: 'Projects', theme: 'projects' },
  { path: '/about', label: 'About', theme: 'about' },
];

const accentMap = {
  home: 'var(--accent-home)',
  projects: 'var(--accent-projects)',
  about: 'var(--accent-about)',
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const current = navItems.find(n => n.path === location.pathname)
    || navItems.find(n => n.path !== '/' && location.pathname.startsWith(n.path))
    || navItems[0];
  const accent = accentMap[current.theme];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.3s',
        background: scrolled ? 'rgba(9, 9, 15, 0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent',
      }}
    >
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        {/* Cursive CY logo */}
        <NavLink
          to="/"
          style={{
            fontFamily: "'Ruthie', cursive",
            fontSize: '2.2rem',
            color: accent,
            transition: 'color 0.3s',
            lineHeight: 1,
            textDecoration: 'none',
          }}
        >
          CY
        </NavLink>

        {/* Desktop nav — gap: 8px between links */}
        <div className="nav-desktop" style={{ display: 'none', alignItems: 'center', gap: 8 }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{
                  position: 'relative',
                  padding: '8px 20px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  borderRadius: 10,
                  transition: 'color 0.2s',
                  color: isActive ? accentMap[item.theme] : 'var(--text-secondary)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = isActive ? accentMap[item.theme] : 'var(--text-secondary)'; }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    style={{ position: 'absolute', inset: 0, borderRadius: 10, background: `${accentMap[item.theme]}12` }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 10 }}>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button
          className="nav-mobile-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: 'none', padding: 8, marginRight: -8, cursor: 'pointer', background: 'none', border: 'none', color: accent }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 768px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', background: 'rgba(9, 9, 15, 0.96)', backdropFilter: 'blur(20px)' }}
          >
            <div className="page-container" style={{ paddingTop: 16, paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    style={{
                      padding: '12px 20px',
                      borderRadius: 12,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      transition: 'color 0.2s',
                      color: isActive ? accentMap[item.theme] : 'var(--text-secondary)',
                      background: isActive ? `${accentMap[item.theme]}10` : 'transparent',
                      textDecoration: 'none',
                    }}
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
