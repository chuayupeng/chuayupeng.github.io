import { Link } from 'react-router-dom';
import { ArrowUpRight, FlaskConical, Hammer, Laptop, Layers3, Martini, Shield, Swords } from 'lucide-react';
import './character-panel.css';

interface CharacterPanelProps {
  level: number;
}

const skillPaths = [
  { name: 'Offensive', description: 'Red teaming & pentesting', icon: Swords, tone: 'offensive', primary: true },
  { name: 'Defensive', description: 'Response & forensics', icon: Shield, tone: 'defensive', primary: false },
  { name: 'Building', description: 'Make ideas usable', icon: Hammer, tone: 'building', primary: false },
  { name: 'Hospitality', description: 'Drinks & experiences', icon: Martini, tone: 'hospitality', primary: false },
] as const;

const inventory = [
  { href: '/projects', name: 'Projects', action: 'Open toolkit', icon: Laptop, tone: 'tools' },
  { href: '/bar', name: 'House menu', action: 'Inspect bottle', icon: FlaskConical, tone: 'bottle' },
  { href: '/tarot', name: 'Tarot deck', action: 'Draw a card', icon: Layers3, tone: 'cards' },
] as const;

export default function CharacterPanel({ level }: CharacterPanelProps) {
  return (
    <aside className="character-panel" aria-label="Character profile and inventory">
      <div className="character-panel-chrome">
        <span className="character-panel-lights" aria-hidden="true"><i /><i /><i /></span>
        <span>~/character.json</span>
      </div>

      <div className="character-panel-body">
        <div className="character-panel-profile">
          <div className="character-panel-avatar-slot">
            <img src="/avatar.png" alt="Pixel portrait of yup.eng" width="72" height="72" />
          </div>
          <div className="character-panel-identity">
            <h2>yup.eng</h2>
            <p>Security engineer &amp; perpetual tinkerer</p>
            <div className="character-panel-experience">
              <strong>{String(level).padStart(2, '0')}</strong>
              <span>years of experience</span>
            </div>
          </div>
        </div>

        <section className="character-panel-paths" aria-labelledby="character-paths-heading">
          <h3 id="character-paths-heading" className="character-panel-label">skill_paths</h3>
          <ul>
            {skillPaths.map(({ name, description, icon: Icon, tone, primary }) => (
              <li key={name} className={`character-panel-path character-panel-path--${tone}`}>
                <span className="character-panel-path-icon"><Icon size={16} strokeWidth={1.7} aria-hidden="true" /></span>
                <span className="character-panel-path-name">
                  {name}
                  {primary && <span className="character-panel-path-specialization">Main spec</span>}
                </span>
                <span className="character-panel-path-description">{description}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="character-panel-inventory" aria-labelledby="character-inventory-heading">
          <div className="character-panel-inventory-heading">
            <h3 id="character-inventory-heading" className="character-panel-label">equipped_items</h3>
            <span>Pick one to explore</span>
          </div>
          <ul>
            {inventory.map(({ href, name, action, icon: Icon, tone }) => (
              <li key={href}>
                <Link to={href} className={`character-panel-item character-panel-item--${tone}`}>
                  <span className="character-panel-item-art" aria-hidden="true">
                    <Icon size={29} strokeWidth={1.6} />
                    <span className="character-panel-item-spark" />
                  </span>
                  <span className="character-panel-item-name">{name}</span>
                  <span className="character-panel-item-action">{action}<ArrowUpRight size={10} aria-hidden="true" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}
