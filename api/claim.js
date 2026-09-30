const { getDb } = require("./_db");
const { resolveUser } = require("./_auth");

// Merges an anonymous device's data into the logged-in account, called once on
// first login. Only an authenticated (verified token) user may claim, and only
// the id from their own token is used as the destination — a caller cannot
// claim into someone else's account.
module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { userId, authenticated, invalidToken } = await resolveUser(request);
  if (invalidToken || !authenticated || !userId) {
    return response.status(401).json({ error: "Sign in required to claim data." });
  }

  const anonymousId = request.body && request.body.anonymousId;
  if (typeof anonymousId !== "string" || !anonymousId.trim()) {
    return response.status(400).json({ error: "anonymousId is required." });
  }
  // Nothing to do if the "anonymous" id is already this account.
  if (anonymousId.trim() === userId) {
    return response.status(200).json({ ok: true, claimed: false });
  }
  const anonId = anonymousId.trim();

  let db;
  try {
    db = await getDb();
  } catch (error) {
    console.error("Claim DB unavailable", error);
    return response.status(500).json({ error: "Storage is not configured." });
  }

  try {
    const bookmarks = db.collection("bookmarks");
    const progress = db.collection("game_progress");

    // --- Bookmarks: move anon docs to the account, skipping ids the account
    // already has (the {userId,id} unique index would otherwise reject them).
    const existing = await bookmarks
      .find({ userId }, { projection: { _id: 0, id: 1 } })
      .toArray();
    const existingIds = new Set(existing.map((b) => b.id));

    const anonBookmarks = await bookmarks.find({ userId: anonId }).toArray();
    const toMove = anonBookmarks.filter((b) => !existingIds.has(b.id));
    if (toMove.length > 0) {
      await bookmarks.updateMany(
        { userId: anonId, id: { $in: toMove.map((b) => b.id) } },
        { $set: { userId } }
      );
    }
    // Drop any anon bookmarks that collided with an existing account bookmark.
    await bookmarks.deleteMany({ userId: anonId });

    // --- Progress: union unlocked games, take the furthest proverbIndex.
    const anonProgress = await progress.findOne({ userId: anonId });
    if (anonProgress) {
      const accountProgress = await progress.findOne({ userId });
      const unlocked = Array.from(
        new Set([
          ...((accountProgress && accountProgress.unlocked) || []),
          ...(anonProgress.unlocked || []),
        ])
      );
      const proverbIndex = Math.max(
        (accountProgress && accountProgress.proverbIndex) || 0,
        anonProgress.proverbIndex || 0
      );
      await progress.updateOne(
        { userId },
        { $set: { userId, unlocked, proverbIndex, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      await progress.deleteOne({ userId: anonId });
    }

    return response.status(200).json({ ok: true, claimed: true, movedBookmarks: toMove.length });
  } catch (error) {
    console.error("Claim failed", error);
    return response.status(500).json({ error: "Unable to merge data right now." });
  }
};
