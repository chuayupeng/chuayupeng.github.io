/**
 * OffSec certification marks, lifted from the official badge artwork: the Kali
 * dragon (OSCP), the spider (OSWE), the chains (OSEP) and the wolf (OSAI).
 *
 * The glyphs are white line art on transparency, so they're painted as a CSS
 * mask over `currentColor` — that keeps each card's accent colour working the
 * same way it does for the lucide icons alongside them.
 */

interface GlyphProps {
  /** rendered size in px; line art needs a little more room than a solid icon */
  size?: number;
  className?: string;
}

const glyph = (src: string, label: string) => {
  const Glyph = ({ size = 28, className }: GlyphProps) => (
    <span
      role="img"
      aria-label={label}
      className={`inline-block bg-current ${className ?? ''}`}
      style={{
        width: size,
        height: size,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  );
  Glyph.displayName = label;
  return Glyph;
};

export const KaliDragonIcon = glyph('/certs/oscp-glyph.png', 'Kali dragon');
export const SpiderIcon = glyph('/certs/oswe-glyph.png', 'Spider');
export const ChainsIcon = glyph('/certs/osep-glyph.png', 'Chains');
export const WolfIcon = glyph('/certs/osai-glyph.svg', 'Howling wolf');

/**
 * Lucide draws stroke-width 2 in a 24-unit box — roughly 8% of the icon's
 * width, against about 2% for the OffSec badge line art. Measured as ink
 * coverage at 64px, a default lucide mark lands near 35% against 11-16% for
 * the glyphs, so it reads as glowing next to them. 0.75 brings it to ~13%.
 */
export const lineIcon = (Icon: any, label?: string) => {
  const Wrapped = ({ size = 28, className }: GlyphProps) => (
    <Icon size={size} strokeWidth={0.75} className={className} aria-hidden="true" />
  );
  Wrapped.displayName = label ?? 'LineIcon';
  return Wrapped;
};
