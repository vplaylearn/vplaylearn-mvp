// Tracks which games the learner has unlocked and where they are in the proverb
// sequence. localStorage is the synchronous read source of truth (render paths
// stay sync); MongoDB is the durable backing store, keyed by the same userId as
// bookmarks so a future login swaps both at once.
import { getUserId } from "./bookmarks";

const PROGRESS_KEY = "vplaylearn_game_progress";
const API_URL = "/api/progress";

// Order defines the unlock sequence. The first game is unlocked from the start
// so there is always something to reach on the very first proverb.
export const GAME_ORDER = ["scramble", "flipGame", "anagram"];

function read() {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    if (parsed && Array.isArray(parsed.unlocked)) return parsed;
  } catch {
    // fall through to default
  }
  return { unlocked: [], proverbIndex: 0 };
}

function write(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota / privacy-mode errors.
  }
  pushProgress(progress);
}

// Fire-and-forget: the local write already succeeded, so a failed sync must not
// break the flow. The server reconciles on the next successful call.
function pushProgress(progress) {
  fetch(API_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-user-id": getUserId() },
    body: JSON.stringify({
      progress: { unlocked: progress.unlocked, proverbIndex: progress.proverbIndex },
    }),
  }).catch(() => {});
}

// Pull the server copy into the local cache. Call on app load and after login.
export async function syncProgressFromServer() {
  try {
    const res = await fetch(API_URL, {
      headers: { "Content-Type": "application/json", "x-user-id": getUserId() },
    });
    if (!res.ok) return read();
    const data = await res.json();
    const p = data.progress;
    if (p && Array.isArray(p.unlocked) && Number.isInteger(p.proverbIndex)) {
      // Write directly to storage (not write()) to avoid echoing back to server.
      try {
        localStorage.setItem(
          PROGRESS_KEY,
          JSON.stringify({ unlocked: p.unlocked, proverbIndex: p.proverbIndex })
        );
      } catch {
        // ignore
      }
      return p;
    }
  } catch {
    // Offline / unconfigured DB: keep local cache.
  }
  return read();
}

export function getProgress() {
  return read();
}

export function isUnlocked(gameId) {
  return read().unlocked.includes(gameId);
}

// The next game the learner can earn, or null once everything is unlocked.
export function nextLockedGame() {
  const { unlocked } = read();
  return GAME_ORDER.find((id) => !unlocked.includes(id)) || null;
}

export function allUnlocked() {
  return nextLockedGame() === null;
}

// Unlock the next game in sequence and advance the proverb pointer. Returns the
// id that was unlocked, or null if there was nothing left to unlock.
export function unlockNext() {
  const progress = read();
  const next = GAME_ORDER.find((id) => !progress.unlocked.includes(id));
  if (!next) return null;

  progress.unlocked = [...progress.unlocked, next];
  progress.proverbIndex = progress.proverbIndex + 1;
  write(progress);
  return next;
}

export function getProverbIndex() {
  return read().proverbIndex;
}

// Restart the loop: relock everything and go back to the first proverb.
export function resetProgress() {
  write({ unlocked: [], proverbIndex: 0 });
}
