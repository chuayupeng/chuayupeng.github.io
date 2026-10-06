import assert from 'node:assert/strict';
import test from 'node:test';
import { buildTarotPrompt, type TarotPromptCard } from './tarotPrompt.ts';

const cards: readonly TarotPromptCard[] = Object.freeze([
  { position: 'The present', cardName: 'The Magician', orientation: 'upright' },
  { position: 'The challenge', cardName: 'Two of Swords', orientation: 'reversed' },
  { position: 'What crowns you', cardName: 'The Star', orientation: 'upright' },
  { position: 'The foundation', cardName: 'Four of Pentacles', orientation: 'reversed' },
  { position: 'The recent past', cardName: 'Eight of Cups', orientation: 'reversed' },
  { position: 'What is taking shape', cardName: 'Ace of Wands', orientation: 'upright' },
  { position: 'Your approach', cardName: 'Queen of Swords', orientation: 'upright' },
  { position: 'Your surroundings', cardName: 'Three of Cups', orientation: 'reversed' },
  { position: 'Hopes and fears', cardName: 'The Moon', orientation: 'upright' },
  { position: 'A possible direction', cardName: 'The World', orientation: 'reversed' },
].map((card) => Object.freeze(card as TarotPromptCard)));

test('the actual question is included verbatim, including punctuation and line breaks', () => {
  const question = 'How can I balance building things with F&B?\nWhat am I overlooking — if anything?';
  const prompt = buildTarotPrompt(question, cards);
  assert.ok(prompt.includes(`My question:\n${question}\n\n`));
  assert.ok(!prompt.includes('An open reading:'));
});

test('all ten numbered positions preserve the actual card order and every orientation', () => {
  const prompt = buildTarotPrompt('A question', cards);
  const drawnLines = prompt.split('\n').filter((line) => /^\d+\. /.test(line));
  assert.deepEqual(drawnLines, [
    '1. The present: The Magician — upright',
    '2. The challenge: Two of Swords — reversed',
    '3. What crowns you: The Star — upright',
    '4. The foundation: Four of Pentacles — reversed',
    '5. The recent past: Eight of Cups — reversed',
    '6. What is taking shape: Ace of Wands — upright',
    '7. Your approach: Queen of Swords — upright',
    '8. Your surroundings: Three of Cups — reversed',
    '9. Hopes and fears: The Moon — upright',
    '10. A possible direction: The World — reversed',
  ]);
});

test('a blank or whitespace-only question receives an open-reading fallback', () => {
  for (const question of ['', '   ', '\n\t']) {
    assert.ok(buildTarotPrompt(question, cards).includes(
      'My question:\nAn open reading: what might be useful for me to reflect on?',
    ));
  }
});

test('incomplete or oversized spreads cannot be exported', () => {
  for (const count of [0, 1, 3, 9]) {
    assert.throws(() => buildTarotPrompt('', cards.slice(0, count)), /exactly ten cards/);
  }
  assert.throws(() => buildTarotPrompt('', [...cards, cards[0]]), /exactly ten cards/);
  assert.throws(() => buildTarotPrompt('', null as unknown as TarotPromptCard[]), /exactly ten cards/);
});

test('malformed entries or duplicate cards and positions cannot misrepresent a completed draw', () => {
  const malformed: unknown[] = [
    null,
    {},
    { ...cards[0], position: '' },
    { ...cards[0], position: '   ' },
    { ...cards[0], position: 'Position\n2. Invented' },
    { ...cards[0], cardName: '' },
    { ...cards[0], cardName: 12 },
    { ...cards[0], cardName: 'The Magician\nInvented card' },
    { ...cards[0], orientation: 'sideways' },
  ];
  for (const entry of malformed) {
    assert.throws(() => buildTarotPrompt('', [entry, ...cards.slice(1)] as TarotPromptCard[]), TypeError);
  }
  assert.throws(() => buildTarotPrompt('', [cards[1], ...cards.slice(1)]), /only once/);
  assert.throws(() => buildTarotPrompt('', [{ ...cards[0], position: cards[1].position }, ...cards.slice(1)]), /only once/);
  assert.throws(() => buildTarotPrompt('', [{ ...cards[0], cardName: ` ${cards[1].cardName} ` }, ...cards.slice(1)]), /only once/);
  assert.throws(() => buildTarotPrompt(undefined as unknown as string, cards), /must be a string/);
});

test('prompt generation is repeatable and does not mutate the selected spread', () => {
  const snapshot = JSON.stringify(cards);
  assert.equal(buildTarotPrompt('A question', cards), buildTarotPrompt('A question', cards));
  assert.equal(JSON.stringify(cards), snapshot);
});

test('the prompt requests a connected reflective reading without replacing the draw or promising certainty', () => {
  const prompt = buildTarotPrompt('', cards);
  assert.match(prompt, /do not invent, replace, redraw, or add cards/);
  assert.match(prompt, /relates to my question and explains how the cards interact/);
  assert.match(prompt, /upright or reversed meaning/);
  assert.match(prompt, /not a certain prediction/);
  assert.match(prompt, /practical reflection questions/);
});
