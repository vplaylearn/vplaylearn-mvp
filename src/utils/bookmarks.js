const BOOKMARKS_KEY = "vplaylearn_bookmarks";
import { getAuthToken } from "./authToken";

const USER_ID_KEY = "vplaylearn_user_id";
const API_URL = "/api/bookmarks";

// Ownership key. Until a login flow exists we mint an anonymous per-device id;
// once users can log in, call setUserId(realUserId) and reads/writes move to
// that account with no other change.
function readUserId() {
  try {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id =
        (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
        `anon-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
  } catch {
    return "anon-fallback";
  }
}

export function getUserId() {
  return readUserId();
}

export function setUserId(userId) {
  if (!userId) return;
  try {
    localStorage.setItem(USER_ID_KEY, userId);
  } catch {
    // Ignore storage errors; sync just falls back to the previous id.
  }
  // Bring the new owner's data into the local caches. Dynamic import for game
  // progress avoids a static import cycle (gameProgress imports getUserId here).
  syncFromServer();
  import("./gameProgress")
    .then((m) => m.syncProgressFromServer())
    .catch(() => {});
}

// localStorage is the synchronous read source of truth so render paths stay
// synchronous; Mongo is the durable backing store kept in sync on writes.
export function getBookmarks() {
  try {
    const saved = localStorage.getItem(BOOKMARKS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function persist(bookmarks) {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch {
    // Ignore storage quota and privacy-mode errors.
  }
}

function apiHeaders() {
  const headers = { "Content-Type": "application/json", "x-user-id": readUserId() };
  // When logged in, attach the Clerk token so the server derives (and trusts)
  // the real user id from it instead of the client-supplied x-user-id.
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export { apiHeaders };

// Fire-and-forget: local write already succeeded, so a failed sync must not
// break the UI. Server reconciles on the next successful call.
function pushBookmark(bookmark) {
  fetch(API_URL, {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify({ bookmark }),
  }).catch(() => {});
}

function deleteBookmark(id) {
  fetch(`${API_URL}?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: apiHeaders(),
  }).catch(() => {});
}

// Pull the server copy into the local cache. Call on app load and after login.
export async function syncFromServer() {
  try {
    const res = await fetch(API_URL, { headers: apiHeaders() });
    if (!res.ok) return getBookmarks();
    const data = await res.json();
    if (Array.isArray(data.bookmarks)) {
      persist(data.bookmarks);
      return data.bookmarks;
    }
  } catch {
    // Offline or unconfigured DB: keep the local cache as-is.
  }
  return getBookmarks();
}

export function isBookmarked(id) {
  return getBookmarks().some((bookmark) => bookmark.id === id);
}

export function toggleBookmark(bookmark) {
  const bookmarks = getBookmarks();
  const exists = bookmarks.some((item) => item.id === bookmark.id);

  if (exists) {
    persist(bookmarks.filter((item) => item.id !== bookmark.id));
    deleteBookmark(bookmark.id);
    return false;
  }

  const now = new Date().toISOString();
  const saved = { ...bookmark, savedAt: now, updatedAt: now };
  persist([saved, ...bookmarks]);
  pushBookmark(saved);
  return true;
}

export function removeBookmark(id) {
  persist(getBookmarks().filter((bookmark) => bookmark.id !== id));
  deleteBookmark(id);
}
