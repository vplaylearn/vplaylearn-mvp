// Judges whether a spoken transcript is "close enough" to the target proverb.
// Exact string matching is too strict for speech (accents, dropped articles,
// recognizer quirks), so we score word overlap and accept above a threshold.

// Lowercase, strip punctuation, collapse whitespace -> array of words.
function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ") // drop punctuation, keep letters/numbers (any script)
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

// Fraction of target words that appear in the spoken words (0..1).
// Uses a multiset so repeated target words must each be matched.
export function similarity(spoken, target) {
  const targetWords = normalize(target);
  if (targetWords.length === 0) return 0;

  const spokenCounts = new Map();
  for (const word of normalize(spoken)) {
    spokenCounts.set(word, (spokenCounts.get(word) || 0) + 1);
  }

  let matched = 0;
  for (const word of targetWords) {
    const remaining = spokenCounts.get(word) || 0;
    if (remaining > 0) {
      matched += 1;
      spokenCounts.set(word, remaining - 1);
    }
  }
  return matched / targetWords.length;
}

// Default 0.7: forgiving enough for a missed article or minor misread, strict
// enough that an unrelated sentence fails.
// ponytail: word-overlap heuristic, ignores order — fine for short proverbs;
// swap for a Levenshtein/sequence match if longer phrases need order sensitivity.
export function isCloseEnough(spoken, target, threshold = 0.7) {
  return similarity(spoken, target) >= threshold;
}
