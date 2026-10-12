/**
 * Small deterministic pseudo-random generator (LCG).
 *
 * Decorative backgrounds (motes, digit columns, chart data) need
 * "random-looking" values, but Math.random() would produce different markup on
 * the server and the client and cause hydration mismatches. A seeded generator
 * gives the same sequence everywhere.
 */
export function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/** Rounds to one decimal place so SVG attributes stay compact and stable. */
export const r1 = (n: number): string => n.toFixed(1);
