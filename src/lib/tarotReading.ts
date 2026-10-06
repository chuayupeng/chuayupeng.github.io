export type Orientation = "upright" | "reversed";

export interface TableCard {
  cardId: string;
  angle: number;
  offsetX: number;
  offsetY: number;
  slot: number;
}

export interface ReadingCard {
  cardId: string;
  orientation: Orientation;
  revealed: boolean;
  sourceAngle: number;
}

export interface TarotReading {
  version: 2;
  question: string;
  createdAt: string;
  cards: ReadingCard[];
  pool: TableCard[];
  shuffleCount: number;
}

export const STORAGE_KEY = "mixologists-celtic-cross-v2";
const SPREAD_SIZE = 10;
const MAX_QUESTION_LENGTH = 500;
const MAX_SHUFFLE_COUNT = 1_000_000;

function cryptoRandom(): number {
  const sample = new Uint32Array(1);
  globalThis.crypto.getRandomValues(sample);
  return sample[0] / 0x1_0000_0000;
}

function randomSample(random: () => number): number {
  const sample = random();
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
    throw new RangeError("The random source must return a number from zero up to, but not including, one.");
  }
  return sample;
}

function shuffledPool(cardIds: readonly string[], random: () => number): TableCard[] {
  const shuffled = [...cardIds];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(randomSample(random) * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled.map((cardId, slot) => ({
    cardId,
    angle: randomSample(random) * 360,
    offsetX: randomSample(random) * 24 - 12,
    offsetY: randomSample(random) * 44 - 22,
    slot,
  }));
}

export function orientationFromAngle(angle: number): Orientation {
  if (!Number.isFinite(angle)) throw new RangeError("A card angle must be finite.");
  let normalized = angle % 360;
  if (normalized < 0) normalized += 360;
  return normalized > 90 && normalized < 270 ? "reversed" : "upright";
}

export function createReading(
  cardIds: readonly string[],
  question: string,
  random: () => number = cryptoRandom,
): TarotReading {
  if (!Array.isArray(cardIds) || Array.from(cardIds).some((id) => typeof id !== "string" || id.length === 0)) {
    throw new TypeError("Card IDs must be nonempty strings.");
  }
  if (typeof question !== "string" || question.length > MAX_QUESTION_LENGTH) {
    throw new RangeError("A reading question must contain at most 500 characters.");
  }
  const uniqueIds = [...new Set(cardIds)];
  if (uniqueIds.length < SPREAD_SIZE) {
    throw new RangeError("A Celtic Cross reading needs at least ten unique cards.");
  }
  return {
    version: 2,
    question,
    createdAt: new Date().toISOString(),
    cards: [],
    pool: shuffledPool(uniqueIds, random),
    shuffleCount: 0,
  };
}

export function pickReadingCard(reading: TarotReading, cardId: string, halfTurn = false): TarotReading {
  if (reading.cards.length >= SPREAD_SIZE || reading.cards.some((card) => card.cardId === cardId)) return reading;
  const chosen = reading.pool.find((card) => card.cardId === cardId);
  if (!chosen) return reading;
  const sourceAngle = halfTurn ? (chosen.angle + 180) % 360 : chosen.angle;
  return {
    ...reading,
    cards: [...reading.cards, {
      cardId: chosen.cardId,
      orientation: orientationFromAngle(sourceAngle),
      revealed: false,
      sourceAngle,
    }],
    pool: reading.pool.filter((card) => card.cardId !== cardId),
  };
}

export function shuffleReadingPool(
  reading: TarotReading,
  random: () => number = cryptoRandom,
): TarotReading {
  if (reading.cards.length >= SPREAD_SIZE || reading.pool.length === 0
    || reading.shuffleCount >= MAX_SHUFFLE_COUNT) return reading;
  return {
    ...reading,
    pool: shuffledPool(reading.pool.map((card) => card.cardId), random),
    shuffleCount: reading.shuffleCount + 1,
  };
}

export function revealReadingCard(reading: TarotReading, index: number): TarotReading {
  const card = Number.isInteger(index) && index >= 0 ? reading.cards[index] : undefined;
  if (!card || card.revealed) return reading;
  return {
    ...reading,
    cards: reading.cards.map((entry, position) => position === index
      ? { ...entry, revealed: true }
      : entry),
  };
}

function hasExactKeys(value: unknown, keys: readonly string[]): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every((key) => Object.prototype.hasOwnProperty.call(value, key));
}

function isSavedDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return false;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString() === value;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isSavedAngle(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0 && value < 360;
}

export function parseSavedReading(raw: string | null, validIds: readonly string[]): TarotReading | null {
  if (typeof raw !== "string") return null;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!hasExactKeys(value, ["version", "question", "createdAt", "cards", "pool", "shuffleCount"])
    || value.version !== 2
    || typeof value.question !== "string" || value.question.length > MAX_QUESTION_LENGTH
    || !isSavedDate(value.createdAt)
    || !Array.isArray(value.cards) || value.cards.length > SPREAD_SIZE
    || !Array.isArray(value.pool)
    || !isFiniteNumber(value.shuffleCount) || !Number.isInteger(value.shuffleCount)
    || value.shuffleCount < 0 || value.shuffleCount > MAX_SHUFFLE_COUNT) return null;

  const allowedIds = new Set(validIds);
  if (allowedIds.size < SPREAD_SIZE || value.cards.length + value.pool.length !== allowedIds.size) return null;
  const seenIds = new Set<string>();
  const cards: ReadingCard[] = [];
  const pool: TableCard[] = [];
  const acceptId = (id: unknown): id is string => {
    if (typeof id !== "string" || id.length === 0 || !allowedIds.has(id) || seenIds.has(id)) return false;
    seenIds.add(id);
    return true;
  };

  for (const card of value.cards) {
    if (!hasExactKeys(card, ["cardId", "orientation", "revealed", "sourceAngle"])
      || !acceptId(card.cardId) || !isSavedAngle(card.sourceAngle)
      || (card.orientation !== "upright" && card.orientation !== "reversed")
      || card.orientation !== orientationFromAngle(card.sourceAngle)
      || typeof card.revealed !== "boolean") return null;
    cards.push({
      cardId: card.cardId,
      orientation: card.orientation,
      revealed: card.revealed,
      sourceAngle: card.sourceAngle,
    });
  }

  let previousSlot = -1;
  for (const card of value.pool) {
    if (!hasExactKeys(card, ["cardId", "angle", "offsetX", "offsetY", "slot"])
      || !acceptId(card.cardId) || !isSavedAngle(card.angle)
      || !isFiniteNumber(card.offsetX) || Math.abs(card.offsetX) > 12
      || !isFiniteNumber(card.offsetY) || Math.abs(card.offsetY) > 22
      || !isFiniteNumber(card.slot) || !Number.isInteger(card.slot)
      || card.slot <= previousSlot || card.slot < 0 || card.slot >= allowedIds.size) return null;
    previousSlot = card.slot;
    pool.push({
      cardId: card.cardId,
      angle: card.angle,
      offsetX: card.offsetX,
      offsetY: card.offsetY,
      slot: card.slot,
    });
  }
  return {
    version: 2,
    question: value.question,
    createdAt: value.createdAt,
    cards,
    pool,
    shuffleCount: value.shuffleCount,
  };
}
