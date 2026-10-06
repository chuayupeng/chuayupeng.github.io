import type { TarotCardData } from '@/data/tarotData';

interface TarotCardProps {
  card: TarotCardData;
  decorative?: boolean;
  loading?: 'eager' | 'lazy';
}

export default function TarotCard({ card, decorative = false, loading = 'eager' }: TarotCardProps) {
  return (
    <figure className="tarot-card" aria-hidden={decorative || undefined}>
      <div className="tarot-card__image">
        <img src={card.image} alt={decorative ? '' : card.imageAlt} width="1024" height="1536" loading={loading} decoding="async" />
      </div>
      {!decorative && (
        <figcaption className="tarot-card__caption">
          {card.canonical.numeral} — {card.canonical.name}
        </figcaption>
      )}
    </figure>
  );
}
