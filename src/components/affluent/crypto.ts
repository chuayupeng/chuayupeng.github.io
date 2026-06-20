/* ============================================================================
   Optional password encryption for backups.
   The exported JSON is encrypted with AES-GCM under a key derived from the
   user's password (PBKDF2-SHA256, 210k iterations). Authenticated encryption
   means a wrong password (or a tampered file) fails to decrypt rather than
   producing garbage. Runs entirely in the browser via Web Crypto — the
   password is never stored or transmitted.
   ========================================================================== */

const FORMAT = "affluent.enc.v1";
const ITERATIONS = 600000;          // OWASP minimum for PBKDF2-HMAC-SHA256
const MAX_ITERATIONS = 5_000_000;   // reject a crafted file that would force a runaway derive
const enc = new TextEncoder();
const dec = new TextDecoder();

const toB64 = (bytes: Uint8Array) => {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
};
const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function deriveKey(password: string, salt: Uint8Array, iterations: number): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/** Is this file an af.fluent encrypted backup? */
export function isEncrypted(fileText: string): boolean {
  try { return JSON.parse(fileText)?.format === FORMAT; } catch { return false; }
}

/** Encrypt a plaintext string into a portable JSON wrapper. */
export async function encryptJSON(plaintext: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));   // PBKDF2 salt (independent)
  const iv = crypto.getRandomValues(new Uint8Array(12));     // AES-GCM nonce (independent, 96-bit)
  const key = await deriveKey(password, salt, ITERATIONS);
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plaintext));
  return JSON.stringify({
    format: FORMAT,
    kdf: "PBKDF2-SHA256",
    iterations: ITERATIONS,
    salt: toB64(salt),
    iv: toB64(iv),
    ciphertext: toB64(new Uint8Array(cipher)),
  }, null, 2);
}

/** Decrypt a wrapper produced by encryptJSON. Throws on wrong password / tampering. */
export async function decryptJSON(fileText: string, password: string): Promise<string> {
  const w = JSON.parse(fileText);
  if (w?.format !== FORMAT) throw new Error("Not an encrypted backup");
  // self-describing: derive with the iteration count stored in the file, bounded to a sane range
  const iterations = Number(w.iterations);
  if (!Number.isInteger(iterations) || iterations < 1 || iterations > MAX_ITERATIONS) throw new Error("Invalid backup parameters");
  const key = await deriveKey(password, fromB64(w.salt), iterations);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(w.iv) }, key, fromB64(w.ciphertext));
  return dec.decode(plain);
}

/** Web Crypto needs a secure context (https or localhost). */
export const cryptoAvailable = () =>
  typeof crypto !== "undefined" && !!crypto.subtle;
