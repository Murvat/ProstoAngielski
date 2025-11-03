export function hashString(input: string): number {
  const safeInput = unescape(encodeURIComponent(input));
  let hash = 2166136261;
  for (let i = 0; i < safeInput.length; i++) {
    hash ^= safeInput.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createSeededRandom(seed: string) {
  const timeComponent = `${Date.now()}-${Math.random()}`;
  const mixedSeed = `${seed}-${timeComponent}`;
  let state = hashString(mixedSeed) || 1;

  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

export function seededShuffle<T>(items: T[] | readonly T[] | null | undefined, seed: string): T[] {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  const result = [...items];
  if (result.length <= 1) {
    return result;
  }

  const random = createSeededRandom(seed);

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function randomShuffle<T>(items: T[] | readonly T[] | null | undefined): T[] {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

