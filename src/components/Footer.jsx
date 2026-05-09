import { GitHubIcon, LinkedInIcon, InstagramIcon, SubstackIcon } from './SocialIcons';
import personal from '../data/personal.json';

const socialIcons = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  instagram: InstagramIcon,
  substack: SubstackIcon,
};

export default function Footer() {
  return (
    <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid var(--border-color)', paddingTop: 48, paddingBottom: 48 }}>
      <div className="page-container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <p className="text-tiny" style={{ color: 'var(--text-dim)', fontWeight: 500 }}>
          &copy; {personal.copyright}
        </p>
        <div style={{ display: 'flex', gap: 24 }}>
          {Object.entries(personal.socials).map(([key, url]) => {
            const Icon = socialIcons[key];
            return Icon ? (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-dim)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
              >
                <Icon size={17} />
              </a>
            ) : null;
          })}
        </div>
      </div>
    </footer>
  );
}
