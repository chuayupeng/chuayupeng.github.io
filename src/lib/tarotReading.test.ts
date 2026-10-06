import assert from "node:assert/strict";
import test from "node:test";
import {
  STORAGE_KEY, createReading, orientationFromAngle, parseSavedReading,
  pickReadingCard, revealReadingCard, shuffleReadingPool, type TarotReading,
} from "./tarotReading.ts";

const deck = Object.freeze(Array.from({ length: 78 }, (_, index) => `card-${index}`));
const ids = (reading: TarotReading) => reading.cards.map((card) => card.cardId);
const start = () => createReading(deck, "What deserves my attention?", () => 0.375);
const partial = () => {
  let reading = start();
  for (const cardId of ["card-56", "card-3", "card-71"]) reading = pickReadingCard(reading, cardId);
  return revealReadingCard(reading, 1);
};

test("creation lays out the full unique deck without automatically selecting cards", () => {
  for (const random of [() => 0, () => 0.5, () => 1 - Number.EPSILON]) {
    const reading = createReading([...deck, ...deck], "", random);
    assert.equal(reading.version, 2);
    assert.deepEqual(reading.cards, []);
    assert.equal(reading.pool.length, 78);
    assert.equal(new Set(reading.pool.map((card) => card.cardId)).size, 78);
    assert.equal(reading.shuffleCount, 0);
    assert.ok(reading.pool.every((card, index) => card.angle >= 0 && card.angle < 360
      && Math.abs(card.offsetX) <= 12 && Math.abs(card.offsetY) <= 22 && card.slot === index));
    assert.deepEqual(deck, Array.from({ length: 78 }, (_, index) => `card-${index}`));
  }
  assert.throws(() => createReading(Array(20).fill("same-card"), ""), /ten unique cards/);
  assert.throws(() => createReading(deck.slice(0, 9), ""), /ten unique cards/);
  assert.throws(() => createReading([...deck, ""], ""), /nonempty strings/);
});

test("angle determines nearest orientation, including ties, negatives and wraparound", () => {
  for (const angle of [0, 45, 89.999, 90, 270, 270.001, 315, 360, 450, 630, 720, -90, -270, -360, -720]) {
    assert.equal(orientationFromAngle(angle), "upright", `angle ${angle}`);
  }
  for (const angle of [90.001, 135, 180, 225, 269.999, 450.001, 540, -91, -180, -269, -540]) {
    assert.equal(orientationFromAngle(angle), "reversed", `angle ${angle}`);
  }
  for (const angle of [NaN, Infinity, -Infinity]) assert.throws(() => orientationFromAngle(angle), /finite/);
});

test("picking consumes the actual chosen ID and angle while preserving every other table position", () => {
  const original = start();
  const chosen = original.pool[39];
  const nextChosen = original.pool[3];
  original.pool.forEach(Object.freeze);
  Object.freeze(original.pool);
  Object.freeze(original.cards);
  Object.freeze(original);
  const picked = pickReadingCard(original, chosen.cardId);
  assert.deepEqual(picked.cards, [{
    cardId: chosen.cardId, orientation: orientationFromAngle(chosen.angle),
    sourceAngle: chosen.angle, revealed: false,
  }]);
  assert.deepEqual(picked.pool, original.pool.filter((card) => card.cardId !== chosen.cardId));
  assert.ok(picked.pool.every((card) => original.pool.includes(card)));
  assert.equal(picked.pool.find((card) => card.slot === 40)?.cardId, original.pool[40].cardId);
  assert.ok(!picked.pool.some((card) => card.slot === 39));
  assert.equal(picked.question, original.question);
  assert.equal(picked.createdAt, original.createdAt);
  assert.equal(original.cards.length, 0);
  const twice = pickReadingCard(picked, nextChosen.cardId);
  assert.deepEqual(ids(twice), [chosen.cardId, nextChosen.cardId]);
  assert.strictEqual(pickReadingCard(twice, chosen.cardId), twice);
  assert.strictEqual(pickReadingCard(twice, "not-on-table"), twice);
  assert.deepEqual(parseSavedReading(JSON.stringify(twice), deck), twice);
});

