/**
 * OffSec certification marks, lifted from the official Credly badge artwork:
 * the Kali dragon (OSCP), the spider (OSWE) and the chains (OSEP).
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
