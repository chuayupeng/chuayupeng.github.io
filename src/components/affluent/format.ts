/* Number + currency formatting, shared everywhere. */
import { useEffect, useRef, useState } from "react";

export const sgd = (n: number) =>
  "S$" + Math.round(n || 0).toLocaleString("en-SG");

export const sgdSigned = (n: number) =>
  (n < 0 ? "−S$" : "S$") + Math.round(Math.abs(n || 0)).toLocaleString("en-SG");

export const sgdShort = (n: number) => {
  const a = Math.abs(n || 0);
  const sign = n < 0 ? "−" : "";
  if (a >= 1e6) return sign + "S$" + (a / 1e6).toFixed(2) + "M";
  if (a >= 1e3) return sign + "S$" + (a / 1e3).toFixed(a >= 1e5 ? 0 : 1) + "K";
  return sign + "S$" + Math.round(a);
};

export const pct = (n: number, dp = 1) => (n * 100).toFixed(dp) + "%";

export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Smoothly count a number up/down when it changes. Honors reduced motion. */
export function useCountUp(value: number, ms = 450) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  const raf = useRef(0);
  useEffect(() => {
    const reduce = typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setDisplay(value); prev.current = value; return; }
    const from = prev.current, to = value, start = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - k, 3);
      setDisplay(from + (to - from) * eased);
      if (k < 1) raf.current = requestAnimationFrame(tick);
      else prev.current = to;
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, ms]);
  return display;
}