test("a preview half-turn commits the changed angle without mutating the table or previous picks", () => {
  const original = partial();
  const chosen = original.pool[12];
  const snapshot = JSON.stringify(original);
  original.cards.forEach(Object.freeze);
  original.pool.forEach(Object.freeze);
  Object.freeze(original.cards);
  Object.freeze(original.pool);
  Object.freeze(original);

  const picked = pickReadingCard(original, chosen.cardId, true);
  assert.deepEqual(picked.cards[picked.cards.length - 1], {
    cardId: chosen.cardId, orientation: "upright", sourceAngle: 315, revealed: false,
  });
  assert.equal(chosen.angle, 135);
  assert.equal(JSON.stringify(original), snapshot);
  assert.ok(original.cards.every((card, index) => picked.cards[index] === card));
  assert.deepEqual(picked.pool, original.pool.filter((card) => card.cardId !== chosen.cardId));
  assert.ok(picked.pool.every((card) => original.pool.includes(card)));
  assert.equal(picked.question, original.question);
  assert.equal(picked.createdAt, original.createdAt);
  assert.deepEqual(parseSavedReading(JSON.stringify(picked), deck), picked);
});

test("half-turn commits normalize wraparound and retain the upright rule at exact ties", () => {
  const cases = [
    [0, 180, "reversed"], [180, 0, "upright"], [315, 135, "reversed"],
    [90, 270, "upright"], [270, 90, "upright"], [359.5, 179.5, "reversed"],
  ] as const;
  for (const [angle, expectedAngle, expectedOrientation] of cases) {
    const original = start();
    const chosen = original.pool[5];
    const positioned = { ...original, pool: original.pool.map((card) => card === chosen ? { ...card, angle } : card) };
    const picked = pickReadingCard(positioned, chosen.cardId, true);
    assert.equal(picked.cards[0].sourceAngle, expectedAngle);
    assert.equal(picked.cards[0].orientation, expectedOrientation);
    assert.deepEqual(parseSavedReading(JSON.stringify(picked), deck), picked);
  }
});

test("two preview turns represented by false commit the original angle like an unturned pick", () => {
  const original = start();
  const chosen = original.pool[7];
  const picked = pickReadingCard(original, chosen.cardId, false);
  assert.deepEqual(picked, pickReadingCard(original, chosen.cardId));
  assert.equal(picked.cards[0].sourceAngle, chosen.angle);
  assert.equal(picked.cards[0].orientation, orientationFromAngle(chosen.angle));
  assert.strictEqual(pickReadingCard(picked, chosen.cardId, true), picked);
});

test("remaining-pool shuffle preserves picks and their angles while assigning new contiguous slots", () => {
  const original = partial();
  original.cards.forEach(Object.freeze);
  original.pool.forEach(Object.freeze);
  Object.freeze(original.cards);
  Object.freeze(original.pool);
  Object.freeze(original);
  const shuffled = shuffleReadingPool(original, () => 0.9);
  assert.strictEqual(shuffled.cards, original.cards);
  assert.deepEqual(shuffled.cards, original.cards);
  assert.equal(shuffled.question, original.question);
  assert.equal(shuffled.createdAt, original.createdAt);
  assert.equal(shuffled.shuffleCount, original.shuffleCount + 1);
  assert.equal(original.shuffleCount, 0);
  assert.deepEqual(new Set(shuffled.pool.map((card) => card.cardId)), new Set(original.pool.map((card) => card.cardId)));
  assert.notDeepEqual(shuffled.pool.map((card) => card.cardId), original.pool.map((card) => card.cardId));
  assert.ok(shuffled.pool.every((card, index) => card.angle === 324
    && card.offsetX > 9 && card.offsetY > 17 && card.slot === index));
  assert.ok(shuffled.pool.every((card) => !ids(shuffled).includes(card.cardId)));
  assert.deepEqual(parseSavedReading(JSON.stringify(shuffled), deck), shuffled);
});

