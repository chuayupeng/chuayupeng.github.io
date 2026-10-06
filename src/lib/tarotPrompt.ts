export type TarotPromptCard = {
  position: string;
  cardName: string;
  orientation: 'upright' | 'reversed';
};

export function buildTarotPrompt(
  question: string,
  cards: readonly TarotPromptCard[],
): string {
  if (typeof question !== 'string') {
    throw new TypeError('The reading question must be a string.');
  }
  if (!Array.isArray(cards) || cards.length !== 10) {
    throw new RangeError('A Celtic Cross prompt requires exactly ten cards.');
  }

  const names = new Set<string>();
  const positions = new Set<string>();
  for (const card of cards) {
    if (!card || typeof card !== 'object'
      || typeof card.position !== 'string' || !card.position.trim()
      || typeof card.cardName !== 'string' || !card.cardName.trim()
      || /[\r\n]/.test(card.position) || /[\r\n]/.test(card.cardName)
      || (card.orientation !== 'upright' && card.orientation !== 'reversed')) {
      throw new TypeError('Each card needs a position, a card name, and an upright or reversed orientation.');
    }
    const name = card.cardName.trim();
    const position = card.position.trim();
    if (names.has(name) || positions.has(position)) {
      throw new RangeError('Each card and position must appear only once in the reading.');
    }
    names.add(name);
    positions.add(position);
  }

  return [
    'Help me reflect on this completed ten-card Celtic Cross reading using Rider–Waite–Smith symbolism.',
    '',
    'My question:',
    question.trim() ? question : 'An open reading: what might be useful for me to reflect on?',
    '',
    'The cards below are already drawn and listed in their spread order:',
    ...cards.map((card, index) => `${index + 1}. ${card.position.trim()}: ${card.cardName.trim()} — ${card.orientation}`),
    '',
    'Use these exact cards, positions, and orientations; do not invent, replace, redraw, or add cards.',
    'Give a cohesive reading that relates to my question and explains how the cards interact, including recurring themes, tensions, and contrasts across the spread.',
    'Briefly explain each card in its position, using its upright or reversed meaning; a reversal may suggest inward, blocked, excessive, or releasing energy rather than automatically meaning something bad.',
    'Treat this as a symbolic reading, not a certain prediction; explain alternative interpretations where they fit.',
    'Finish with a few practical reflection questions and small, optional next steps grounded in the reading.',
    'Use plain, thoughtful language with a little personality. Start with the overall theme, then read the cards together rather than giving me ten disconnected definitions.',
  ].join('\n');
}
