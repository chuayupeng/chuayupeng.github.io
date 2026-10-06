export type RootCocktailId = 'old-fashioned' | 'martini' | 'daiquiri' | 'sidecar' | 'highball' | 'flip';

export interface HouseDrink {
  id: string;
  name: string;
  style: string;
  group: 'spirits' | 'wine' | 'non-alcoholic';
  ingredients: string[];
  note: string;
  preparation?: string;
  root?: RootCocktailId;
  rootNote?: string;
  accent: string;
}

// Ingredient lists and preparation supplied by Yu Peng. Quantities, glassware,
// fruit varieties and personal anecdotes remain unset until supplied.
export const weddingDrinks: HouseDrink[] = [
  {
    id: 'yours-truly',
    name: 'Yours Truly',
    style: 'Old Fashioned variation',
    group: 'spirits',
    ingredients: ['Bellevoye Plum Whisky', 'Blossom Bitters', 'Manuka Honey', 'Agave'],
    note: 'An Old Fashioned for the wedding menu, with plum whisky at its centre. Manuka honey and agave share the sweetening role, with blossom bitters completing the build.',
    root: 'old-fashioned',
    rootNote: 'The Old Fashioned is the starting structure here: the whisky, the sweeteners, and the bitters each have a part to play.',
    accent: '#d6ac73',
  },
  {
    id: 'yes-i-do',
    name: 'Yes, I Do',
    style: 'Negroni variation',
    group: 'spirits',
    ingredients: ['Roku Gin', 'Carpano Antica Formula', 'Aperol'],
    note: 'Built from a Negroni, with Roku Gin, Carpano Antica Formula and Aperol. Three ingredients, with the choices doing the talking.',
    root: 'martini',
    rootNote: 'I connect this to the Martini root through its spirit-and-aromatized-wine structure, with the Negroni as the more immediate starting point.',
    accent: '#e0a08a',
  },
  {
    id: 'no-objections',
    name: 'No Objections',
    style: 'Non-alcoholic · simmered & chilled',
    group: 'non-alcoholic',
    ingredients: ['Manuka Honey', 'Dehydrated Citrus Peels', 'Red Dates'],
    note: 'The non-alcoholic drink on the wedding menu brings red dates and dehydrated citrus peels together with Manuka honey. It gets a name and a place at the table of its own.',
    preparation: 'The red dates and citrus peels are simmered together with the Manuka honey, then bottled and chilled.',
    accent: '#c2cf9b',
  },
  {
    id: 'red-reverie',
    name: 'Red Reverie',
    style: 'Red sangria',
    group: 'wine',
    ingredients: ['Chianti', 'Cointreau', 'Summer Fruits'],
    note: 'The red sangria in the pair: Chianti, Cointreau, and summer fruits. Its white-wine counterpart is Raise Your Glass.',
    accent: '#db93af',
  },
  {
    id: 'raise-your-glass',
    name: 'Raise Your Glass',
    style: 'White sangria',
    group: 'wine',
    ingredients: ['Pinot Grigio', 'St-Germain', 'Lighter Stone Fruits'],
    note: 'The white sangria pairs Pinot Grigio and St-Germain with lighter stone fruits. A companion to Red Reverie, with its own set of ingredients.',
    accent: '#ded192',
  },
];

export const rootCocktails: {
  id: RootCocktailId;
  name: string;
  idea: string;
  question: string;
}[] = [
  {
    id: 'old-fashioned',
    name: 'Old-Fashioned',
    idea: 'A starting point for exploring a spirit, sweetness, and aromatic accents.',
    question: 'What do I want to bring out in the base spirit, and what would support it?',
  },
  {
    id: 'martini',
    name: 'Martini',
    idea: 'A way to think about the relationship between a spirit and an aromatized wine, and how other modifiers change it.',
    question: 'What happens to the whole drink when I change the wine or the bitter element?',
  },
  {
    id: 'daiquiri',
    name: 'Daiquiri',
    idea: 'A starting point for exploring the balance between spirit, citrus, and sweetness.',
    question: 'If I change the citrus or the sweetener, what else needs adjusting?',
  },
  {
    id: 'sidecar',
    name: 'Sidecar',
    idea: 'A prompt to explore what a liqueur contributes alongside a base spirit and citrus.',
    question: 'How does this liqueur change the sweetness, aroma, and strength together?',
  },
  {
    id: 'highball',
    name: 'Whisky Highball',
    idea: 'A starting point for thinking about a spirit, a lengthening mixer, and the way the drink changes over ice.',
    question: 'What should still stand out once I add the mixer and dilution?',
  },
  {
    id: 'flip',
    name: 'Flip',
    idea: 'A starting point for exploring richness, texture, and how they carry flavour.',
    question: 'What texture am I aiming for, and how will the other ingredients hold up to it?',
  },
];
