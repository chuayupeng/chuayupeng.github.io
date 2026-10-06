export type TarotSuit = 'cups' | 'wands' | 'pentacles' | 'swords';
export type TarotRank = 'ace' | 'two' | 'three' | 'four' | 'five' | 'six' | 'seven' | 'eight' | 'nine' | 'ten' | 'page' | 'knight' | 'queen' | 'king';
export type IngredientFamily = 'spirits' | 'citrus' | 'botanicals' | 'bitters';

export type TarotIdentity = {
  id: string;
  name: string;
  numeral: string;
} & (
  | { arcana: 'major'; number: number }
  | { arcana: 'minor'; rank: TarotRank; suit: TarotSuit }
);

export interface TarotCardData {
  // Reading logic should use this traditional identity, independently of the artwork.
  canonical: TarotIdentity;
  theme: {
    cast?: { name: string; tradition: 'Greek mythology'; role: string };
    ingredientFamily?: IngredientFamily;
    motifs: string[];
  };
  image: string;
  imageAlt: string;
  description: string;
  connection: string;
  linkLabel: string;
  href: '/timeline' | '/about';
}

// Our visual themes, not traditional tarot suit names or inherited correspondences.
export const tarotSuitThemes: {
  ingredientFamily: IngredientFamily;
  ingredientLabel: string;
  suit: TarotSuit;
  suitLabel: string;
  motif: string;
}[] = [
  { ingredientFamily: 'spirits', ingredientLabel: 'Spirits', suit: 'cups', suitLabel: 'Cups', motif: 'Cocktail vessels' },
  { ingredientFamily: 'citrus', ingredientLabel: 'Citrus', suit: 'pentacles', suitLabel: 'Pentacles', motif: 'Round citrus wheels' },
  { ingredientFamily: 'botanicals', ingredientLabel: 'Botanicals', suit: 'wands', suitLabel: 'Wands', motif: 'Long cinnamon sticks' },
  { ingredientFamily: 'bitters', ingredientLabel: 'Bitters', suit: 'swords', suitLabel: 'Swords', motif: 'Droppers as blades' },
];

// Three prototype cards with Rider–Waite–Smith identities. This is a visual
// sample of the eventual deck, not a complete deck or a recipe catalogue.
export const tarotCards: TarotCardData[] = [
  {
    canonical: { id: 'major-01-magician', name: 'The Magician', numeral: 'I', arcana: 'major', number: 1 },
    theme: { cast: { name: 'Dionysus', tradition: 'Greek mythology', role: 'Master bartender' }, motifs: ['Greek mythology', 'Four suit emblems', 'The tools of the bar'] },
    image: '/art/tarot/magician-v2.webp',
    imageAlt: 'The Magician, numbered I, with Dionysus at a cocktail bar in a complete gold-bordered tarot card',
    description: 'Dionysus is cast as a master bartender, waistcoat over toga, with a bar counter for an altar. The Magician’s familiar pose and four suit emblems remain; the bottles, citrus, cinnamon and bitters supply the tools. Divine intervention now comes with a garnish.',
    connection: 'Moonshots · 2021 — bespoke bottled cocktails. One of the F&B detours behind this deck.',
    linkLabel: 'Follow the F&B side quests',
    href: '/timeline',
  },
  {
    canonical: { id: 'wands-ace', name: 'Ace of Wands', numeral: 'I', arcana: 'minor', rank: 'ace', suit: 'wands' },
    theme: { ingredientFamily: 'botanicals', motifs: ['Cinnamon sticks', 'Herbs', 'Aromatics'] },
    image: '/art/tarot/ace-wands-v2.webp',
    imageAlt: 'Ace of Wands, numbered I, reinterpreted with a cinnamon wand and botanicals in a complete gold-bordered tarot card',
    description: 'The wand becomes a long cinnamon stick, with botanicals gathering around it. A little aroma, a little ceremony. The garnish has clearly decided it deserves top billing.',
    connection: 'The deck is a visual detour into the F&B side of the portfolio. The rest of the character sheet is still very much here.',
    linkLabel: 'Meet the person holding the cards',
    href: '/about',
  },
  {
    canonical: { id: 'pentacles-ace', name: 'Ace of Pentacles', numeral: 'I', arcana: 'minor', rank: 'ace', suit: 'pentacles' },
    theme: { ingredientFamily: 'citrus', motifs: ['Citrus wheels', 'Lemon', 'Orange peel'] },
    image: '/art/tarot/ace-pentacles-v2.webp',
    imageAlt: 'Ace of Pentacles, numbered I, reinterpreted as a round golden citrus wheel in a complete gold-bordered tarot card',
    description: 'A round citrus wheel takes the place of the pentacle. Acid, aroma, and a very small margin between refreshing and regrettable. At least this particular coin comes with a useful garnish.',
    connection: 'La Maison Du Whisky · 2019 — mixing drinks, bar back duties and stock taking. The less mystical side of the bar.',
    linkLabel: 'See the time behind the bar',
    href: '/timeline',
  },
];
