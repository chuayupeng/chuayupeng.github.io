import './card-back.css';

interface CardBackProps {
  label?: string;
}

export default function CardBack({ label }: CardBackProps) {
  return (
    <span className="tarot-card-back" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {/* Repeating one half makes the back identical after a half-turn. */}
      <img className="tarot-card-back__half" src="/art/tarot/card-back-v1.webp" alt="" width="1024" height="1536" draggable={false} />
      <img className="tarot-card-back__half tarot-card-back__half--opposite" src="/art/tarot/card-back-v1.webp" alt="" width="1024" height="1536" draggable={false} />
    </span>
  );
}
