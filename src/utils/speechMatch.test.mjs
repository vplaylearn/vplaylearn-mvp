// Runnable check for the speech-match heuristic (no framework).
// Run: node src/utils/speechMatch.test.mjs
import assert from "node:assert";
import { similarity, isCloseEnough } from "./speechMatch.js";

const target = "A word is enough for the wise";

// Exact read passes.
assert.strictEqual(isCloseEnough(target, target), true);

// Case + punctuation differences still pass.
assert.strictEqual(isCloseEnough("a word IS enough, for the wise!", target), true);

// One dropped article stays above the 0.7 threshold (6/7 ≈ 0.857).
assert.ok(similarity("word is enough for the wise", target) > 0.7);

// Unrelated sentence fails.
assert.strictEqual(isCloseEnough("the cat sat on the mat", target), false);

// Empty input fails, does not throw.
assert.strictEqual(isCloseEnough("", target), false);
assert.strictEqual(similarity("anything", ""), 0);

// Repeated target words need to each be matched (multiset behaviour).
assert.ok(similarity("very very good", "very very good") === 1);
assert.ok(similarity("very good", "very very good") < 1);

console.log("✓ speechMatch checks passed");