test("ten chosen cards stop picks and shuffles without consuming randomness", () => {
  let reading = start();
  const chosenIds = ["card-77", "card-0", "card-33", "card-56", "card-19", "card-42", "card-5", "card-62", "card-9", "card-48"];
  for (const cardId of chosenIds) reading = pickReadingCard(reading, cardId);
  assert.deepEqual(ids(reading), chosenIds);
  assert.equal(reading.pool.length, 68);
  assert.strictEqual(pickReadingCard(reading, reading.pool[0].cardId), reading);
  assert.strictEqual(shuffleReadingPool(reading, () => { throw new Error("must not shuffle"); }), reading);
});

test("reveal changes only visibility and preserves identity, source angle and orientation", () => {
  const reading = partial();
  const revealed = revealReadingCard(reading, 0);
  assert.deepEqual(ids(revealed), ids(reading));
  assert.strictEqual(revealed.pool, reading.pool);
  assert.equal(revealed.cards[0].revealed, true);
  assert.equal(reading.cards[0].revealed, false);
  assert.equal(revealed.cards[0].orientation, reading.cards[0].orientation);
  assert.equal(revealed.cards[0].sourceAngle, reading.cards[0].sourceAngle);
  assert.strictEqual(revealed.cards[2], reading.cards[2]);
  assert.strictEqual(revealReadingCard(revealed, 0), revealed);
  for (const index of [-1, 3, 10, 0.5, NaN, Infinity]) assert.strictEqual(revealReadingCard(revealed, index), revealed);
});

test("crypto creation and restore support empty, partial, shuffled and complete selections", () => {
  const created = createReading(deck, "A question");
  assert.deepEqual(parseSavedReading(JSON.stringify(created), deck), created);
  const initialProgress = partial();
  assert.deepEqual(parseSavedReading(JSON.stringify(initialProgress), deck), initialProgress);
  const progress = shuffleReadingPool(partial(), () => 0.8);
  assert.deepEqual(parseSavedReading(JSON.stringify(progress), deck), progress);
  let complete = progress;
  while (complete.cards.length < 10) complete = pickReadingCard(complete, complete.pool[0].cardId);
  assert.deepEqual(parseSavedReading(JSON.stringify(complete), deck), complete);
  assert.equal(STORAGE_KEY, "mixologists-celtic-cross-v2");
});

