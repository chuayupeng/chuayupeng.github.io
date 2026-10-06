import type { TarotCardData } from './tarotData';

export interface MinorArcanaCollection {
  id: 'cups' | 'pentacles' | 'wands' | 'swords';
  title: string;
  subtitle: string;
  cards: TarotCardData[];
}

// Generated from reviewed briefs by design-studies/tarot/sync-preview-data.py.
// Canonical identities remain independent of ingredient themes.
export const minorArcanaCollections: MinorArcanaCollection[] = [
  {
    "id": "cups",
    "title": "Cups · Spirits",
    "subtitle": "Emotions, connection and the things a glass can hold.",
    "cards": [
      {
        "canonical": {
          "id": "ace-of-cups",
          "name": "Ace of Cups",
          "numeral": "I",
          "arcana": "minor",
          "rank": "ace",
          "suit": "cups"
        },
        "theme": {
          "ingredientFamily": "spirits",
          "motifs": [
            "One overflowing cup",
            "Cloud-born hand",
            "Descending dove",
            "Water lilies",
            "Living water"
          ]
        },
        "image": "/art/tarot/minor/cups/ace-of-cups.webp",
        "imageAlt": "I — Ace of Cups, reinterpreted through spirits. One overflowing cup, Cloud-born hand, Descending dove.",
        "description": "A single overflowing cup opens the suit with generosity and emotional possibility. The spirit is the ingredient; the dove, water and open hand keep the card's larger sense of welcome.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "two-of-cups",
          "name": "Two of Cups",
          "numeral": "II",
          "arcana": "minor",
          "rank": "two",
          "suit": "cups"
        },
        "theme": {
          "ingredientFamily": "spirits",
          "motifs": [
            "Two cups",
            "Two equal adults",
            "Caduceus",
            "Winged lion's head"
          ]
        },
        "image": "/art/tarot/minor/cups/two-of-cups.webp",
        "imageAlt": "II — Two of Cups, reinterpreted through spirits. Two cups, Two equal adults, Caduceus.",
        "description": "Two people meet with one cup each, offering the same trust they hope to receive. This toast is about a mutual connection, not who paid for the round.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "three-of-cups",
          "name": "Three of Cups",
          "numeral": "III",
          "arcana": "minor",
          "rank": "three",
          "suit": "cups"
        },
        "theme": {
          "ingredientFamily": "spirits",
          "motifs": [
            "Three adults",
            "Three raised cups",
            "Dancing circle",
            "Harvest fruit"
          ]
        },
        "image": "/art/tarot/minor/cups/three-of-cups.webp",
        "imageAlt": "III — Three of Cups, reinterpreted through spirits. Three adults, Three raised cups, Dancing circle.",
        "description": "Three friends raise three cups in a shared celebration. A good night belongs to the whole table.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "four-of-cups",
          "name": "Four of Cups",
          "numeral": "IV",
          "arcana": "minor",
          "rank": "four",
          "suit": "cups"
        },
        "theme": {
          "ingredientFamily": "spirits",
          "motifs": [
            "Three grounded cups",
            "One offered cup",
            "Crossed arms",
            "Tree"
          ]
        },
        "image": "/art/tarot/minor/cups/four-of-cups.webp",
        "imageAlt": "IV — Four of Cups, reinterpreted through spirits. Three grounded cups, One offered cup, Crossed arms.",
        "description": "Three cups sit within reach while a fourth arrives unnoticed. Sometimes another option is available before you are ready to want it.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "five-of-cups",
          "name": "Five of Cups",
          "numeral": "V",
          "arcana": "minor",
          "rank": "five",
          "suit": "cups"
        },
        "theme": {
          "ingredientFamily": "spirits",
          "motifs": [
            "Three fallen cups",
            "Two upright cups",
            "Black cloak",
            "Bridge",
            "Distant home"
          ]
        },
        "image": "/art/tarot/minor/cups/five-of-cups.webp",
        "imageAlt": "V — Five of Cups, reinterpreted through spirits. Three fallen cups, Two upright cups, Black cloak.",
        "description": "The figure watches three spilled cups while two remain standing behind them. The loss is real, but it has not taken everything.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "six-of-cups",
          "name": "Six of Cups",
          "numeral": "VI",
          "arcana": "minor",
          "rank": "six",
          "suit": "cups"
        },
        "theme": {
          "ingredientFamily": "spirits",
          "motifs": [
            "Six flower-filled cups",
            "Offering between adults",
            "Old courtyard",
            "Homeward guard"
          ]
        },
        "image": "/art/tarot/minor/cups/six-of-cups.webp",
        "imageAlt": "VI — Six of Cups, reinterpreted through spirits. Six flower-filled cups, Offering between adults, Old courtyard.",
        "description": "An offered cup of flowers turns an old bar courtyard into a place of remembered kindness. The adult friends keep the traditional theme of nostalgia without making alcohol part of a childhood scene.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "seven-of-cups",
          "name": "Seven of Cups",
          "numeral": "VII",
          "arcana": "minor",
          "rank": "seven",
          "suit": "cups"
        },
        "theme": {
          "ingredientFamily": "spirits",
          "motifs": [
            "Seven cloud cups",
            "Silhouette observer",
            "Strange visions",
            "Choice"
          ]
        },
        "image": "/art/tarot/minor/cups/seven-of-cups.webp",
        "imageAlt": "VII — Seven of Cups, reinterpreted through spirits. Seven cloud cups, Silhouette observer, Strange visions.",
        "description": "Seven cups offer seven very different visions. The menu is impressive; deciding which promises deserve belief is the harder part.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "eight-of-cups",
          "name": "Eight of Cups",
          "numeral": "VIII",
          "arcana": "minor",
          "rank": "eight",
          "suit": "cups"
        },
        "theme": {
          "ingredientFamily": "spirits",
          "motifs": [
            "Eight abandoned cups",
            "Departing figure",
            "Walking staff",
            "Eclipsed moon",
            "Mountains"
          ]
        },
        "image": "/art/tarot/minor/cups/eight-of-cups.webp",
        "imageAlt": "VIII — Eight of Cups, reinterpreted through spirits. Eight abandoned cups, Departing figure, Walking staff.",
        "description": "Eight cups stay behind as their owner takes the mountain path. Something can be familiar and still no longer be enough.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "nine-of-cups",
          "name": "Nine of Cups",
          "numeral": "IX",
          "arcana": "minor",
          "rank": "nine",
          "suit": "cups"
        },
        "theme": {
          "ingredientFamily": "spirits",
          "motifs": [
            "Nine cups in an arc",
            "Seated figure",
            "Folded arms",
            "Draped counter"
          ]
        },
        "image": "/art/tarot/minor/cups/nine-of-cups.webp",
        "imageAlt": "IX — Nine of Cups, reinterpreted through spirits. Nine cups in an arc, Seated figure, Folded arms.",
        "description": "Nine cups line the counter behind a comfortably satisfied host. For once, enjoying what is already there is the entire assignment.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "ten-of-cups",
          "name": "Ten of Cups",
          "numeral": "X",
          "arcana": "minor",
          "rank": "ten",
          "suit": "cups"
        },
        "theme": {
          "ingredientFamily": "spirits",
          "motifs": [
            "Ten cups on a rainbow",
            "Welcoming home",
            "Two embracing adults",
            "Two dancing adults"
          ]
        },
        "image": "/art/tarot/minor/cups/ten-of-cups.webp",
        "imageAlt": "X — Ten of Cups, reinterpreted through spirits. Ten cups on a rainbow, Welcoming home, Two embracing adults.",
        "description": "Ten cups arc over a home and a group of people who belong together. The reward is shared contentment, not a better stocked private bar.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "page-of-cups",
          "name": "Page of Cups",
          "numeral": "PAGE",
          "arcana": "minor",
          "rank": "page",
          "suit": "cups"
        },
        "theme": {
          "ingredientFamily": "spirits",
          "motifs": [
            "Fish in one cup",
            "Young adult page",
            "Sea",
            "Floral tunic"
          ]
        },
        "image": "/art/tarot/minor/cups/page-of-cups.webp",
        "imageAlt": "PAGE — Page of Cups, reinterpreted through spirits. Fish in one cup, Young adult page, Sea.",
        "description": "A fish appears in the apprentice's cup, and curiosity wins over the obvious complaint about the drink. The card stays open to an unexpected idea or message.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "knight-of-cups",
          "name": "Knight of Cups",
          "numeral": "KNIGHT",
          "arcana": "minor",
          "rank": "knight",
          "suit": "cups"
        },
        "theme": {
          "ingredientFamily": "spirits",
          "motifs": [
            "One offered cup",
            "Quiet white horse",
            "Winged helmet",
            "River"
          ]
        },
        "image": "/art/tarot/minor/cups/knight-of-cups.webp",
        "imageAlt": "KNIGHT — Knight of Cups, reinterpreted through spirits. One offered cup, Quiet white horse, Winged helmet.",
        "description": "A quiet rider extends a single cup in invitation. Imagination and feeling move toward someone without turning the approach into a charge.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "queen-of-cups",
          "name": "Queen of Cups",
          "numeral": "QUEEN",
          "arcana": "minor",
          "rank": "queen",
          "suit": "cups"
        },
        "theme": {
          "ingredientFamily": "spirits",
          "motifs": [
            "One ornate covered cup",
            "Seaside throne",
            "Shells",
            "Contemplative gaze"
          ]
        },
        "image": "/art/tarot/minor/cups/queen-of-cups.webp",
        "imageAlt": "QUEEN — Queen of Cups, reinterpreted through spirits. One ornate covered cup, Seaside throne, Shells.",
        "description": "The queen studies an ornate covered cup beside the sea. Attention and compassion take the place of showmanship.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "king-of-cups",
          "name": "King of Cups",
          "numeral": "KING",
          "arcana": "minor",
          "rank": "king",
          "suit": "cups"
        },
        "theme": {
          "ingredientFamily": "spirits",
          "motifs": [
            "One cup and one sceptre",
            "Throne upon water",
            "Leaping dolphin",
            "Distant ship"
          ]
        },
        "image": "/art/tarot/minor/cups/king-of-cups.webp",
        "imageAlt": "KING — King of Cups, reinterpreted through spirits. One cup and one sceptre, Throne upon water, Leaping dolphin.",
        "description": "The king keeps his cup steady while the sea moves around his throne. Emotional balance means remaining responsive without being carried away.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      }
    ]
  },
  {
    "id": "pentacles",
    "title": "Pentacles · Citrus",
    "subtitle": "Work, resources and the slow business of growing something worthwhile.",
    "cards": [
      {
        "canonical": {
          "id": "ace-of-pentacles",
          "name": "Ace of Pentacles",
          "numeral": "I",
          "arcana": "minor",
          "rank": "ace",
          "suit": "pentacles"
        },
        "theme": {
          "ingredientFamily": "citrus",
          "motifs": [
            "Cloud hand",
            "single pentacle",
            "garden path",
            "flowering arch"
          ]
        },
        "image": "/art/tarot/minor/pentacles/ace-of-pentacles.webp",
        "imageAlt": "I — Ace of Pentacles, reinterpreted through citrus. Cloud hand, single pentacle, garden path.",
        "description": "A cloud-hand presents one citrus pentacle above a cultivated garden: something promising has arrived, but somebody still has to grow it.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "two-of-pentacles",
          "name": "Two of Pentacles",
          "numeral": "II",
          "arcana": "minor",
          "rank": "two",
          "suit": "pentacles"
        },
        "theme": {
          "ingredientFamily": "citrus",
          "motifs": [
            "Two pentacles",
            "infinity loop",
            "dancing adult",
            "waves and ships"
          ]
        },
        "image": "/art/tarot/minor/pentacles/two-of-pentacles.webp",
        "imageAlt": "II — Two of Pentacles, reinterpreted through citrus. Two pentacles, infinity loop, dancing adult.",
        "description": "Two citrus wheels and an unbroken loop make a balancing act out of competing demands. The rough sea behind the performer keeps the setting from pretending that everything is under control.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "three-of-pentacles",
          "name": "Three of Pentacles",
          "numeral": "III",
          "arcana": "minor",
          "rank": "three",
          "suit": "pentacles"
        },
        "theme": {
          "ingredientFamily": "citrus",
          "motifs": [
            "Three pentacles",
            "vaulted arch",
            "working artisan",
            "two collaborators",
            "plan"
          ]
        },
        "image": "/art/tarot/minor/pentacles/three-of-pentacles.webp",
        "imageAlt": "III — Three of Pentacles, reinterpreted through citrus. Three pentacles, vaulted arch, working artisan.",
        "description": "A craftsperson and two collaborators work through the plan for a vaulted bar. The three citrus emblems belong to the architecture: this is skilled work becoming a shared result.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "four-of-pentacles",
          "name": "Four of Pentacles",
          "numeral": "IV",
          "arcana": "minor",
          "rank": "four",
          "suit": "pentacles"
        },
        "theme": {
          "ingredientFamily": "citrus",
          "motifs": [
            "Four pentacles",
            "crown",
            "clasped chest",
            "two pinned feet",
            "distant town"
          ]
        },
        "image": "/art/tarot/minor/pentacles/four-of-pentacles.webp",
        "imageAlt": "IV — Four of Pentacles, reinterpreted through citrus. Four pentacles, crown, clasped chest.",
        "description": "A proprietor has secured the stock so thoroughly that neither they nor it can move. The four citrus pentacles preserve the familiar grip on possessions, along with its comfort and its cost.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "five-of-pentacles",
          "name": "Five of Pentacles",
          "numeral": "V",
          "arcana": "minor",
          "rank": "five",
          "suit": "pentacles"
        },
        "theme": {
          "ingredientFamily": "citrus",
          "motifs": [
            "Five pentacles in lit window",
            "two adults",
            "snow",
            "crutches",
            "exclusion"
          ]
        },
        "image": "/art/tarot/minor/pentacles/five-of-pentacles.webp",
        "imageAlt": "V — Five of Pentacles, reinterpreted through citrus. Five pentacles in lit window, two adults, snow.",
        "description": "Two adults pass the warm window of a bar while struggling through the cold outside. The five illuminated citrus emblems preserve the contrast between comfort close by and people who cannot reach it.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "six-of-pentacles",
          "name": "Six of Pentacles",
          "numeral": "VI",
          "arcana": "minor",
          "rank": "six",
          "suit": "pentacles"
        },
        "theme": {
          "ingredientFamily": "citrus",
          "motifs": [
            "Six pentacles overhead",
            "balanced scales",
            "merchant",
            "two recipients",
            "giving hand"
          ]
        },
        "image": "/art/tarot/minor/pentacles/six-of-pentacles.webp",
        "imageAlt": "VI — Six of Pentacles, reinterpreted through citrus. Six pentacles overhead, balanced scales, merchant.",
        "description": "A successful merchant offers help while keeping a scale in hand. The scene makes generosity visible without forgetting who is in a position to give and who has to ask.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "seven-of-pentacles",
          "name": "Seven of Pentacles",
          "numeral": "VII",
          "arcana": "minor",
          "rank": "seven",
          "suit": "pentacles"
        },
        "theme": {
          "ingredientFamily": "citrus",
          "motifs": [
            "Seven pentacles",
            "resting worker",
            "hoe",
            "cultivated plant",
            "pause"
          ]
        },
        "image": "/art/tarot/minor/pentacles/seven-of-pentacles.webp",
        "imageAlt": "VII — Seven of Pentacles, reinterpreted through citrus. Seven pentacles, resting worker, hoe.",
        "description": "A grower pauses over the citrus crop instead of rushing to bottle the result. The seven pentacles make this a moment of assessment: effort has produced something, and the next step still deserves thought.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "eight-of-pentacles",
          "name": "Eight of Pentacles",
          "numeral": "VIII",
          "arcana": "minor",
          "rank": "eight",
          "suit": "pentacles"
        },
        "theme": {
          "ingredientFamily": "citrus",
          "motifs": [
            "Eight pentacles",
            "six finished pieces",
            "one on bench",
            "one on ground",
            "working artisan"
          ]
        },
        "image": "/art/tarot/minor/pentacles/eight-of-pentacles.webp",
        "imageAlt": "VIII — Eight of Pentacles, reinterpreted through citrus. Eight pentacles, six finished pieces, one on bench.",
        "description": "An artisan repeats the work until the result is consistent. Six finished pieces hang up, one waits below and one is being worked on: the technical bit is not glamorous, which is usually how you know it matters.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "nine-of-pentacles",
          "name": "Nine of Pentacles",
          "numeral": "IX",
          "arcana": "minor",
          "rank": "nine",
          "suit": "pentacles"
        },
        "theme": {
          "ingredientFamily": "citrus",
          "motifs": [
            "Nine pentacles",
            "adult garden owner",
            "falcon",
            "cultivated abundance",
            "snail"
          ]
        },
        "image": "/art/tarot/minor/pentacles/nine-of-pentacles.webp",
        "imageAlt": "IX — Nine of Pentacles, reinterpreted through citrus. Nine pentacles, adult garden owner, falcon.",
        "description": "The owner of a thriving citrus garden has enough room to enjoy what they built. The trained bird and nine pentacles keep the card tied to discernment and earned independence rather than conspicuous spending.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "ten-of-pentacles",
          "name": "Ten of Pentacles",
          "numeral": "X",
          "arcana": "minor",
          "rank": "ten",
          "suit": "pentacles"
        },
        "theme": {
          "ingredientFamily": "citrus",
          "motifs": [
            "Ten pentacles",
            "elderly host",
            "adult generations",
            "two dogs",
            "archway"
          ]
        },
        "image": "/art/tarot/minor/pentacles/ten-of-pentacles.webp",
        "imageAlt": "X — Ten of Pentacles, reinterpreted through citrus. Ten pentacles, elderly host, adult generations.",
        "description": "An older host, their adult family and two dogs share a long-established courtyard bar. Ten citrus emblems frame the scene as something built to outlast one good service, with a young adult taking the traditional child's place.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "page-of-pentacles",
          "name": "Page of Pentacles",
          "numeral": "PAGE",
          "arcana": "minor",
          "rank": "page",
          "suit": "pentacles"
        },
        "theme": {
          "ingredientFamily": "citrus",
          "motifs": [
            "One pentacle",
            "raised studying hands",
            "adult apprentice",
            "cultivated field",
            "distant hills"
          ]
        },
        "image": "/art/tarot/minor/pentacles/page-of-pentacles.webp",
        "imageAlt": "PAGE — Page of Pentacles, reinterpreted through citrus. One pentacle, raised studying hands, adult apprentice.",
        "description": "A novice studies one citrus pentacle as if there might be something worth learning from it. The Page remains an adult apprentice, absorbed in the material before the grand plans start.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "knight-of-pentacles",
          "name": "Knight of Pentacles",
          "numeral": "KNIGHT",
          "arcana": "minor",
          "rank": "knight",
          "suit": "pentacles"
        },
        "theme": {
          "ingredientFamily": "citrus",
          "motifs": [
            "One pentacle",
            "still heavy horse",
            "armoured adult",
            "ploughed fields",
            "patient posture"
          ]
        },
        "image": "/art/tarot/minor/pentacles/knight-of-pentacles.webp",
        "imageAlt": "KNIGHT — Knight of Pentacles, reinterpreted through citrus. One pentacle, still heavy horse, armoured adult.",
        "description": "The Knight carries the citrus harvest forward at a pace that can actually be sustained. The still horse and worked fields keep the emphasis on reliability rather than dramatic arrival.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "queen-of-pentacles",
          "name": "Queen of Pentacles",
          "numeral": "QUEEN",
          "arcana": "minor",
          "rank": "queen",
          "suit": "pentacles"
        },
        "theme": {
          "ingredientFamily": "citrus",
          "motifs": [
            "One pentacle in lap",
            "seated queen",
            "flowering garden",
            "rabbit",
            "carved throne"
          ]
        },
        "image": "/art/tarot/minor/pentacles/queen-of-pentacles.webp",
        "imageAlt": "QUEEN — Queen of Pentacles, reinterpreted through citrus. One pentacle in lap, seated queen, flowering garden.",
        "description": "The Queen holds one citrus pentacle with the attention of someone who knows where the good things come from. Her garden and rabbit keep the card grounded in generous, practical care.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "king-of-pentacles",
          "name": "King of Pentacles",
          "numeral": "KING",
          "arcana": "minor",
          "rank": "king",
          "suit": "pentacles"
        },
        "theme": {
          "ingredientFamily": "citrus",
          "motifs": [
            "One pentacle",
            "bull-carved throne",
            "sceptre",
            "grapevines",
            "armoured foot"
          ]
        },
        "image": "/art/tarot/minor/pentacles/king-of-pentacles.webp",
        "imageAlt": "KING — King of Pentacles, reinterpreted through citrus. One pentacle, bull-carved throne, sceptre.",
        "description": "The King presides over an established bar and vineyard with the stock, land and patience to keep it running. One citrus pentacle marks the suit; the throne and grounded posture carry the responsibility that comes with success.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      }
    ]
  },
  {
    "id": "wands",
    "title": "Wands · Botanicals",
    "subtitle": "Ideas, ambition and the energy it takes to see them through.",
    "cards": [
      {
        "canonical": {
          "id": "ace-of-wands",
          "name": "Ace of Wands",
          "numeral": "I",
          "arcana": "minor",
          "rank": "ace",
          "suit": "wands"
        },
        "theme": {
          "ingredientFamily": "botanicals",
          "motifs": [
            "Cloud hand",
            "one living wand",
            "leaves",
            "open landscape"
          ]
        },
        "image": "/art/tarot/minor/wands/ace-of-wands.webp",
        "imageAlt": "I — Ace of Wands, reinterpreted through botanicals. Cloud hand, one living wand, leaves.",
        "description": "A living cinnamon wand arrives from the cloud with more promise than a finished product. The botanical suit starts with the urge to make something and the energy to try.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "two-of-wands",
          "name": "Two of Wands",
          "numeral": "II",
          "arcana": "minor",
          "rank": "two",
          "suit": "wands"
        },
        "theme": {
          "ingredientFamily": "botanicals",
          "motifs": [
            "Two wands",
            "globe",
            "battlement",
            "distant sea",
            "fixed and held staff"
          ]
        },
        "image": "/art/tarot/minor/wands/two-of-wands.webp",
        "imageAlt": "II — Two of Wands, reinterpreted through botanicals. Two wands, globe, battlement.",
        "description": "A figure studies a globe from the rooftop of an established bar, between one held wand and one fixed in place. There is a world beyond the current operation; deciding where to go is still part of the work.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "three-of-wands",
          "name": "Three of Wands",
          "numeral": "III",
          "arcana": "minor",
          "rank": "three",
          "suit": "wands"
        },
        "theme": {
          "ingredientFamily": "botanicals",
          "motifs": [
            "Three planted wands",
            "back-facing adult",
            "cliff",
            "ships",
            "horizon"
          ]
        },
        "image": "/art/tarot/minor/wands/three-of-wands.webp",
        "imageAlt": "III — Three of Wands, reinterpreted through botanicals. Three planted wands, back-facing adult, cliff.",
        "description": "The first decision has become movement: ships are already travelling beyond the headland. Three botanical staffs keep the figure anchored while they consider what the enterprise might become.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "four-of-wands",
          "name": "Four of Wands",
          "numeral": "IV",
          "arcana": "minor",
          "rank": "four",
          "suit": "wands"
        },
        "theme": {
          "ingredientFamily": "botanicals",
          "motifs": [
            "Four planted wands",
            "suspended garland",
            "two celebrating adults",
            "bridge",
            "welcoming home"
          ]
        },
        "image": "/art/tarot/minor/wands/four-of-wands.webp",
        "imageAlt": "IV — Four of Wands, reinterpreted through botanicals. Four planted wands, suspended garland, two celebrating adults.",
        "description": "Four botanical posts frame a welcoming terrace and a celebration worth stopping for. The finished work becomes a place people can enjoy together, rather than another excuse to keep working.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "five-of-wands",
          "name": "Five of Wands",
          "numeral": "V",
          "arcana": "minor",
          "rank": "five",
          "suit": "wands"
        },
        "theme": {
          "ingredientFamily": "botanicals",
          "motifs": [
            "Five adults",
            "five staffs",
            "crossing gestures",
            "uneven ground",
            "nonlethal contest"
          ]
        },
        "image": "/art/tarot/minor/wands/five-of-wands.webp",
        "imageAlt": "V — Five of Wands, reinterpreted through botanicals. Five adults, five staffs, crossing gestures.",
        "description": "Five people bring five strong opinions and five staffs to the same patch of ground. The scene stays closer to sparring than disaster: energy is available, coordination is not.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "six-of-wands",
          "name": "Six of Wands",
          "numeral": "VI",
          "arcana": "minor",
          "rank": "six",
          "suit": "wands"
        },
        "theme": {
          "ingredientFamily": "botanicals",
          "motifs": [
            "Six wands",
            "laurel-crowned rider",
            "wreath on staff",
            "white horse",
            "supporters"
          ]
        },
        "image": "/art/tarot/minor/wands/six-of-wands.webp",
        "imageAlt": "VI — Six of Wands, reinterpreted through botanicals. Six wands, laurel-crowned rider, wreath on staff.",
        "description": "A returning rider receives recognition from the people around them. The wreath belongs to a visible achievement, with five supporting staffs making the audience part of the scene.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "seven-of-wands",
          "name": "Seven of Wands",
          "numeral": "VII",
          "arcana": "minor",
          "rank": "seven",
          "suit": "wands"
        },
        "theme": {
          "ingredientFamily": "botanicals",
          "motifs": [
            "Seven wands",
            "elevated defender",
            "six rising challengers",
            "mismatched footwear",
            "firm stance"
          ]
        },
        "image": "/art/tarot/minor/wands/seven-of-wands.webp",
        "imageAlt": "VII — Seven of Wands, reinterpreted through botanicals. Seven wands, elevated defender, six rising challengers.",
        "description": "One figure has the higher ground and still has work to do to keep it. The seven staffs preserve the pressure of defending a position, rather than turning the card into a generic bar fight.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "eight-of-wands",
          "name": "Eight of Wands",
          "numeral": "VIII",
          "arcana": "minor",
          "rank": "eight",
          "suit": "wands"
        },
        "theme": {
          "ingredientFamily": "botanicals",
          "motifs": [
            "Eight parallel flying wands",
            "open country",
            "river",
            "distant building",
            "downward trajectory"
          ]
        },
        "image": "/art/tarot/minor/wands/eight-of-wands.webp",
        "imageAlt": "VIII — Eight of Wands, reinterpreted through botanicals. Eight parallel flying wands, open country, river.",
        "description": "Eight botanical staffs move together across open country, with no person trying to manage each one mid-flight. The card captures momentum and something already on its way.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "nine-of-wands",
          "name": "Nine of Wands",
          "numeral": "IX",
          "arcana": "minor",
          "rank": "nine",
          "suit": "wands"
        },
        "theme": {
          "ingredientFamily": "botanicals",
          "motifs": [
            "Nine wands",
            "one held staff",
            "eight upright staffs",
            "bandaged head",
            "wary stance"
          ]
        },
        "image": "/art/tarot/minor/wands/nine-of-wands.webp",
        "imageAlt": "IX — Nine of Wands, reinterpreted through botanicals. Nine wands, one held staff, eight upright staffs.",
        "description": "A tired defender is still standing, with eight staffs behind and one held close. This is persistence after effort, including the understandable reluctance to let the next problem through the door.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "ten-of-wands",
          "name": "Ten of Wands",
          "numeral": "X",
          "arcana": "minor",
          "rank": "ten",
          "suit": "wands"
        },
        "theme": {
          "ingredientFamily": "botanicals",
          "motifs": [
            "Ten carried wands",
            "bent adult",
            "obstructed view",
            "distant town",
            "heavy bundle"
          ]
        },
        "image": "/art/tarot/minor/wands/ten-of-wands.webp",
        "imageAlt": "X — Ten of Wands, reinterpreted through botanicals. Ten carried wands, bent adult, obstructed view.",
        "description": "A worker carries the entire bundle toward town, which is one way to ensure the work gets done and a fairly poor way to see where you are going. Ten staffs keep the burden literal and the destination close.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "page-of-wands",
          "name": "Page of Wands",
          "numeral": "PAGE",
          "arcana": "minor",
          "rank": "page",
          "suit": "wands"
        },
        "theme": {
          "ingredientFamily": "botanicals",
          "motifs": [
            "One living wand",
            "studying adult",
            "upright posture",
            "desert hills",
            "travelling clothes"
          ]
        },
        "image": "/art/tarot/minor/wands/page-of-wands.webp",
        "imageAlt": "PAGE — Page of Wands, reinterpreted through botanicals. One living wand, studying adult, upright posture.",
        "description": "An adult apprentice studies a living cinnamon wand in an unfamiliar landscape. The Page brings curiosity and a willingness to experiment before there is much certainty to hide behind.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "knight-of-wands",
          "name": "Knight of Wands",
          "numeral": "KNIGHT",
          "arcana": "minor",
          "rank": "knight",
          "suit": "wands"
        },
        "theme": {
          "ingredientFamily": "botanicals",
          "motifs": [
            "One living wand",
            "active horse",
            "adult rider",
            "salamander tunic",
            "desert hills"
          ]
        },
        "image": "/art/tarot/minor/wands/knight-of-wands.webp",
        "imageAlt": "KNIGHT — Knight of Wands, reinterpreted through botanicals. One living wand, active horse, adult rider.",
        "description": "The Knight is already moving, with a botanical wand in hand and a horse that has apparently accepted the brief. The energy is useful; whether anyone checked the route is a separate matter.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "queen-of-wands",
          "name": "Queen of Wands",
          "numeral": "QUEEN",
          "arcana": "minor",
          "rank": "queen",
          "suit": "wands"
        },
        "theme": {
          "ingredientFamily": "botanicals",
          "motifs": [
            "One living wand",
            "sunflower",
            "black cat",
            "lion throne",
            "seated adult queen"
          ]
        },
        "image": "/art/tarot/minor/wands/queen-of-wands.webp",
        "imageAlt": "QUEEN — Queen of Wands, reinterpreted through botanicals. One living wand, sunflower, black cat.",
        "description": "The Queen holds the room without needing to dominate it. Her living wand, sunflower and black cat keep the warmth and independent confidence of the original scene, with a host's welcome close by.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "king-of-wands",
          "name": "King of Wands",
          "numeral": "KING",
          "arcana": "minor",
          "rank": "king",
          "suit": "wands"
        },
        "theme": {
          "ingredientFamily": "botanicals",
          "motifs": [
            "One flowering wand",
            "lion throne",
            "salamander",
            "alert adult king",
            "upright posture"
          ]
        },
        "image": "/art/tarot/minor/wands/king-of-wands.webp",
        "imageAlt": "KING — King of Wands, reinterpreted through botanicals. One flowering wand, lion throne, salamander.",
        "description": "The King turns creative drive into something other people can follow. The living wand and salamander keep the fire of the suit present, while the established setting suggests that inspiration has acquired responsibilities.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      }
    ]
  },
  {
    "id": "swords",
    "title": "Swords · Bitters",
    "subtitle": "Clarity, conflict and a few truths that do not go down sweetly.",
    "cards": [
      {
        "canonical": {
          "id": "ace-of-swords",
          "name": "Ace of Swords",
          "numeral": "I",
          "arcana": "minor",
          "rank": "ace",
          "suit": "swords"
        },
        "theme": {
          "ingredientFamily": "bitters",
          "motifs": [
            "One crowned blade-dropper",
            "Cloud-born hand",
            "Olive and palm",
            "Mountain peaks"
          ]
        },
        "image": "/art/tarot/minor/swords/ace-of-swords.webp",
        "imageAlt": "I — Ace of Swords, reinterpreted through bitters. One crowned blade-dropper, Cloud-born hand, Olive and palm.",
        "description": "A single crowned dropper-blade rises from a cloud. The small, precise measure of bitters becomes a symbol of clarity that cuts through confusion.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "two-of-swords",
          "name": "Two of Swords",
          "numeral": "II",
          "arcana": "minor",
          "rank": "two",
          "suit": "swords"
        },
        "theme": {
          "ingredientFamily": "bitters",
          "motifs": [
            "Two crossed blade-droppers",
            "Blindfolded adult",
            "Sea",
            "Crescent moon"
          ]
        },
        "image": "/art/tarot/minor/swords/two-of-swords.webp",
        "imageAlt": "II — Two of Swords, reinterpreted through bitters. Two crossed blade-droppers, Blindfolded adult, Sea.",
        "description": "Two balanced blades and a blindfold hold a decision in suspension. Everything is controlled, but nothing is moving yet.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "three-of-swords",
          "name": "Three of Swords",
          "numeral": "III",
          "arcana": "minor",
          "rank": "three",
          "suit": "swords"
        },
        "theme": {
          "ingredientFamily": "bitters",
          "motifs": [
            "Three blade-droppers",
            "Symbolic red heart",
            "Rain",
            "Storm clouds"
          ]
        },
        "image": "/art/tarot/minor/swords/three-of-swords.webp",
        "imageAlt": "III — Three of Swords, reinterpreted through bitters. Three blade-droppers, Symbolic red heart, Rain.",
        "description": "Three dropper-blades pierce a symbolic heart under rain. Bitterness is allowed its weight here: some truths arrive with pain.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "four-of-swords",
          "name": "Four of Swords",
          "numeral": "IV",
          "arcana": "minor",
          "rank": "four",
          "suit": "swords"
        },
        "theme": {
          "ingredientFamily": "bitters",
          "motifs": [
            "Three suspended blades",
            "One horizontal blade",
            "Reclining effigy",
            "Stained glass"
          ]
        },
        "image": "/art/tarot/minor/swords/four-of-swords.webp",
        "imageAlt": "IV — Four of Swords, reinterpreted through bitters. Three suspended blades, One horizontal blade, Reclining effigy.",
        "description": "Three blades hang above a resting effigy, with the fourth laid horizontally below. The bar is closed; recovery gets its own place in the schedule.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "five-of-swords",
          "name": "Five of Swords",
          "numeral": "V",
          "arcana": "minor",
          "rank": "five",
          "suit": "swords"
        },
        "theme": {
          "ingredientFamily": "bitters",
          "motifs": [
            "Three held blades",
            "Two grounded blades",
            "Two retreating adults",
            "Torn clouds"
          ]
        },
        "image": "/art/tarot/minor/swords/five-of-swords.webp",
        "imageAlt": "V — Five of Swords, reinterpreted through bitters. Three held blades, Two grounded blades, Two retreating adults.",
        "description": "The winner holds three blades while two others leave theirs behind. Keeping the tools does not make the aftermath a triumph.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "six-of-swords",
          "name": "Six of Swords",
          "numeral": "VI",
          "arcana": "minor",
          "rank": "six",
          "suit": "swords"
        },
        "theme": {
          "ingredientFamily": "bitters",
          "motifs": [
            "Six upright blades",
            "Ferry boat",
            "Ferryman and two adult passengers",
            "Changing water"
          ]
        },
        "image": "/art/tarot/minor/swords/six-of-swords.webp",
        "imageAlt": "VI — Six of Swords, reinterpreted through bitters. Six upright blades, Ferry boat, Ferryman and two adult passengers.",
        "description": "A ferry carries its passengers and six blades toward quieter water. The crossing brings their history along without requiring them to stay where it happened.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "seven-of-swords",
          "name": "Seven of Swords",
          "numeral": "VII",
          "arcana": "minor",
          "rank": "seven",
          "suit": "swords"
        },
        "theme": {
          "ingredientFamily": "bitters",
          "motifs": [
            "Five carried blades",
            "Two remaining blades",
            "Backward glance",
            "Distant camp"
          ]
        },
        "image": "/art/tarot/minor/swords/seven-of-swords.webp",
        "imageAlt": "VII — Seven of Swords, reinterpreted through bitters. Five carried blades, Two remaining blades, Backward glance.",
        "description": "Five blades leave with the figure while two remain at the camp. The clever shortcut may work, but the backward glance suggests its cost has not been settled.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "eight-of-swords",
          "name": "Eight of Swords",
          "numeral": "VIII",
          "arcana": "minor",
          "rank": "eight",
          "suit": "swords"
        },
        "theme": {
          "ingredientFamily": "bitters",
          "motifs": [
            "Eight surrounding blades",
            "Blindfold and loose bindings",
            "Open forward path",
            "Wet ground"
          ]
        },
        "image": "/art/tarot/minor/swords/eight-of-swords.webp",
        "imageAlt": "VIII — Eight of Swords, reinterpreted through bitters. Eight surrounding blades, Blindfold and loose bindings, Open forward path.",
        "description": "Eight blades surround a blindfolded figure, with a path still open ahead. The restriction feels complete even where the scene leaves room to move.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "nine-of-swords",
          "name": "Nine of Swords",
          "numeral": "IX",
          "arcana": "minor",
          "rank": "nine",
          "suit": "swords"
        },
        "theme": {
          "ingredientFamily": "bitters",
          "motifs": [
            "Nine horizontal blades",
            "Adult sitting up in bed",
            "Hands over face",
            "Patterned quilt"
          ]
        },
        "image": "/art/tarot/minor/swords/nine-of-swords.webp",
        "imageAlt": "IX — Nine of Swords, reinterpreted through bitters. Nine horizontal blades, Adult sitting up in bed, Hands over face.",
        "description": "Nine blades line the dark wall above a sleepless figure. The shift has ended; the mind has declined to clock out.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "ten-of-swords",
          "name": "Ten of Swords",
          "numeral": "X",
          "arcana": "minor",
          "rank": "ten",
          "suit": "swords"
        },
        "theme": {
          "ingredientFamily": "bitters",
          "motifs": [
            "Exactly ten blades",
            "Prone symbolic figure",
            "Black sky",
            "Golden dawn",
            "Still sea"
          ]
        },
        "image": "/art/tarot/minor/swords/ten-of-swords.webp",
        "imageAlt": "X — Ten of Swords, reinterpreted through bitters. Exactly ten blades, Prone symbolic figure, Black sky.",
        "description": "Ten blades mark an ending beneath a black sky, while the horizon begins to brighten. The scene gives finality its full weight without making it the whole future.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "page-of-swords",
          "name": "Page of Swords",
          "numeral": "PAGE",
          "arcana": "minor",
          "rank": "page",
          "suit": "swords"
        },
        "theme": {
          "ingredientFamily": "bitters",
          "motifs": [
            "One raised blade-dropper",
            "Windblown young adult",
            "Rugged ground",
            "Birds"
          ]
        },
        "image": "/art/tarot/minor/swords/page-of-swords.webp",
        "imageAlt": "PAGE — Page of Swords, reinterpreted through bitters. One raised blade-dropper, Windblown young adult, Rugged ground.",
        "description": "The apprentice holds one blade in the wind and checks the ground around them. Curiosity is useful when it comes with attention.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "knight-of-swords",
          "name": "Knight of Swords",
          "numeral": "KNIGHT",
          "arcana": "minor",
          "rank": "knight",
          "suit": "swords"
        },
        "theme": {
          "ingredientFamily": "bitters",
          "motifs": [
            "One raised blade-dropper",
            "Charging white horse",
            "Windblown mantle",
            "Storm clouds"
          ]
        },
        "image": "/art/tarot/minor/swords/knight-of-swords.webp",
        "imageAlt": "KNIGHT — Knight of Swords, reinterpreted through bitters. One raised blade-dropper, Charging white horse, Windblown mantle.",
        "description": "The knight charges with one raised blade and a very clear destination. Conviction supplies momentum; the scene leaves room to question the haste.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "queen-of-swords",
          "name": "Queen of Swords",
          "numeral": "QUEEN",
          "arcana": "minor",
          "rank": "queen",
          "suit": "swords"
        },
        "theme": {
          "ingredientFamily": "bitters",
          "motifs": [
            "One vertical blade-dropper",
            "Open left hand",
            "Butterfly throne",
            "Wind and clouds"
          ]
        },
        "image": "/art/tarot/minor/swords/queen-of-swords.webp",
        "imageAlt": "QUEEN — Queen of Swords, reinterpreted through bitters. One vertical blade-dropper, Open left hand, Butterfly throne.",
        "description": "One upright blade and an open hand combine clarity with a willingness to hear. Experience has sharpened the queen's judgement without closing the conversation.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      },
      {
        "canonical": {
          "id": "king-of-swords",
          "name": "King of Swords",
          "numeral": "KING",
          "arcana": "minor",
          "rank": "king",
          "suit": "swords"
        },
        "theme": {
          "ingredientFamily": "bitters",
          "motifs": [
            "One upright blade-dropper",
            "Frontal throne",
            "Butterfly carvings",
            "Clear sky"
          ]
        },
        "image": "/art/tarot/minor/swords/king-of-swords.webp",
        "imageAlt": "KING — King of Swords, reinterpreted through bitters. One upright blade-dropper, Frontal throne, Butterfly carvings.",
        "description": "The king holds one blade from a steady frontal throne. Precision, reason and responsibility govern the measure.",
        "connection": "The bar theme comes from the F&B side of the portfolio: La Maison Du Whisky, Moonshots and WhiteHatOne.",
        "linkLabel": "Follow the F&B side quests",
        "href": "/timeline"
      }
    ]
  }
];
