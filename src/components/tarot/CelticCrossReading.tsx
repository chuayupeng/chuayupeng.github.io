import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Check, Copy, Download, Shuffle, Sparkles } from 'lucide-react';
import { majorArcanaCards } from '@/data/majorArcanaData';
import { minorArcanaCollections } from '@/data/minorArcanaData';
import { celticCrossPositions, celticCrossSource } from '@/data/celticCross';
import { tarotReadingMeanings } from '@/data/tarotReadingMeanings';
import { createReading, parseSavedReading, pickReadingCard, shuffleReadingPool, revealReadingCard, STORAGE_KEY, type TarotReading } from '@/lib/tarotReading';
import CardPickingRow from './CardPickingRow';
import CardBack from './CardBack';
import { buildTarotPrompt } from '@/lib/tarotPrompt';
import './celtic-cross.css';

const fullDeck = [...majorArcanaCards, ...minorArcanaCollections.flatMap((suit) => suit.cards)];
const cardById = new Map(fullDeck.map((card) => [card.canonical.id, card]));
const cardIds = fullDeck.map((card) => card.canonical.id);

function restoreReading() {
  try { return parseSavedReading(localStorage.getItem(STORAGE_KEY), cardIds); }
  catch { return null; }
}

export default function CelticCrossReading() {
  const [reading, setReading] = useState<TarotReading | null>(restoreReading);
  const lastSaved = useRef(reading ? JSON.stringify(reading) : null);
  const [question, setQuestion] = useState(reading?.question || '');
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, reading?.cards.findIndex((card) => !card.revealed) ?? 0));
  const [saveFailed, setSaveFailed] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const focusHeading = useRef<HTMLHeadingElement>(null);
  const newQuestion = useRef<HTMLTextAreaElement>(null);
  const spreadTable = useRef<HTMLDivElement>(null);
  const pickingTable = useRef<HTMLDivElement>(null);
  const promptField = useRef<HTMLTextAreaElement>(null);
  const current = reading?.cards[activeIndex];
  const activeCard = current ? cardById.get(current.cardId) : null;
  const position = celticCrossPositions[activeIndex];
  const meaning = activeCard ? tarotReadingMeanings[activeCard.canonical.id] : null;
  const revealedCount = reading?.cards.filter((card) => card.revealed).length || 0;
  const pickedCount = reading?.cards.length || 0;
  const allPicked = pickedCount === 10;
  const complete = revealedCount === 10;
  const nextIndex = reading?.cards.findIndex((card, index) => !card.revealed && index > activeIndex) ?? -1;
  const nextHidden = nextIndex >= 0 ? nextIndex : reading?.cards.findIndex((card) => !card.revealed) ?? -1;
  const readingPrompt = complete && reading ? buildTarotPrompt(reading.question, reading.cards.map((draw, index) => ({
    position: celticCrossPositions[index].name,
    cardName: cardById.get(draw.cardId)!.canonical.name,
    orientation: draw.orientation,
  }))) : '';

  useEffect(() => {
    if (!reading) return;
    const serialized = JSON.stringify(reading);
    if (serialized === lastSaved.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, serialized);
      lastSaved.current = serialized;
      setSaveFailed(false);
    } catch { setSaveFailed(true); }
  }, [reading]);

  function focusInspector() {
    requestAnimationFrame(() => {
      focusHeading.current?.focus({ preventScroll: true });
      focusHeading.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
    });
  }

  function deal(event: React.FormEvent) {
    event.preventDefault();
    try {
      setReading(createReading(cardIds, question.trim()));
      setActiveIndex(0);
      setError('');
      setCopyStatus('idle');
      setAnnouncement('All 78 cards are face-down on the table. Choose any ten, one at a time.');
      requestAnimationFrame(() => {
        pickingTable.current?.focus({ preventScroll: true });
        pickingTable.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
      });
    } catch { setError('The deck could not be shuffled. Please try again.'); }
  }

  function resetReading() {
    setQuestion(reading?.question || '');
    setReading(null);
    setActiveIndex(0);
    setCopyStatus('idle');
    setError('');
    lastSaved.current = null;
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSaveFailed(false);
    } catch { setSaveFailed(true); }
    setAnnouncement('The previous reading is cleared. Start again with all 78 cards.');
    requestAnimationFrame(() => {
      newQuestion.current?.focus({ preventScroll: true });
      newQuestion.current?.scrollIntoView({ block: 'center', behavior: 'auto' });
    });
  }

  function selectPosition(index: number, focus = false) {
    setActiveIndex(index);
    if (focus) focusInspector();
  }

  function pick(cardId: string, halfTurn: boolean) {
    if (!reading || allPicked) return;
    const chosen = reading.pool.find((card) => card.cardId === cardId);
    if (!chosen) return;
    const index = pickedCount;
    setReading((previous) => previous && pickReadingCard(previous, cardId, halfTurn));
    setActiveIndex(index === 9 ? 0 : index);
    setAnnouncement(`Card ${index + 1} chosen for ${celticCrossPositions[index].name}. ${index + 1} of 10 chosen.${index === 9 ? ' Your spread is ready to reveal.' : ''}`);
    if (index === 9) requestAnimationFrame(() => {
      spreadTable.current?.focus({ preventScroll: true });
      spreadTable.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
    });
  }

  function shufflePool() {
    if (!reading || allPicked) return;
    try {
      setReading(shuffleReadingPool(reading));
      setError('');
      setAnnouncement(`Shuffling the ${reading.pool.length} cards still on the table. Your ${pickedCount} chosen cards stay in place.`);
    } catch {
      setError('The cards could not be shuffled. Your chosen cards are still here; try again.');
    }
  }

  function reveal() {
    if (!allPicked || !current || !activeCard || current.revealed) return;
    setReading((previous) => previous && revealReadingCard(previous, activeIndex));
    setAnnouncement(`${activeIndex + 1}. ${position.name}: ${activeCard.canonical.name}, ${current.orientation}. ${revealedCount + 1} of 10 cards revealed.`);
    focusInspector();
  }

  function revealAll() {
    if (!allPicked || complete) return;
    setReading((previous) => previous?.cards.length === 10
      ? previous.cards.reduce((next, _, index) => revealReadingCard(next, index), previous)
      : previous);
    setAnnouncement('All ten cards revealed. Their chosen positions and orientations are unchanged.');
    requestAnimationFrame(() => {
      spreadTable.current?.focus({ preventScroll: true });
      spreadTable.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
    });
  }

  function download() {
    if (!reading || !complete) return;
    const lines = [
      'THE MIXOLOGIST’S DECK — CELTIC CROSS',
      new Date(reading.createdAt).toLocaleString(),
      `Question: ${reading.question || 'An open reading'}`, '',
      ...reading.cards.flatMap((draw, index) => {
        const card = cardById.get(draw.cardId)!;
        const cue = tarotReadingMeanings[draw.cardId];
        return [
          `${index + 1}. ${celticCrossPositions[index].name}`,
          `${card.canonical.name} — ${draw.orientation}`,
          celticCrossPositions[index].description,
          cue[draw.orientation], cue.reflection, '',
        ];
      }),
      'Reading cues are invitations to reflect, not fixed predictions.',
      `Spread adapted from A. E. Waite: ${celticCrossSource}`,
    ];
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `celtic-cross-${reading.createdAt.slice(0, 10)}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setAnnouncement('Your reading has been downloaded as a text file.');
  }

  async function copyPrompt() {
    if (!readingPrompt) return;
    try {
      await navigator.clipboard.writeText(readingPrompt);
      setCopyStatus('copied');
    } catch {
      promptField.current?.focus();
      promptField.current?.select();
      setCopyStatus('failed');
    }
  }

  return (
    <section className="celtic-reading" aria-labelledby="celtic-title">
      <div className="celtic-reading__chrome"><span>~/inventory/mixologists-deck/reading</span><span>78 cards · 10 positions</span></div>
      <header className="celtic-reading__header">
        <div>
          <span className="celtic-reading__eyebrow">A seat at the table</span>
          <h1 id="celtic-title">The Celtic <em>Cross.</em></h1>
          <p>Bring a question. The cards have opinions.</p>
        </div>
        {reading && <div className="celtic-reading__tools">
          {complete && <button className="reading-button" onClick={download}><Download size={15} />Save reading</button>}
          <button className="reading-button reading-button--quiet" onClick={resetReading}><Shuffle size={15} />New reading</button>
        </div>}
      </header>

      {!reading && (
        <form className="celtic-reading__setup" onSubmit={deal}>
          <div className="celtic-reading__setup-copy">
            <span className="celtic-reading__eyebrow">Shuffle. Choose. Reveal.</span>
            <h2>A little ritual. No velvet cape required.</h2>
            <p>All 78 cards, face-down across the table. Choose the ten that catch your eye, in whatever order feels right.</p>
            <p className="celtic-reading__small">Lift a card, turn it if you like, then choose or put it back. Choose all ten before revealing them.</p>
          </div>
          <div className="celtic-reading__setup-form">
            <label htmlFor="reading-question">What’s on your mind? <span>(optional)</span></label>
            <textarea ref={newQuestion} id="reading-question" value={question} maxLength={500} onChange={(event) => setQuestion(event.target.value)} placeholder="What could I understand more clearly about…" rows={3} />
            <div className="celtic-reading__setup-actions">
              <button className="reading-button reading-button--gold" type="submit"><Sparkles size={16} />Spread the deck</button>
            </div>
            <p className="celtic-reading__small">Your question and spread stay in this browser.</p>
            {saveFailed && <p role="status">The saved reading could not be cleared from browser storage. Your next spread will replace it when saving is available.</p>}
            {error && <p role="alert">{error}</p>}
          </div>
        </form>
      )}

      {reading && (
        <>
          <div className="celtic-reading__progress">
            <div><span className="celtic-reading__eyebrow">{complete ? 'The whole table is open' : allPicked ? 'Your ten, ready to reveal' : 'Choose your ten'}</span><p>{reading.question || 'An open reading. Let’s see what turns up.'}</p></div>
            <span className="celtic-reading__count">{pickedCount} / 10 chosen · {revealedCount} revealed</span>
            <progress value={pickedCount + revealedCount} max={20} aria-label="Cards chosen and revealed" />
          </div>

          {!allPicked && <div id="picking-table" className="celtic-reading__picking" tabIndex={-1} ref={pickingTable}>
            <CardPickingRow key={reading.createdAt} pool={reading.pool} pickedCount={pickedCount} shuffleCount={reading.shuffleCount} nextPosition={celticCrossPositions[pickedCount].name} onPick={pick} onShuffle={shufflePool} />
            {error && <p className="celtic-reading__pick-error" role="alert">{error}</p>}
          </div>}

          <div className="celtic-reading__workspace">
            <div className="celtic-reading__table-column">
              <div className="celtic-table" id="celtic-spread" role="group" aria-label="Celtic Cross spread" tabIndex={-1} ref={spreadTable}>
                <div className="celtic-table__orbit" aria-hidden="true" />
                <span className="celtic-table__mark" aria-hidden="true">✧</span>
                {celticCrossPositions.map((_, index) => {
                  const draw = reading.cards[index];
                  const card = draw ? cardById.get(draw.cardId) : null;
                  const name = celticCrossPositions[index].name;
                  return (
                    <div key={index} className={`celtic-slot celtic-slot--${index + 1}${activeIndex === index ? ' celtic-slot--active' : ''}`}>
                      <button
                        className={`celtic-slot__card${!draw ? ' celtic-slot__card--empty' : ''}`}
                        disabled={!draw}
                        aria-pressed={!!draw && activeIndex === index}
                        aria-label={`${index + 1}. ${name}: ${!draw ? 'waiting for your pick' : draw.revealed ? `${card!.canonical.name}, ${draw.orientation}` : 'chosen, face-down'}`}
                        aria-controls="reading-inspector"
                        onClick={() => selectPosition(index, true)}
                      >
                        {draw ? <span className={`celtic-card-art${draw.revealed && draw.orientation === 'reversed' ? ' celtic-card-art--reversed' : ''}`}>
                          {draw.revealed ? <img src={card!.image} alt="" width="1024" height="1536" /> : <CardBack />}
                        </span> : <span className="celtic-slot__waiting" aria-hidden="true">✧</span>}
                      </button>
                      <span className="celtic-slot__number" aria-hidden="true">{index + 1}{draw?.revealed && draw.orientation === 'reversed' ? ' ↓' : ''}</span>
                      <span className="celtic-slot__label" aria-hidden="true">{celticCrossPositions[index].short}</span>
                    </div>
                  );
                })}
              </div>
              <p className="celtic-reading__table-hint">{complete ? 'Select any card to revisit its place in the reading.' : allPicked ? 'Ten cards you chose. Select a position and reveal when ready.' : 'Your picks fill these positions in the order you choose them.'}</p>
              <nav className="celtic-position-nav" aria-label="Reading positions">
                {celticCrossPositions.map((entry, index) => <button key={index} disabled={!reading.cards[index]} aria-pressed={!!reading.cards[index] && activeIndex === index} aria-label={`Inspect position ${index + 1}: ${entry.name}${reading.cards[index]?.revealed ? ', revealed' : reading.cards[index] ? ', chosen face-down' : ', not chosen yet'}`} onClick={() => selectPosition(index, true)}><span>{index + 1}</span>{reading.cards[index]?.revealed && <Check size={10} aria-hidden="true" />}</button>)}
              </nav>
            </div>

            <section className="celtic-inspector" id="reading-inspector" aria-labelledby="reading-position-title">
              {current && activeCard ? <>
              <span className="celtic-reading__eyebrow">Position {activeIndex + 1} of 10</span>
              <h2 id="reading-position-title" tabIndex={-1} ref={focusHeading}>{position.name}</h2>
              <p className="celtic-inspector__position">{position.description}</p>
              <div className="celtic-inspector__card">
                <div key={activeIndex} className={`celtic-card-art${current.revealed && current.orientation === 'reversed' ? ' celtic-card-art--reversed' : ''}`}>
                  {current.revealed ? <img src={activeCard.image} alt={`${activeCard.canonical.name}, ${current.orientation}`} width="1024" height="1536" /> : <CardBack label="Face-down card. Its identity is hidden." />}
                </div>
              </div>
              {current.revealed && <span className={`celtic-inspector__orientation${current.orientation === 'reversed' ? ' celtic-inspector__orientation--reversed' : ''}`}><ArrowDown size={12} style={{ transform: current.orientation === 'upright' ? 'rotate(180deg)' : undefined }} aria-hidden="true" />{current.orientation}<span>· set by your pick</span></span>}

              {!current.revealed ? (
                <div className="celtic-inspector__concealed">
                  <p>Face-down for now. You’ll find out what you chose when you turn it over.</p>
                  {allPicked ? <button className="reading-button reading-button--gold" onClick={reveal}><Sparkles size={16} />Reveal card {activeIndex + 1}</button> : <a className="reading-button reading-button--gold" href="#picking-table">Choose the next card <ArrowRight size={15} /></a>}
                  {activeIndex === 1 && <small>This card lies sideways across the first card in the spread.</small>}
                </div>
              ) : (
                <div className="celtic-inspector__revealed">
                  <h3>{activeCard.canonical.name}</h3>
                  <span className="celtic-reading__small">{activeCard.theme.cast?.name || activeCard.theme.ingredientFamily}</span>
                  <p>{meaning?.[current.orientation]}</p>
                  <blockquote>{meaning?.reflection}</blockquote>
                  <details><summary>The artwork & its symbols</summary><p>{activeCard.description}</p><p>{activeCard.theme.motifs.join(' · ')}</p></details>
                  {!complete && nextHidden >= 0 && <button className="reading-button reading-button--gold" onClick={() => selectPosition(nextHidden, true)}>Next face-down card <ArrowRight size={15} /></button>}
                  {complete && <p className="celtic-inspector__complete"><Check size={14} />All ten revealed. The pattern is yours to read.</p>}
                </div>
              )}
              {allPicked && !complete && <button className="reading-button reading-button--quiet celtic-inspector__reveal-all" onClick={revealAll}><Sparkles size={15} />Reveal all cards</button>}
              <a className="celtic-inspector__table-link" href="#celtic-spread">Back to the spread ↑</a>
              </> : <div className="celtic-inspector__waiting">
                <span className="celtic-reading__eyebrow">The table is yours</span>
                <h2 id="reading-position-title" tabIndex={-1} ref={focusHeading}>Which one catches your eye?</h2>
                <p>Lift a card from the table. You can spin it 180° before choosing it, or put it back and try another.</p>
                <p>Choose all ten before turning them over. There’s no sneak peek.</p>
                <a className="reading-button reading-button--gold" href="#picking-table">Choose a card <ArrowRight size={15} /></a>
              </div>}
            </section>
          </div>

          {complete && <section className="celtic-reading__summary" aria-labelledby="spread-summary-title">
            <div><span className="celtic-reading__eyebrow">Pull up a chair</span><h2 id="spread-summary-title">Read the spread together.</h2><p>Start with the present and its challenge. Follow the past into what’s taking shape, then consider your part in it.</p></div>
            <ol>{reading.cards.map((draw, index) => {
              const card = cardById.get(draw.cardId)!;
              return <li key={index}><button onClick={() => selectPosition(index, true)}><span className="celtic-reading__eyebrow">{index + 1} · {celticCrossPositions[index].name}</span><strong>{card.canonical.name}</strong><span className={`reading-orientation-badge reading-orientation-badge--${draw.orientation}`}>{draw.orientation === 'reversed' ? '↓ Reversed reading' : '↑ Upright reading'}</span><p>{tarotReadingMeanings[draw.cardId]?.[draw.orientation]}</p><span className="celtic-reading__summary-link">Revisit card ↗</span></button></li>;
            })}</ol>
            <button className="reading-button reading-button--gold" onClick={download}><Download size={16} />Save this reading</button>
          </section>}
          <p className="celtic-reading__save-status" role="status">{saveFailed ? 'This browser could not save your spread. Keep this tab open; you can download it when all ten cards are revealed.' : 'Saved in this browser. You can come back to this spread.'}</p>
        </>
      )}

      <details className="celtic-reading__guide"><summary>About this spread & reversals</summary><p>This ten-card layout adapts <a href={celticCrossSource} target="_blank" rel="noreferrer">A. E. Waite’s Celtic Cross</a>, with the past on the left and the future on the right. Positions 7–10 run up the right-hand column.</p><p>Lift any face-down card and spin it 180° if you like. Choose it to commit, or put it back without changing the table. Its identity and orientation stay hidden until you reveal it. Shuffling mixes only the cards still on the table.</p><p>A reversed card can suggest a theme turning inward, meeting resistance or going too far. It isn’t automatically bad news. Use these cues as prompts for reflection, with your question and the neighbouring cards in mind.</p><p>The cards offer a lens, not a fixed prediction. Even the gods occasionally need a second opinion.</p></details>
      {complete && <details className="celtic-reading__prompt">
        <summary>Want to figure out the full reading? Click here</summary>
        <div>
          <p className="celtic-reading__prompt-aside">I’m not spending my own API tokens on this, use your own account for this :D</p>
          <p>Copy this into ChatGPT. Your question and all ten cards are already filled in, with the orientations you picked.</p>
          <label className="sr-only" htmlFor="full-reading-prompt">Prompt for a full ChatGPT tarot reading</label>
          <textarea id="full-reading-prompt" ref={promptField} readOnly value={readingPrompt} rows={16} spellCheck={false} />
          <div className="celtic-reading__prompt-actions"><button className="reading-button reading-button--gold" onClick={copyPrompt}>{copyStatus === 'copied' ? <Check size={16} /> : <Copy size={16} />}{copyStatus === 'copied' ? 'Prompt copied' : 'Copy prompt'}</button><span role="status">{copyStatus === 'copied' ? 'Ready to paste into your own ChatGPT chat.' : copyStatus === 'failed' ? 'The prompt is selected. Press ⌘C or Ctrl+C to copy it.' : 'You can edit it in your chat before sending.'}</span></div>
        </div>
      </details>}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
    </section>
  );
}
