import { useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, Layers3, Shuffle, Sparkles, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Link } from 'react-router-dom';
import { tarotSuitThemes, type TarotCardData } from '@/data/tarotData';
import { majorArcanaCards } from '@/data/majorArcanaData';
import { minorArcanaCollections } from '@/data/minorArcanaData';
import TarotCard from './TarotCard';
import './tarot.css';

export default function MixologistsDeck() {
  const [selectedCollectionId, setSelectedCollectionId] = useState('major');
  const [previewCardIds, setPreviewCardIds] = useState<string[] | null>(null);
  const [selectedCard, setSelectedCard] = useState<TarotCardData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const previousDraw = useRef<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const collections = [
    {
      id: 'major',
      title: 'Major Arcana',
      subtitle: 'Familiar archetypes. A Greek cast. A suspiciously well-stocked bar.',
      cards: majorArcanaCards,
    },
    ...minorArcanaCollections.filter((collection) => collection.cards.length > 0),
  ];
  const collection = collections.find((item) => item.id === selectedCollectionId) || collections[0];
  const cards = previewCardIds
    ? previewCardIds.map((id) => collection.cards.find((card) => card.canonical.id === id)).filter((card): card is TarotCardData => Boolean(card))
    : collection.cards.slice(0, 3);
  const selectedIndex = collection.cards.findIndex((card) => card.canonical.id === selectedCard?.canonical.id);

  function selectCollection(id: string) {
    if (id === collection.id) return;
    const nextCollection = collections.find((item) => item.id === id);
    if (!nextCollection) return;
    setSelectedCollectionId(id);
    setPreviewCardIds(null);
    setSelectedCard(null);
    setIsOpen(false);
    previousDraw.current = null;
    triggerRef.current = null;
    setAnnouncement(`Showing ${nextCollection.title}, ${nextCollection.cards.length} cards.`);
  }

  function inspectCard(card: TarotCardData, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setSelectedCard(card);
    setIsOpen(true);
  }

  function drawCard(trigger: HTMLButtonElement) {
    const candidates = collection.cards.filter((card) => card.canonical.id !== previousDraw.current);
    const drawPool = candidates.length ? candidates : collection.cards;
    const card = drawPool[Math.floor(Math.random() * drawPool.length)];
    if (!card) return;
    previousDraw.current = card.canonical.id;
    inspectCard(card, trigger);
  }

  function shuffleCards() {
    // Fisher–Yates, with a rotation when chance returns the current order.
    const nextCards = [...collection.cards];
    for (let i = nextCards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [nextCards[i], nextCards[j]] = [nextCards[j], nextCards[i]];
    }
    if (nextCards.length > 1 && nextCards.slice(0, 3).every((card, index) => card.canonical.id === cards[index]?.canonical.id)) {
      nextCards.push(nextCards.shift()!);
    }
    setPreviewCardIds(nextCards.slice(0, 3).map((card) => card.canonical.id));
    setShuffleCount((count) => count + 1);
    setAnnouncement(`Shuffled. On the table, from left to right: ${nextCards.slice(0, 3).map((card) => card.canonical.name).join(', ')}.`);
  }

  function browseCard(direction: -1 | 1) {
    if (!collection.cards.length) return;
    const nextIndex = (selectedIndex + direction + collection.cards.length) % collection.cards.length;
    setSelectedCard(collection.cards[nextIndex]);
  }

  return (
    <section className="mixologist-deck" aria-labelledby="mixologist-title">
      <div className="mixologist-deck__chrome">
        <div className="mixologist-deck__file"><Layers3 size={14} aria-hidden="true" /><span>~/inventory/mixologists-deck</span></div>
        <span className="mixologist-deck__item-type">Optional quest item</span>
      </div>

      {collections.length > 1 && (
        <div className="tarot-collection-selector" role="group" aria-label="Choose a tarot collection">
          {collections.map((item) => (
            <button
              key={item.id}
              aria-pressed={item.id === collection.id}
              aria-controls="tarot-collection"
              onClick={() => selectCollection(item.id)}
            >
              {item.title}<span aria-hidden="true">{item.cards.length}</span><span className="sr-only">{item.cards.length} cards</span>
            </button>
          ))}
        </div>
      )}

      <div className="mixologist-deck__body">
        <div className="mixologist-deck__intro">
          <span className="mixologist-deck__eyebrow">From the other side of the bar</span>
          <h1 id="mixologist-title">The mixologist’s<br />{' '}<em>deck.</em></h1>
          <p>A few gods. A few good ingredients. Something to do with my hands while the build runs.</p>
          <p className="mixologist-deck__aside">Pick a card. The future is still your problem.</p>

          <div className="mixologist-deck__actions">
            <button className="mixologist-deck__draw" aria-haspopup="dialog" onClick={(event) => drawCard(event.currentTarget)}>
              <Sparkles size={16} aria-hidden="true" />Draw a card
            </button>
            <button className="mixologist-deck__shuffle" onClick={shuffleCards}>
              <Shuffle size={16} aria-hidden="true" />Shuffle
            </button>
          </div>
          <span className="mixologist-deck__count">{collection.cards.length} cards in {collection.title} · tap any card to inspect</span>
          <a className="mixologist-deck__collection-link" href="#tarot-collection">View this collection<ArrowDown size={13} aria-hidden="true" /></a>
        </div>

        <div className="mixologist-deck__table" aria-label={`A three-card preview of ${collection.title}`}>
          <div className="mixologist-deck__table-orbit" aria-hidden="true" />
          <div className="mixologist-deck__table-mark" aria-hidden="true">✧</div>
          <div className="mixologist-deck__fan" key={`${collection.id}-${shuffleCount}`}>
            {cards.slice(0, 3).map((card, index) => (
              <button
                key={card.canonical.id}
                className={`mixologist-deck__card-button mixologist-deck__card-button--${index}`}
                aria-label={`Inspect ${card.canonical.numeral} — ${card.canonical.name}, ${card.canonical.arcana} arcana`}
                aria-haspopup="dialog"
                onClick={(event) => inspectCard(card, event.currentTarget)}
              >
                <TarotCard card={card} decorative />
              </button>
            ))}
          </div>
          <div className="mixologist-deck__table-note"><span aria-hidden="true">✦</span> A glimpse of {collection.title} <span aria-hidden="true">✦</span></div>
        </div>
      </div>

      <section className="tarot-collection" id="tarot-collection" aria-labelledby="tarot-collection-title">
        <div className="tarot-collection__heading">
          <div>
            <span className="mixologist-deck__eyebrow">The collection</span>
            <h2 id="tarot-collection-title">{collection.title}</h2>
            <p>{collection.subtitle}</p>
          </div>
          <span className="tarot-collection__total">{collection.cards.length} cards</span>
        </div>
        <ol className="tarot-collection__grid" aria-label={`${collection.title} in traditional order`}>
          {collection.cards.map((card) => (
            <li key={card.canonical.id}>
              <button
                className="tarot-collection__card"
                aria-label={`Inspect ${card.canonical.numeral} — ${card.canonical.name}, ${card.canonical.arcana} arcana${card.theme.cast ? `, portrayed by ${card.theme.cast.name}` : ''}`}
                aria-haspopup="dialog"
                onClick={(event) => inspectCard(card, event.currentTarget)}
              >
                <TarotCard card={card} decorative loading="lazy" />
                <span className="tarot-collection__caption" aria-hidden="true">
                  <span className="tarot-collection__numeral">{card.canonical.numeral}</span>
                  <span className="tarot-collection__name">{card.canonical.name}</span>
                  <span className="tarot-collection__cast">{card.theme.cast?.name || card.theme.ingredientFamily}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <div className="mixologist-deck__suit-key" aria-labelledby="deck-suit-themes">
        <p id="deck-suit-themes">Our ingredient themes <span>→ traditional suits</span></p>
        <dl>
          {tarotSuitThemes.map((mapping) => (
            <div key={mapping.suit}>
              <dt>{mapping.ingredientLabel}</dt>
              <dd><span aria-hidden="true">→ </span>{mapping.suitLabel}<small>{mapping.motif}</small></dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mixologist-deck__footer">
        <div className="mixologist-deck__back" aria-hidden="true"><span>✦</span></div>
        <p>There’s a bartender in the character sheet, too.<br /><span>La Maison Du Whisky · Moonshots · WhiteHatOne</span></p>
        <Link to="/timeline">Find the side quests<ArrowRight size={15} aria-hidden="true" /></Link>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="tarot-dialog-overlay" />
          <Dialog.Content
            className="tarot-dialog"
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              closeButtonRef.current?.focus({ preventScroll: true });
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              if (triggerRef.current?.isConnected) triggerRef.current.focus({ preventScroll: true });
            }}
          >
            {selectedCard && (
              <>
                <div className="tarot-dialog__art"><TarotCard card={selectedCard} /></div>
                <div className="tarot-dialog__copy">
                  <span className="mixologist-deck__eyebrow">{selectedCard.canonical.arcana} arcana · {selectedCard.canonical.arcana === 'minor' ? selectedCard.canonical.suit : `No. ${selectedCard.canonical.number}`}</span>
                  <Dialog.Title className="tarot-dialog__title">{selectedCard.canonical.numeral} — {selectedCard.canonical.name}</Dialog.Title>
                  <p className="tarot-dialog__theme">{selectedCard.theme.cast ? `${selectedCard.theme.cast.tradition} · ${selectedCard.theme.cast.name}` : `Our ingredient theme: ${selectedCard.theme.ingredientFamily}`}</p>
                  <Dialog.Description className="tarot-dialog__description">{selectedCard.description}</Dialog.Description>
                  <ul className="tarot-dialog__ingredients" aria-label="Card motifs">
                    {selectedCard.theme.motifs.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}
                  </ul>
                  <div className="tarot-dialog__connection">
                    <span className="tarot-dialog__label">Back in the real world</span>
                    <p>{selectedCard.connection}</p>
                    <Link to={selectedCard.href}>{selectedCard.linkLabel}<ArrowRight size={15} aria-hidden="true" /></Link>
                  </div>
                  <nav className="tarot-dialog__navigation" aria-label={`Browse ${collection.title}`}>
                    <button onClick={() => browseCard(-1)} aria-label={`Inspect previous card in ${collection.title}`}><ChevronLeft size={17} aria-hidden="true" />Previous</button>
                    <span aria-live="polite"><span className="sr-only">{selectedCard.canonical.name}, card </span>{selectedIndex + 1} / {collection.cards.length}</span>
                    <button onClick={() => browseCard(1)} aria-label={`Inspect next card in ${collection.title}`}>Next<ChevronRight size={17} aria-hidden="true" /></button>
                  </nav>
                </div>
              </>
            )}
            <Dialog.Close ref={closeButtonRef} className="tarot-dialog__close" aria-label="Close card details"><X size={20} /></Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
