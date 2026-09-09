const BOOKMARKS_KEY = "vplaylearn_bookmarks";

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

export function isBookmarked(id) {
  return getBookmarks().some((bookmark) => bookmark.id === id);
}

export function toggleBookmark(bookmark) {
  const bookmarks = getBookmarks();
  const exists = bookmarks.some((item) => item.id === bookmark.id);
  const next = exists
    ? bookmarks.filter((item) => item.id !== bookmark.id)
    : [{ ...bookmark, savedAt: new Date().toISOString() }, ...bookmarks];

  persist(next);
  return !exists;
}

export function removeBookmark(id) {
  persist(getBookmarks().filter((bookmark) => bookmark.id !== id));
}
