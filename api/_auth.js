const { verifyToken } = require("@clerk/backend");

// Resolves the trusted owner id for a request.
//
// If a Clerk session token is present (Authorization: Bearer <jwt>), it is
// verified server-side and the id comes from the token's `sub` claim — the
// client cannot forge this. Only when there is no token do we fall back to the
// client-supplied x-user-id, which is the anonymous device-id flow.
//
// Returns { userId, authenticated }. userId is null only if neither a valid
// token nor an x-user-id was provided.
async function resolveUser(request) {
  const auth = request.headers.authorization || request.headers.Authorization;
  const token =
    typeof auth === "string" && auth.startsWith("Bearer ")
      ? auth.slice(7).trim()
      : null;

  if (token) {
    try {
      const claims = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      if (claims && claims.sub) {
        return { userId: claims.sub, authenticated: true };
      }
    } catch (error) {
      // Invalid/expired token -> treat as unauthenticated. Do NOT silently fall
      // back to x-user-id here: a bad token is a signal something is wrong, and
      // trusting the header would defeat the verification.
      console.warn("Clerk token verification failed", error?.message || error);
      return { userId: null, authenticated: false, invalidToken: true };
    }
  }

  // Anonymous flow: trust the device id the client sends.
  const anon = request.headers["x-user-id"];
  if (typeof anon === "string" && anon.trim()) {
    return { userId: anon.trim(), authenticated: false };
  }

  return { userId: null, authenticated: false };
}

module.exports = { resolveUser };
