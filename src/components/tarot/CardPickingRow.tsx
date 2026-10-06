import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { Check, RotateCw, Shuffle } from 'lucide-react';
import type { TableCard } from '@/lib/tarotReading';
import CardBack from './CardBack';
import './card-picking-row.css';

interface CardPickingRowProps {
  pool: TableCard[];
  pickedCount: number;
  shuffleCount: number;
  nextPosition: string;
  onPick: (cardId: string, halfTurn: boolean) => void;
  onShuffle: () => void;
}

const ROW_STEP = 104;
const TABLE_PADDING_Y = 32;

export default function CardPickingRow({ pool, pickedCount, shuffleCount, nextPosition, onPick, onShuffle }: CardPickingRowProps) {
  const orderedPool = [...pool].sort((a, b) => a.slot - b.slot);
  const occupiedSlots = pool.reduce((count, card) => Math.max(count, card.slot + 1), 0);
  const [slotCount, setSlotCount] = useState(occupiedSlots);
  const [isMoving, setIsMoving] = useState(false);
  const [shufflePhase, setShufflePhase] = useState<'idle' | 'out' | 'in'>('idle');
  const [liftedCard, setLiftedCard] = useState<TableCard | null>(null);
  const [previewTurns, setPreviewTurns] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);
  const [tableWidth, setTableWidth] = useState(336);
  const [announcement, setAnnouncement] = useState('');
  const table = useRef<HTMLOListElement>(null);
  const cardButtons = useRef(new Map<string, HTMLButtonElement>());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shuffleFrame = useRef<number | null>(null);
  const previewDialog = useRef<HTMLDialogElement>(null);
  const spinButton = useRef<HTMLButtonElement>(null);
  const commitGuard = useRef(false);
  const closingHandled = useRef(false);
  const mounted = useRef(true);
  const lastShuffleCount = useRef(shuffleCount);
  const pendingPicks = useRef(new Set<string>());
  const pointer = useRef<{ id: number; x: number; y: number; moved: boolean; active: boolean } | null>(null);
  const suppressClickUntil = useRef(0);
  const rovingCardId = pool.some((card) => card.cardId === focusedCardId) ? focusedCardId : orderedPool[0]?.cardId;
  const completed = pickedCount >= 10;
  const columns = Math.max(3, Math.min(13, Math.floor(tableWidth / 80)));
  const cellWidth = tableWidth / columns;
  const tableHeight = Math.ceil(Math.max(slotCount, occupiedSlots) / columns) * ROW_STEP + TABLE_PADDING_Y * 2;
  const previewAngle = (liftedCard?.angle || 0) + previewTurns * 180;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    mounted.current = true;
    const dialog = previewDialog.current;
    return () => {
      mounted.current = false;
      if (timer.current) clearTimeout(timer.current);
      if (shuffleFrame.current !== null) cancelAnimationFrame(shuffleFrame.current);
      if (dialog?.open) dialog.close();
    };
  }, []);

  useEffect(() => {
    const dialog = previewDialog.current;
    if (liftedCard && dialog && !dialog.open) {
      dialog.showModal();
      spinButton.current?.focus({ preventScroll: true });
    }
  }, [liftedCard]);

  useEffect(() => {
    if (lastShuffleCount.current !== shuffleCount) {
      lastShuffleCount.current = shuffleCount;
      setSlotCount(occupiedSlots);
    } else {
      // Preserve even trailing holes until the next shuffle.
      setSlotCount((previous) => Math.max(previous, occupiedSlots));
    }
  }, [shuffleCount, occupiedSlots]);

  useEffect(() => {
    for (const id of pendingPicks.current) {
      if (!pool.some((card) => card.cardId === id)) pendingPicks.current.delete(id);
    }
  }, [pool]);

  useEffect(() => {
    const measure = () => {
      if (table.current?.clientWidth) setTableWidth(table.current.clientWidth);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (table.current) observer.observe(table.current);
    return () => observer.disconnect();
  }, []);

  function focusCard(cardId: string, scrollIntoView: boolean) {
    const button = cardButtons.current.get(cardId);
    if (!button) return;
    setFocusedCardId(cardId);
    button.focus({ preventScroll: true });
    if (scrollIntoView) button.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  function keyboardBrowse(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.repeat && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      return;
    }
    let next = index;
    if (event.key === 'ArrowRight') next = Math.min(orderedPool.length - 1, index + 1);
    else if (event.key === 'ArrowLeft') next = Math.max(0, index - 1);
    else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const currentSlot = orderedPool[index].slot;
      const column = currentSlot % columns;
      const inColumn = orderedPool.filter((card) => card.slot % columns === column);
      const neighbour = event.key === 'ArrowDown'
        ? inColumn.find((card) => card.slot > currentSlot)
        : [...inColumn].reverse().find((card) => card.slot < currentSlot);
      if (neighbour) next = orderedPool.findIndex((card) => card.cardId === neighbour.cardId);
    }
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = orderedPool.length - 1;
    else return;
    event.preventDefault();
    const card = orderedPool[next];
    if (card) focusCard(card.cardId, true);
  }

  function pointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    suppressClickUntil.current = 0;
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false, active: true };
  }

  function pointerMove(event: PointerEvent<HTMLButtonElement>) {
    const gesture = pointer.current;
    if (!gesture?.active || gesture.id !== event.pointerId) return;
    if (Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 8) gesture.moved = true;
  }

  function pointerEnd(event: PointerEvent<HTMLButtonElement>, cancelled = false) {
    const gesture = pointer.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    gesture.moved ||= cancelled || Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 8;
    gesture.active = false;
    if (gesture.moved) suppressClickUntil.current = Date.now() + 500;
  }

  function liftCard(event: MouseEvent<HTMLButtonElement>, card: TableCard) {
    if (isMoving || completed || liftedCard || pendingPicks.current.has(card.cardId)) return;
    if (event.detail !== 0 && (pointer.current?.moved || Date.now() < suppressClickUntil.current)) {
      event.preventDefault();
      return;
    }
    commitGuard.current = false;
    closingHandled.current = false;
    setPreviewTurns(0);
    setLiftedCard(card);
  }

  function putBack() {
    const cardId = liftedCard?.cardId;
    closingHandled.current = true;
    if (previewDialog.current?.open) previewDialog.current.close();
    setLiftedCard(null);
    setPreviewTurns(0);
    if (cardId) requestAnimationFrame(() => {
      if (mounted.current) focusCard(cardId, false);
    });
  }

  function commitCard() {
    if (!liftedCard || commitGuard.current || completed || !pool.some((card) => card.cardId === liftedCard.cardId)) return;
    commitGuard.current = true;
    pendingPicks.current.add(liftedCard.cardId);
    const index = orderedPool.findIndex((card) => card.cardId === liftedCard.cardId);
    const nextCard = orderedPool[index + 1] || orderedPool[index - 1];
    if (nextCard) setFocusedCardId(nextCard.cardId);
    closingHandled.current = true;
    if (previewDialog.current?.open) previewDialog.current.close();
    onPick(liftedCard.cardId, Boolean(previewTurns % 2));
    setLiftedCard(null);
    setPreviewTurns(0);
    setAnnouncement(`Card chosen for ${nextPosition}. ${Math.min(10, pickedCount + 1)} of 10 selected.`);
    if (nextCard && pickedCount < 9) {
      requestAnimationFrame(() => {
        if (mounted.current) focusCard(nextCard.cardId, true);
      });
    }
  }

  function shuffle() {
    if (isMoving || liftedCard || completed || pool.length < 2) return;
    if (reducedMotion) {
      onShuffle();
      setAnnouncement('You can choose a face-down card now.');
      return;
    }
    setIsMoving(true);
    setShufflePhase('out');
    setAnnouncement('Mixing the cards. Wait a moment before choosing.');
    timer.current = setTimeout(() => {
      onShuffle();
      shuffleFrame.current = requestAnimationFrame(() => {
        shuffleFrame.current = requestAnimationFrame(() => {
          setShufflePhase('in');
          timer.current = setTimeout(() => {
            setShufflePhase('idle');
            setIsMoving(false);
            setAnnouncement('You can choose a face-down card now.');
          }, 300);
        });
      });
    }, 200);
  }

  return (
    <section className={`card-picking-row${isMoving ? ' card-picking-row--mixing' : ''} card-picking-row--fade-${shufflePhase}`} aria-labelledby="card-picking-title">
      <header className="card-picking-row__header">
        <div>
          <span className="card-picking-row__eyebrow">Take your pick</span>
          <h2 id="card-picking-title">{pool.length} cards on the table.</h2>
          <p><strong>{pickedCount} / 10 chosen</strong><span aria-hidden="true"> · </span>{completed ? 'Your spread is ready.' : <>Next: <span>{nextPosition}</span></>}</p>
        </div>
        <button className="card-picking-row__shuffle" onClick={shuffle} disabled={isMoving || completed || pool.length < 2}>
          <Shuffle size={15} aria-hidden="true" />{isMoving ? 'Mixing the cards…' : 'Shuffle the cards'}
        </button>
      </header>
      <p className="card-picking-row__hint" id="card-picking-hint">Lift a card, turn it if you like, then choose or put it back.</p>
        <ol ref={table} className="card-picking-row__table" style={{ height: tableHeight }} aria-busy={isMoving} aria-label={`${pool.length} face-down cards available to choose`}>
          {orderedPool.map((card, index) => {
            const style = {
              left: (card.slot % columns + 0.5) * cellWidth - 24,
              top: TABLE_PADDING_Y + (Math.floor(card.slot / columns) + 0.5) * ROW_STEP - 36,
              '--card-angle': `${card.angle}deg`,
              '--jitter-x': `${card.offsetX}px`,
              '--jitter-y': `${card.offsetY}px`,
              '--card-layer': index + 1,
            } as CSSProperties;
            return (
              <li key={card.cardId} className="card-picking-row__slot" style={style}>
                <button
                  ref={(element) => { if (element) cardButtons.current.set(card.cardId, element); else cardButtons.current.delete(card.cardId); }}
                  className="card-picking-row__card"
                  disabled={isMoving || completed}
                  tabIndex={card.cardId === rovingCardId ? 0 : -1}
                  aria-label={`Lift face-down card at table position ${card.slot + 1} for ${nextPosition}`}
                  aria-haspopup="dialog"
                  aria-describedby="card-picking-keyboard"
                  onFocus={() => setFocusedCardId(card.cardId)}
                  onKeyDown={(event) => keyboardBrowse(event, index)}
                  onPointerDown={pointerDown}
                  onPointerMove={pointerMove}
                  onPointerUp={(event) => pointerEnd(event)}
                  onPointerCancel={(event) => pointerEnd(event, true)}
                  onClick={(event) => liftCard(event, card)}
                >
                  <CardBack />
                </button>
              </li>
            );
          })}
        </ol>
      <p id="card-picking-keyboard" className="sr-only">Use the arrow keys to move between cards, Home or End to reach either end, and Enter or Space to lift a card for a closer look. Up and down follow the same column, skipping spaces where cards were picked.</p>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
      <dialog
        ref={previewDialog}
        className="card-picking-preview"
        aria-labelledby="card-picking-preview-title"
        aria-describedby="card-picking-preview-description"
        onCancel={(event) => { event.preventDefault(); putBack(); }}
        onClose={() => {
          if (!mounted.current || previewDialog.current?.open) return;
          if (closingHandled.current) { closingHandled.current = false; return; }
          if (liftedCard) putBack();
        }}
        onKeyDownCapture={(event) => {
          if (event.repeat && (event.key === 'Enter' || event.key === ' ')) event.preventDefault();
        }}
      >
        {liftedCard && <>
          <span className="card-picking-row__eyebrow">For {nextPosition}</span>
          <h2 id="card-picking-preview-title">Before you choose.</h2>
          <p id="card-picking-preview-description">Turn it if you like. Its face stays hidden.</p>
          <div className="card-picking-preview__stage">
            <div className="card-picking-preview__back" style={{ transform: `rotate(${previewAngle}deg)` }}>
              <CardBack label="Face-down tarot card. Its identity is hidden." />
            </div>
          </div>
          <div className="card-picking-preview__actions">
            <button type="button" ref={spinButton} onClick={() => setPreviewTurns((turns) => turns + 1)}><RotateCw size={16} aria-hidden="true" />Spin 180°</button>
            <button type="button" className="card-picking-preview__choose" onClick={commitCard}><Check size={16} aria-hidden="true" />Choose card</button>
            <button type="button" onClick={putBack}>Put it back</button>
          </div>
        </>}
      </dialog>
    </section>
  );
}
