const { getBookmarksCollection } = require("./_db");

// Ownership key. Today this is an anonymous device id sent by the client; once a
// login flow exists, pass the authenticated user id under the same field and
// nothing else here changes.
function getUserId(request) {
  const fromHeader = request.headers["x-user-id"];
  if (typeof fromHeader === "string" && fromHeader.trim()) return fromHeader.trim();
  const fromQuery = request.query && request.query.userId;
  if (typeof fromQuery === "string" && fromQuery.trim()) return fromQuery.trim();
  const fromBody = request.body && request.body.userId;
  if (typeof fromBody === "string" && fromBody.trim()) return fromBody.trim();
  return null;
}

module.exports = async function handler(request, response) {
  const userId = getUserId(request);
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
