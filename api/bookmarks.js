const { getBookmarksCollection } = require("./_db");
const { resolveUser } = require("./_auth");

module.exports = async function handler(request, response) {
  // Owner id comes from a verified Clerk token when logged in, else the
  // anonymous device id. A present-but-invalid token is rejected outright.
  const { userId, invalidToken } = await resolveUser(request);
  if (invalidToken) {
    return response.status(401).json({ error: "Invalid or expired session." });
  }
  if (!userId) {
    return response.status(400).json({ error: "Missing user id." });
  }

  let collection;
  try {
    collection = await getBookmarksCollection();
  } catch (error) {
    console.error("Bookmarks DB unavailable", error);
    return response.status(500).json({ error: "Bookmark storage is not configured." });
  }

  try {
    if (request.method === "GET") {
      const docs = await collection
        .find({ userId }, { projection: { _id: 0, userId: 0 } })
        .sort({ savedAt: -1 })
        .toArray();
      return response.status(200).json({ bookmarks: docs });
    }

    if (request.method === "POST") {
      const { bookmark } = request.body || {};
      if (!bookmark || typeof bookmark.id !== "string" || !bookmark.id.trim()) {
        return response.status(400).json({ error: "A bookmark with an id is required." });
      }

      const now = new Date().toISOString();
      const { userId: _ignored, ...fields } = bookmark;
      const doc = {
        ...fields,
        id: bookmark.id,
        savedAt: bookmark.savedAt || now,
        updatedAt: now,
      };

      await collection.updateOne(
        { userId, id: bookmark.id },
        { $set: { ...doc, userId } },
        { upsert: true }
      );
      return response.status(200).json({ bookmark: doc });
    }

    if (request.method === "DELETE") {
      const id = (request.query && request.query.id) || (request.body && request.body.id);
      if (typeof id !== "string" || !id.trim()) {
        return response.status(400).json({ error: "A bookmark id is required." });
      }
      await collection.deleteOne({ userId, id });
      return response.status(200).json({ ok: true });
    }

    response.setHeader("Allow", "GET, POST, DELETE");
    return response.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Bookmark request failed", error);
    return response.status(500).json({ error: "Unable to process bookmark right now." });
  }
};
