// Bridges Clerk's async auth to the synchronous sync utils (bookmarks,
// gameProgress). A Clerk-aware component keeps this token fresh; apiHeaders()
// reads it synchronously. When no token is set, requests fall back to the
// anonymous x-user-id (device) flow.
let currentToken = null;

export function setAuthToken(token) {
  currentToken = token || null;
}

export function getAuthToken() {
  return currentToken;
}