test("restore rejects altered orientations, invalid layouts and broken whole-deck partitions", () => {
  for (const raw of [null, "", "{", "null", "[]", "true", '"reading"']) assert.equal(parseSavedReading(raw, deck), null);
  const selected = (reading: Record<string, unknown>) => reading.cards as Record<string, unknown>[];
  const pool = (reading: Record<string, unknown>) => reading.pool as Record<string, unknown>[];
  const mutations: Array<[string, (reading: Record<string, unknown>) => void]> = [
    ["old v1", (reading) => { reading.version = 1; }],
    ["missing question", (reading) => { delete reading.question; }],
    ["nonstring question", (reading) => { reading.question = {}; }],
    ["long question", (reading) => { reading.question = "x".repeat(501); }],
    ["invalid date", (reading) => { reading.createdAt = "not-a-date"; }],
    ["impossible date", (reading) => { reading.createdAt = "2026-02-30T12:00:00.000Z"; }],
    ["noncanonical date", (reading) => { reading.createdAt = "2026-01-01"; }],
    ["missing pool", (reading) => { delete reading.pool; }],
    ["nonarray pool", (reading) => { reading.pool = {}; }],
    ["nonarray selection", (reading) => { reading.cards = {}; }],
    ["lost card", (reading) => { pool(reading).pop(); }],
    ["extra card", (reading) => { pool(reading).push(pool(reading)[0]); }],
    ["null selected", (reading) => { reading.cards = [null, ...selected(reading).slice(1)]; }],
    ["null pool entry", (reading) => { reading.pool = [null, ...pool(reading).slice(1)]; }],
    ["unknown selected ID", (reading) => { selected(reading)[0].cardId = "not-in-deck"; }],
    ["unknown pool ID", (reading) => { pool(reading)[0].cardId = "not-in-deck"; }],
    ["duplicate selected ID", (reading) => { selected(reading)[1].cardId = selected(reading)[0].cardId; }],
    ["duplicate pool ID", (reading) => { pool(reading)[1].cardId = pool(reading)[0].cardId; }],
    ["cross-partition duplicate", (reading) => { pool(reading)[0].cardId = selected(reading)[0].cardId; }],
    ["invalid orientation", (reading) => { selected(reading)[0].orientation = "sideways"; }],
    ["orientation contradicts angle", (reading) => { selected(reading)[0].orientation = "upright"; }],
    ["source angle outside range", (reading) => { selected(reading)[0].sourceAngle = 495; }],
    ["source angle nonnumeric", (reading) => { selected(reading)[0].sourceAngle = "135"; }],
    ["invalid reveal flag", (reading) => { selected(reading)[0].revealed = "false"; }],
    ["missing source angle", (reading) => { delete selected(reading)[0].sourceAngle; }],
    ["negative pool angle", (reading) => { pool(reading)[0].angle = -1; }],
    ["pool angle 360", (reading) => { pool(reading)[0].angle = 360; }],
    ["nonnumeric pool angle", (reading) => { pool(reading)[0].angle = null; }],
    ["horizontal offset outside bound", (reading) => { pool(reading)[0].offsetX = 12.01; }],
    ["vertical offset outside bound", (reading) => { pool(reading)[0].offsetY = -22.01; }],
    ["negative shuffle count", (reading) => { reading.shuffleCount = -1; }],
    ["fractional shuffle count", (reading) => { reading.shuffleCount = 0.5; }],
    ["unbounded shuffle count", (reading) => { reading.shuffleCount = 1_000_001; }],
    ["missing slot", (reading) => { delete pool(reading)[0].slot; }],
    ["negative slot", (reading) => { pool(reading)[0].slot = -1; }],
    ["slot outside full deck", (reading) => { pool(reading)[pool(reading).length - 1].slot = 78; }],
    ["duplicate slot", (reading) => { pool(reading)[1].slot = pool(reading)[0].slot; }],
    ["fractional slot", (reading) => { pool(reading)[0].slot = 0.5; }],
    ["out-of-order slots", (reading) => { reading.pool = [...pool(reading)].reverse(); }],
    ["unexpected selected field", (reading) => { selected(reading)[0].position = 12; }],
    ["unexpected pool field", (reading) => { pool(reading)[0].revealed = false; }],
    ["unexpected root field", (reading) => { reading.deck = deck; }],
  ];
  for (const [name, mutate] of mutations) {
    const tampered = JSON.parse(JSON.stringify(partial()));
    mutate(tampered);
    assert.equal(parseSavedReading(JSON.stringify(tampered), deck), null, name);
  }
  let complete = partial();
  while (complete.cards.length < 10) complete = pickReadingCard(complete, complete.pool[0].cardId);
  const extra = complete.pool[0];
  const eleven = { ...complete,
    cards: [...complete.cards, { cardId: extra.cardId, sourceAngle: extra.angle,
      orientation: orientationFromAngle(extra.angle), revealed: false }],
    pool: complete.pool.slice(1),
  };
  assert.equal(parseSavedReading(JSON.stringify(eleven), deck), null);
});

test("question and random-source boundaries cannot create invalid saves", () => {
  const reading = createReading(deck, "x".repeat(500), () => 0.5);
  assert.deepEqual(parseSavedReading(JSON.stringify(reading), deck), reading);
  assert.throws(() => createReading(deck, "x".repeat(501)), /500 characters/);
  for (const value of [-0.1, 1, Infinity, NaN]) {
    assert.throws(() => createReading(deck, "", () => value), /random source/);
    assert.throws(() => shuffleReadingPool(reading, () => value), /random source/);
  }
  const capped = { ...reading, shuffleCount: 1_000_000 };
  assert.strictEqual(shuffleReadingPool(capped, () => { throw new Error("must not shuffle"); }), capped);
});
